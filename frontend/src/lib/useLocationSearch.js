/**
 * @fileoverview Location Search Hook
 *
 * A reusable custom hook for location autocomplete with proper
 * debouncing and request cancellation. Each hook instance maintains
 * its own debounce timer, AbortController, and cache — so source
 * and destination fields never interfere with each other.
 *
 * @requires ../lib/api - Axios API client
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import api from './api';

const DEBOUNCE_MS = 500;
const MIN_QUERY_LENGTH = 3;
const MAX_SUGGESTIONS = 5;
const CACHE_TTL = 3600000; // 1 hour

/**
 * Custom hook for a single location search field.
 *
 * @param {string} [initialValue=''] - Pre-filled query value (e.g. from route state)
 * @returns {{
 *   query: string,
 *   setQuery: Function,
 *   suggestions: Array,
 *   coords: {lat: number, lng: number} | null,
 *   loading: boolean,
 *   handleInputChange: Function,
 *   selectSuggestion: Function,
 *   dismissSuggestions: Function,
 *   cancel: Function,
 * }}
 */
export function useLocationSearch(initialValue = '') {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

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
   * Executes the actual API call (called after debounce fires).
   */
  const executeSearch = useCallback(async (searchQuery) => {
    const key = searchQuery.toLowerCase();

    // Return cached results if still fresh
    const cached = cache.current.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setSuggestions(cached.data);
      setLoading(false);
      return;
    }

    // Cancel previous in-flight request before starting a new one
    if (abortController.current) {
      abortController.current.abort();
    }

    const controller = new AbortController();
    abortController.current = controller;

    try {
      const res = await api.get(`/location/search?q=${encodeURIComponent(searchQuery)}`, {
        signal: controller.signal,
        timeout: 10000,
      });

      // Don't update state if this request was aborted while awaiting
      if (controller.signal.aborted) return;

      if (res.data && Array.isArray(res.data)) {
        const limited = res.data.slice(0, MAX_SUGGESTIONS);
        cache.current.set(key, { data: limited, timestamp: Date.now() });
        setSuggestions(limited);
      }
    } catch (err) {
      // Silently ignore cancellation errors
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setSuggestions([]);
    } finally {
      // Only clear the ref if this controller is still the active one
      if (abortController.current === controller) {
        abortController.current = null;
      }
      setLoading(false);
    }
  }, []);

  /**
   * Debounced input change handler.
   * Call this from the input's onChange.
   *
   * @param {string} value - Current input value
   */
  const handleInputChange = useCallback((value) => {
    setQuery(value);
    setCoords(null);

    // Cancel previous debounce + any in-flight request
    cancel();

    if (!value || value.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(() => {
      executeSearch(value);
    }, DEBOUNCE_MS);
  }, [cancel, executeSearch]);

  /**
   * Select a suggestion from the dropdown.
   *
   * @param {{ display_name: string, lat: string, lon: string }} item
   */
  const selectSuggestion = useCallback((item) => {
    cancel();
    setQuery(item.display_name);
    setCoords({ lat: Number(item.lat), lng: Number(item.lon) });
    setSuggestions([]);
  }, [cancel]);

  /**
   * Dismiss suggestions (call on input blur).
   */
  const dismissSuggestions = useCallback(() => {
    // Small delay so click on suggestion can register first
    setTimeout(() => setSuggestions([]), 200);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    coords,
    loading,
    handleInputChange,
    selectSuggestion,
    dismissSuggestions,
    cancel,
  };
}
