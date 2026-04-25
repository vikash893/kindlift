/**
 * @fileoverview Location Search Hook
 *
 * A reusable custom hook for location autocomplete using the backend
 * Photon+Nominatim dual-API route. Each hook instance is fully isolated —
 * source and destination fields never cancel each other's requests.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import api from './api';

const DEBOUNCE_MS = 300;       // Fast — Photon responds in < 200ms
const MIN_QUERY_LENGTH = 2;    // Trigger on short names like "Bi" → "Bila"
const MAX_SUGGESTIONS = 8;
const CACHE_TTL = 3600000;     // 1 hour

export function useLocationSearch(initialValue = '') {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false); // specifically for GPS location


  const debounceTimer = useRef(null);
  const abortController = useRef(null);
  const cache = useRef(new Map());

  /**
   * Cancel any pending debounce timer and in-flight HTTP request.
   */
  const cancel = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => cancel, [cancel]);

  /**
   * Executes the actual API call after debounce fires.
   */
  const executeSearch = useCallback(async (searchQuery) => {
    const key = searchQuery.toLowerCase().trim();

    // Return cached results if still fresh
    const cached = cache.current.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setSuggestions(cached.data);
      setLoading(false);
      return;
    }

    // Cancel previous in-flight request before starting a new one
    if (abortController.current) abortController.current.abort();

    const controller = new AbortController();
    abortController.current = controller;

    try {
      const res = await api.get(`/location/search?q=${encodeURIComponent(searchQuery)}`, {
        signal: controller.signal,
        timeout: 8000,
      });

      if (controller.signal.aborted) return;

      if (res.data && Array.isArray(res.data)) {
        const limited = res.data.slice(0, MAX_SUGGESTIONS);
        cache.current.set(key, { data: limited, timestamp: Date.now() });
        setSuggestions(limited);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      console.warn('Location search failed:', err.message);
      setSuggestions([]);
    } finally {
      if (abortController.current === controller) abortController.current = null;
      setLoading(false);
    }
  }, []);

  /**
   * Debounced input change handler — call from input onChange.
   */
  const handleInputChange = useCallback((value) => {
    setQuery(value);
    setCoords(null);
    cancel();

    if (!value || value.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(() => {
      executeSearch(value.trim());
    }, DEBOUNCE_MS);
  }, [cancel, executeSearch]);

  /**
   * Select a suggestion from the dropdown.
   */
  const selectSuggestion = useCallback((item) => {
    cancel();
    setQuery(item.display_name);
    setCoords({ lat: Number(item.lat), lng: Number(item.lon) });
    setSuggestions([]);
    setLoading(false);
  }, [cancel]);

  /**
   * Dismiss suggestions on blur (delay so click can fire first).
   */
  const dismissSuggestions = useCallback(() => {
    setTimeout(() => setSuggestions([]), 200);
  }, []);

  /**
   * Use HTML5 Geolocation to get current location
   */
  const useCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    setQuery("Detecting location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await api.get(`/location/reverse?lat=${latitude}&lon=${longitude}`);
          if (res.data) {
            setQuery(res.data.display_name);
            setCoords({ lat: latitude, lng: longitude });
          } else {
            setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setCoords({ lat: latitude, lng: longitude });
          }
        } catch (error) {
          console.error("Reverse geocode failed:", error);
          setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setCoords({ lat: latitude, lng: longitude });
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setQuery("");
        setLocating(false);
        alert("Failed to get your location. Please check browser permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    coords,
    loading,
    locating,
    handleInputChange,
    selectSuggestion,
    dismissSuggestions,
    useCurrentLocation,
    cancel,
  };
}

