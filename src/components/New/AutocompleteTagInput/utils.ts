export interface AutocompleteTagInputSuggestion {
  /** The tag added when the suggestion is picked. */
  value: string;
  /** The suggestion's name, shown at the leading edge of its row. */
  label: string;
  /** Secondary text shown at the trailing edge of the row, e.g. the value itself. */
  description?: string;
}

/**
 * The suggestions to show for the typed text: not already a tag, and with the
 * query in their label, value or description (case-insensitive), in the order
 * given, capped at `limit`.
 *
 * Kept pure and separate from the component so the filtering can be tested
 * without driving the input.
 */
export const filterAutocompleteSuggestions = (
  suggestions: AutocompleteTagInputSuggestion[],
  query: string,
  tags: string[],
  limit: number,
): AutocompleteTagInputSuggestion[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const tagSet = new Set(tags);

  return suggestions
    .filter(
      ({ value, label, description }) =>
        !tagSet.has(value) &&
        [label, value, description].some((text) =>
          text?.toLowerCase().includes(normalizedQuery),
        ),
    )
    .slice(0, Math.max(limit, 0));
};
