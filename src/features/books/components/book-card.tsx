import { updateBook, deleteBook, deleteBookHighlights } from "../api";
import { useState } from "react";
import { Link } from "react-router-dom";
import BookOptions from "./book-options";
import Button from "@/components/ui/button";
import {
  activeCardClasses,
  cardClasses,
  fieldClasses,
  labelClasses,
  metaTextClasses,
  pressableCardClasses,
} from "@/components/ui/styles";

interface BookCardProps {
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  activeOption: number | null;
  setActiveOption: (bookId: number | null) => void;
}

export default function BookCard({
  bookId,
  bookTitle,
  bookAuthor,
  activeOption,
  setActiveOption,
}: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState(bookTitle);
  const [newBookAuthor, setNewBookAuthor] = useState(bookAuthor);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewBookTitle(event.target.value);
  }
  function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewBookAuthor(event.target.value);
  }
  async function handleEditConfirm(event: React.FormEvent) {
    event.preventDefault();
    if (newBookTitle.length > 0 && newBookAuthor.length > 0) {
      const result = await updateBook(bookId, {
        bookTitle: newBookTitle,
        bookAuthor: newBookAuthor,
      });
      console.log(result);
    }
    setIsEditing(false);
    setActiveOption(null);
  }

  async function handleDeleteConfirm(event: React.FormEvent) {
    event.preventDefault();
    await deleteBookHighlights(bookId);
    await deleteBook(bookId);
    handleCancel();
  }

  function handleCancel() {
    setActiveOption(null);
    setIsEditing(false);
    setIsDeleting(false);
    setNewBookTitle(bookTitle);
    setNewBookAuthor(bookAuthor);
  }

  if (isEditing) {
    return (
      <div className={activeCardClasses}>
        <form onSubmit={handleEditConfirm} className="grid gap-4 p-4">
          <div>
            <label htmlFor={`bookTitle-${bookId}`} className={labelClasses}>
              Title
            </label>
            <input
              id={`bookTitle-${bookId}`}
              value={newBookTitle}
              onChange={handleTitleChange}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor={`bookAuthor-${bookId}`} className={labelClasses}>
              Author
            </label>
            <input
              id={`bookAuthor-${bookId}`}
              value={newBookAuthor}
              onChange={handleAuthorChange}
              className={fieldClasses}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={handleCancel} text="Cancel" />
            <Button type="submit" text="Save" />
          </div>
        </form>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className={`${activeCardClasses} p-4`}>
        <p className="mb-4">
          Delete “{bookTitle}” by {bookAuthor} and all of its highlights?
        </p>
        <form onSubmit={handleDeleteConfirm} className="grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={handleCancel} text="Cancel" />
          <Button type="submit" text="Delete" />
        </form>
      </div>
    );
  }

  return (
    <div className={`flex items-start ${cardClasses}`}>
      <Link
        className={`min-h-14 flex-1 p-4 ${pressableCardClasses}`}
        to={`/books/${bookId}`}
      >
        <p className="text-lg">{bookTitle}</p>
        <p className={metaTextClasses}>{bookAuthor}</p>
      </Link>
      <div className="p-1.5">
        <BookOptions
          setIsEditing={setIsEditing}
          setIsDeleting={setIsDeleting}
          bookId={bookId}
          activeOption={activeOption}
          setActiveOption={setActiveOption}
        />
      </div>
    </div>
  );
}
