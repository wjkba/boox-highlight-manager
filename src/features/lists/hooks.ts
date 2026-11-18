import { useLiveQuery } from "dexie-react-hooks";
import { getList, getLists, getListBooks, getListHighlights } from "./api";

export const useLists = () => useLiveQuery(getLists);
/** undefined while loading, null when the list does not exist. */
export const useList = (listId: number) => useLiveQuery(async () => (await getList(listId)) ?? null, [listId]);
export const useListBooks = () => useLiveQuery(getListBooks);
export const useListHighlights = (ids: number[]) => useLiveQuery(() => getListHighlights(ids), [ids]);
