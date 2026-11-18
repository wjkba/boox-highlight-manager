import { useStarredHighlights, useHighlightBooks } from "../hooks";
import HighlightCard from "../components/highlight-card";
import Page from "@/components/ui/page";
import EmptyState from "@/components/ui/empty-state";

export default function StarredPage() {
  const starredHighlights = useStarredHighlights();
  const books = useHighlightBooks(starredHighlights ?? []);

  return (
    <Page title="Starred" back={{ to: "/lists", label: "Lists" }}>
      {starredHighlights?.length === 0 && (
        <EmptyState title="Nothing starred yet">
          Star a highlight from its options menu or during daily review.
        </EmptyState>
      )}
      {starredHighlights && starredHighlights.length > 0 && (
        <div className="grid gap-2">
          {starredHighlights.map((highlight) => (
            <HighlightCard
              key={highlight.id}
              text={highlight.quote}
              starred={highlight.starred}
              id={highlight.id}
              bookId={highlight.bookId}
              book={books?.[highlight.bookId]}
            />
          ))}
        </div>
      )}
    </Page>
  );
}
