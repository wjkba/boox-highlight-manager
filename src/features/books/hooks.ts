import { useLiveQuery } from "dexie-react-hooks";
import { getBook, getBooks, getBookHighlights } from "./api";

export const useBooks = () => useLiveQuery(getBooks);
/** undefined while loading, null when the book does not exist. */
export const useBook = (bookId: number) => useLiveQuery(async () => (await getBook(bookId)) ?? null, [bookId]);
export const useBookHighlights = (bookId: number) => useLiveQuery(() => getBookHighlights(bookId), [bookId]);
