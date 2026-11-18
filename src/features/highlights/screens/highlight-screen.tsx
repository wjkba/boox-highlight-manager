import { useHighlight, useHighlightBook } from "../hooks";
import HighlightCard from "../components/highlight-card";
import { useParams } from "react-router-dom";
import Page from "@/components/ui/page";
import EmptyState from "@/components/ui/empty-state";

export default function HighlightPage() {
  const { highlightId } = useParams();
  const highlight = useHighlight(Number(highlightId));
  const book = useHighlightBook(highlight?.bookId);

  return (
    <Page back={{ to: "/all", label: "Highlights" }}>
      {highlight && (
        <HighlightCard
          key={highlight.id}
          id={highlight.id}
          starred={highlight.starred}
          text={highlight.quote}
          bookId={highlight.bookId}
          book={book}
        />
      )}
      {highlight === null && (
        <EmptyState title="Highlight not found">It may have been deleted.</EmptyState>
      )}
    </Page>
  );
}
