/**
 * LocationInput — Reusable autocomplete input for Indian locations.
 *
 * Props:
 *   field       — result of useLocationSearch()
 *   label       — label text
 *   placeholder — input placeholder
 *   icon        — lucide icon component (optional)
 *   iconColor   — tailwind text color class for icon (optional)
 *   id          — id for the input element
 */
import React from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';

/**
 * Trims a Photon/Nominatim display_name to a sensible short form.
 * e.g. "Bilaspur, Rampur District, Uttar Pradesh, India" → shows full for selection
 *      but for the list item shows "Bilaspur, Rampur District, Uttar Pradesh"
 */
function shortName(displayName) {
  if (!displayName) return '';
  // Remove trailing ", India" since we're India-only
  return displayName.replace(/, India$/, '');
}

/**
 * Extracts the primary place name (first token) for bold display.
 */
function primaryName(displayName) {
  return displayName.split(',')[0]?.trim() || displayName;
}

/**
 * Extracts the secondary context (rest after first comma).
 */
function secondaryName(displayName) {
  const idx = displayName.indexOf(',');
  if (idx === -1) return '';
  return displayName.slice(idx + 1).replace(/, India$/, '').trim();
}

export function LocationInput({
  field,
  label,
  placeholder = 'Type a city, village or landmark...',
  icon: Icon = MapPin,
  iconColor = 'text-brand-accent',
  id,
  showCurrentLocation = false,
}) {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="block text-sm font-display font-semibold text-brand-dark mb-3">
          <Icon className={`h-3.5 w-3.5 inline mr-1 ${iconColor}`} />
          {label}
        </label>
      )}

      {/* Input + spinner */}
      <div className="relative">
        <input
          id={id}
          type="text"
          required
          autoComplete="off"
          className={`input-modern ${showCurrentLocation ? 'pr-16' : 'pr-10'}`}
          placeholder={placeholder}
          value={field.query}
          onChange={(e) => field.handleInputChange(e.target.value)}
          onBlur={field.dismissSuggestions}
        />
        
        {/* Loading spinner */}
        {field.loading && !field.locating && (
          <Loader2 className={`absolute ${showCurrentLocation ? 'right-10' : 'right-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted animate-spin pointer-events-none`} />
        )}

        {/* Current Location Button */}
        {showCurrentLocation && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); field.useCurrentLocation(); }}
            disabled={field.locating}
            title="Use current location"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-brand-accent hover:bg-brand-accent/10 transition-colors disabled:opacity-50"
          >
            {field.locating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {field.suggestions.length > 0 && (
        <ul
          className="absolute z-50 w-full bg-white border border-brand-gray-light rounded-2xl mt-1.5 shadow-xl overflow-hidden"
          style={{ maxHeight: '280px', overflowY: 'auto' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {field.suggestions.map((item, index) => {
            const name = shortName(item.display_name);
            const primary = primaryName(name);
            const secondary = secondaryName(name);
            return (
              <li
                key={`${id}-${item.place_id || index}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-brand-dark/5 cursor-pointer transition-colors border-b border-brand-gray-light/50 last:border-0"
                onMouseDown={() => field.selectSuggestion(item)}
              >
                <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{primary}</p>
                  {secondary && (
                    <p className="text-xs text-brand-muted truncate">{secondary}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
