import { useLiveQuery } from "dexie-react-hooks";
import { getAllHighlights, getBooksForHighlights, getHighlight, getHighlightBook, getHighlightsForBook, getRecentHighlights, getStarredHighlights } from "./api";

export const useRecentHighlights = () => useLiveQuery(getRecentHighlights);
export const useAllHighlights = (sortOption: string, sortOrder: "asc" | "desc") =>
  useLiveQuery(() => getAllHighlights(sortOption, sortOrder), [sortOption, sortOrder]);
export const useStarredHighlights = () => useLiveQuery(getStarredHighlights);
/** undefined while loading, null when the highlight does not exist. */
export const useHighlight = (highlightId: number) => useLiveQuery(async () => (await getHighlight(highlightId)) ?? null, [highlightId]);
export const useHighlightBook = (bookId: number | undefined) => useLiveQuery(() => bookId === undefined ? undefined : getHighlightBook(bookId), [bookId]);
export const useBookHighlights = (bookId: number) => useLiveQuery(() => getHighlightsForBook(bookId), [bookId]);
export const useHighlightBooks = (highlights: import("@/lib/db/types").Highlight[]) => useLiveQuery(() => getBooksForHighlights(highlights), [highlights]);
