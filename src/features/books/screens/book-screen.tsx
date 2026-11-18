import { useBook, useBookHighlights } from "../hooks";
import { ScrollRestoration, useParams } from "react-router-dom";
import type { ElementType } from "react";
import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Page from "@/components/ui/page";
import EmptyState from "@/components/ui/empty-state";

export default function BookPage({
  HighlightsListComponent,
  SearchBarComponent,
  SortOptionsComponent,
}: {
  HighlightsListComponent: ElementType;
  SearchBarComponent: ElementType;
  SortOptionsComponent: ElementType;
}) {
  const { bookId } = useParams();
  const book = useBook(Number(bookId));
  const [sortOption, setSortOption] = useState("dateHighlighted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(20);

  const highlights = useBookHighlights(Number(bookId));

  const sortedHighlights = useMemo(() => {
    if (!highlights) return [];

    const sorted = [...highlights];

    if (sortOption === "dateAdded") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          : new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      );
    } else if (sortOption === "alphabet") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? b.quote.localeCompare(a.quote)
          : a.quote.localeCompare(b.quote)
      );
    } else {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return sorted;
  }, [highlights, sortOption, sortOrder]);

  const displayedHighlights = useMemo(() => {
    return sortedHighlights.slice(0, limit);
  }, [sortedHighlights, limit]);

  const filteredHighlights = useMemo(() => {
    if (!searchValue.trim()) return displayedHighlights;
    return displayedHighlights.filter((highlight) =>
      highlight.quote.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [displayedHighlights, searchValue]);

  function handleLoadMore() {
    setLimit((prevLimit) => prevLimit + 20);
  }

  if (book && displayedHighlights) {
    return (
      <Page
        title={book.bookTitle}
        description={book.bookAuthor}
        back={{ to: "/books", label: "Books" }}
      >
        <div className="mb-4 flex gap-2">
          <div className="min-w-0 flex-1">
            <SearchBarComponent setSearchValue={setSearchValue} />
          </div>
          <SortOptionsComponent
            sortOption={sortOption}
            setSortOption={setSortOption}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
        <HighlightsListComponent highlights={filteredHighlights} />
        {limit <= displayedHighlights.length && (
          <Button text="Load more" onClick={handleLoadMore} className="mt-6 w-full" />
        )}
        <ScrollRestoration />
      </Page>
    );
  }

  return (
    <Page back={{ to: "/books", label: "Books" }}>
      {book === null && <EmptyState title="Book not found">It may have been deleted.</EmptyState>}
      <ScrollRestoration />
    </Page>
  );
}
