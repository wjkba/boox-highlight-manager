import { useEffect, useState } from "react";
import { getHighlight, updateHighlight } from "../api";
import HighlightCardOptions, {
  type CardOptions,
} from "./highlight-card-options";
import { useHighlightCardEditStore } from "../highlight-card-store";
import { type Book } from "@/lib/db/types";
import Button from "@/components/ui/button";
import {
  activeCardClasses,
  cardClasses,
  fieldClasses,
  metaTextClasses,
} from "@/components/ui/styles";

interface HighlightCardProps {
  id: number;
  text: string;
  bookId: number;
  book?: Book;
  starred: boolean;
  options?: CardOptions[];
}
export default function HighlightCard({
  id,
  text,
  bookId,
  book,
  starred,
  options,
}: HighlightCardProps) {
  const { editingHighlightId, setEditingHighlightId } =
    useHighlightCardEditStore();
  const [editValue, setEditValue] = useState<string>(text);

  const isEditing = editingHighlightId === id;

  useEffect(() => {
    if (isEditing) {
      setEditValue(text);
    }
  }, [text, isEditing]);

  function handleEditCancel() {
    setEditingHighlightId(null);
  }

  async function handleEditConfirm() {
    const highlight = await getHighlight(id);
    if (!highlight) return;
    const result = await updateHighlight(highlight.id, { quote: editValue });
    console.log(result);
    setEditingHighlightId(null);
  }

  function handleEditChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setEditValue(event.target.value);
  }

  return (
    <article className={`${isEditing ? activeCardClasses : cardClasses} p-4 lg:px-5`}>
      <div className="w-full">
        <div className="-mr-3 -mt-3 mb-1 flex items-start justify-between gap-3">
          <p className={`min-w-0 flex-1 break-words pt-3 ${metaTextClasses}`}>
            <cite className="not-italic">
              {book ? `${book.bookTitle} · ${book.bookAuthor}` : "Book details unavailable"}
            </cite>
          </p>
          <div className="flex items-center">
            <HighlightCardOptions
              highlightId={id}
              bookId={bookId}
              options={options}
              starred={starred}
            />
          </div>
        </div>
        {isEditing ? (
          <textarea
            aria-label="Highlight text"
            className={`${fieldClasses} mb-4 min-h-[12rem] resize-none font-literata`}
            value={editValue}
            onChange={handleEditChange}
          />
        ) : (
          <blockquote className="max-w-prose text-pretty font-literata leading-[clamp(1.4em,_1.5em+0.5vw,_1.65em)]">
            {text}
          </blockquote>
        )}
        {isEditing && (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <Button variant="ghost" onClick={handleEditCancel} text="Cancel" />
            <Button onClick={handleEditConfirm} text="Save" />
          </div>
        )}
      </div>
    </article>
  );
}
