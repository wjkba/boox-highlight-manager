import { useList, useListBooks } from "../hooks";
import { getListHighlights } from "../api";
import type { ElementType } from "react";
import { Book, Highlight, List } from "@/lib/db/types";
import { useEffect, useState } from "react";
import { ScrollRestoration, useParams } from "react-router-dom";
import Page from "@/components/ui/page";
import EmptyState from "@/components/ui/empty-state";

async function fetchHighlights(list: List) {
  return getListHighlights(list.highlightIds) as Promise<Highlight[]>;
}

export default function ListPage({ HighlightCardComponent }: { HighlightCardComponent: ElementType }) {
  const { listId } = useParams();
  const list = useList(Number(listId));
  const books = useListBooks();
  const booksById: Record<number, Book> = {};
  books?.forEach((book) => {
    booksById[book.id] = book;
  });
  const [highlights, setHighlights] = useState<null | Highlight[]>(null);

  useEffect(() => {
    if (list && list.highlightIds) {
      fetchHighlights(list).then(setHighlights);
    }
  }, [list]);

  const back = { to: "/lists", label: "Lists" };

  if (list && list.highlightIds.length <= 0) {
    return (
      <Page title={list.name} back={back}>
        <EmptyState title="This list is empty">
          Add highlights to it from any highlight’s options menu.
        </EmptyState>
      </Page>
    );
  }

  if (list && highlights) {
    return (
      <Page title={list.name} back={back}>
        <div className="grid gap-2">
          {highlights.map((highlight) => (
            <HighlightCardComponent
              key={highlight.id}
              text={highlight.quote}
              bookId={highlight.bookId}
              starred={highlight.starred}
              id={highlight.id}
              book={booksById[highlight.bookId]}
              options={["showRemove"]}
            />
          ))}
        </div>
        <ScrollRestoration />
      </Page>
    );
  }

  return (
    <Page back={back}>
      {list === null && <EmptyState title="List not found">It may have been deleted.</EmptyState>}
      <ScrollRestoration />
    </Page>
  );
}
