import { useBooks } from "../hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/book-card";
import Page from "@/components/ui/page";
import EmptyState from "@/components/ui/empty-state";
import Button from "@/components/ui/button";

export default function BooksPage() {
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const books = useBooks();
  const navigate = useNavigate();

  function showBooks() {
    if (books) {
      return (
        <>
          {books.map((book) => (
            <BookCard
              activeOption={activeOption}
              setActiveOption={setActiveOption}
              key={book.id}
              bookId={book.id}
              bookTitle={book.bookTitle}
              bookAuthor={book.bookAuthor}
            />
          ))}
        </>
      );
    }
  }
  if (books && books.length <= 0) {
    return (
      <Page title="Books">
        <EmptyState
          title="No books yet"
          action={<Button text="Import highlights" onClick={() => navigate("/import")} />}
        >
          Books appear here once you import highlights from Boox or KOReader.
        </EmptyState>
      </Page>
    );
  }
  return (
    <Page title="Books">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{showBooks()}</div>
    </Page>
  );
}
