import type { Book } from "@/lib/db/types";
import type { MouseEvent } from "react";
import { BiDotsVerticalRounded, BiSolidStar, BiStar } from "react-icons/bi";
import {
  cardClasses,
  iconButtonClasses,
  menuClasses,
  menuItemClasses,
  metaTextClasses,
} from "@/components/ui/styles";

type DailyReviewCardProps = {
  book?: Book;
  text: string;
  starred: boolean;
  onStar: () => void | Promise<void>;
  onDelete: () => void;
  isDeleted: boolean;
  isFinishing: boolean;
  isStarUpdating: boolean;
};

export default function DailyReviewCard({
  book,
  text,
  starred,
  onStar,
  onDelete,
  isDeleted,
  isFinishing,
  isStarUpdating,
}: DailyReviewCardProps) {
  function handleDeleteClick(event: MouseEvent<HTMLButtonElement>) {
    onDelete();
    event.currentTarget.closest("details")?.removeAttribute("open");
  }

  return (
    <article className={`${cardClasses} p-4 lg:px-5`}>
      <div className="-mr-3 -mt-3 mb-1 flex items-start justify-between gap-3">
        <p className={`min-w-0 flex-1 break-words pt-3 ${metaTextClasses}`}>
          <cite className="not-italic">
            {book
              ? `${book.bookTitle} · ${book.bookAuthor}`
              : "Book details unavailable"}
          </cite>
        </p>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={() => void onStar()}
            disabled={isFinishing || isStarUpdating}
            aria-pressed={starred}
            aria-label={starred ? "Unstar highlight" : "Star highlight"}
            className={`${iconButtonClasses} disabled:pointer-events-none disabled:opacity-50`}
          >
            {starred ? (
              <BiSolidStar aria-hidden="true" size={22} />
            ) : (
              <BiStar aria-hidden="true" size={22} />
            )}
          </button>

          <details className="relative">
            <summary className={`${iconButtonClasses} cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden`}>
              <span className="sr-only">More highlight actions</span>
              <BiDotsVerticalRounded aria-hidden="true" size={24} />
            </summary>
            <div className={menuClasses}>
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isFinishing || isStarUpdating}
                aria-pressed={isDeleted}
                aria-label={
                  isDeleted
                    ? "Undo delete for highlight"
                    : "Mark highlight for deletion"
                }
                className={`${menuItemClasses} disabled:opacity-50`}
              >
                {isDeleted ? "Undo delete" : "Delete highlight"}
              </button>
            </div>
          </details>
        </div>
      </div>
      <blockquote className="max-w-prose text-pretty font-literata text-base leading-[1.7] sm:text-lg">
        {text}
      </blockquote>
    </article>
  );
}
