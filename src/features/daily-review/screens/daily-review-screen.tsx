import FocusHeader from "@/components/layout/focus-header";
import { completeDailyReview, setHighlightStarred } from "../api";
import { useReviewBook } from "../hooks";
import {
  getDailyReviewQuotes,
  isDailyReviewCompleted,
  updateStreak,
} from "../api";
import { useCallback, useEffect, useRef, useState } from "react";
import { Highlight } from "@/lib/db/types";
import Button from "@/components/ui/button";
import Page from "@/components/ui/page";
import EmptyState from "@/components/ui/empty-state";
import { cardClasses, errorTextClasses, metaTextClasses } from "@/components/ui/styles";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { ElementType } from "react";
import { BiSolidFlame } from "react-icons/bi";

/** Full-screen review: no tab bar, just a way back home. */
function ReviewShell({
  children,
  busy = false,
  padForButtons = false,
}: {
  children: ReactNode;
  busy?: boolean;
  padForButtons?: boolean;
}) {
  return (
    <div
      aria-busy={busy || undefined}
      className={`grid place-items-center dark:bg-neutral-800 dark:text-white ${
        padForButtons ? "pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-0" : ""
      }`}
    >
      <div className="w-full max-w-[600px] px-4 lg:max-w-[1200px]">
        <FocusHeader />
        <main className="min-h-dvh lg:pt-8">{children}</main>
      </div>
    </div>
  );
}

export default function DailyReviewPage({
  DailyReviewButtonsComponent,
  HighlightCardComponent,
}: {
  DailyReviewButtonsComponent: ElementType;
  HighlightCardComponent: ElementType;
}) {
  const [dailyHighlights, setDailyHighlights] = useState<Highlight[] | null>(
    null,
  );
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewIsCompleted, setReviewIsCompleted] = useState<boolean>(false);
  const [toDeleteIds, setToDeleteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isStarUpdating, setIsStarUpdating] = useState(false);
  const starMutationInFlight = useRef(false);
  const [streakCount, setStreakCount] = useState(0);
  const navigate = useNavigate();
  const activeBook = useReviewBook(activeHighlight?.bookId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchDaily = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setActionError(null);

    try {
      const daily = await getDailyReviewQuotes();
      setReviewIsCompleted(isDailyReviewCompleted());
      setDailyHighlights(daily);
      setActiveHighlight(daily[0] ?? null);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Failed to fetch daily highlights:", error);
      setLoadError(
        "We couldn’t load today’s review. Try again or import more highlights.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDaily();
  }, [fetchDaily]);

  async function handleNext() {
    if (dailyHighlights && !isFinishing && !isStarUpdating) {
      const nextIndex = currentIndex + 1;
      if (nextIndex > dailyHighlights.length - 1) {
        setIsFinishing(true);
        setActionError(null);
        try {
          await updateReviewedQuotes();
          const now = new Date();
          updateStreak();
          localStorage.setItem("lastDailyReview", now.toISOString());
          localStorage.setItem("isReviewCompleted", "true");
          setStreakCount(Number(localStorage.getItem("streakCount") ?? 0));
          setReviewIsCompleted(true);
        } catch (error) {
          console.error("Failed to finish daily review:", error);
          setActionError(
            "Your review could not be saved. Try finishing again.",
          );
        } finally {
          setIsFinishing(false);
        }
      } else {
        setActiveHighlight(dailyHighlights[nextIndex]);
        setCurrentIndex(nextIndex);
      }
    }
  }

  function handleBack() {
    if (dailyHighlights && !isFinishing && !isStarUpdating) {
      const nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        return;
      } else {
        setActiveHighlight(dailyHighlights[nextIndex]);
        setCurrentIndex(nextIndex);
      }
    }
  }
  async function handleAddToStarred() {
    if (activeHighlight && !isStarUpdating && !starMutationInFlight.current) {
      const starred = !activeHighlight.starred;
      starMutationInFlight.current = true;
      setIsStarUpdating(true);
      setActionError(null);
      try {
        await setHighlightStarred(activeHighlight.id, starred);
        const updatedDailyHighlights = dailyHighlights?.map((highlight) =>
          highlight.id === activeHighlight.id
            ? { ...highlight, starred }
            : highlight,
        );
        if (updatedDailyHighlights) setDailyHighlights(updatedDailyHighlights);
        setActiveHighlight({ ...activeHighlight, starred });
        setActionStatus(
          starred ? "Highlight starred." : "Highlight unstarred.",
        );
      } catch (error) {
        console.error("Failed to update starred highlight:", error);
        setActionError("The star could not be saved. Try again.");
      } finally {
        starMutationInFlight.current = false;
        setIsStarUpdating(false);
      }
    }
  }
  function handleMarkForDelete() {
    if (activeHighlight && !isStarUpdating && !isFinishing) {
      const activeHighlightId = activeHighlight.id;
      if (!toDeleteIds.includes(activeHighlightId)) {
        setToDeleteIds((s) => [...s, activeHighlightId]);
        setActionStatus(
          "Highlight marked for deletion. Select undo to keep it.",
        );
        return;
      }
      setToDeleteIds((s) => s.filter((id) => id !== activeHighlightId));
      setActionStatus("Highlight kept.");
    }
  }

  async function updateReviewedQuotes() {
    const newReviewedDate = new Date().toISOString();
    if (!dailyHighlights) throw new Error("No daily highlights loaded");
    await completeDailyReview(
      dailyHighlights.map(({ id }) => id),
      newReviewedDate,
      toDeleteIds,
    );
  }

  if (isLoading) {
    return (
      <ReviewShell busy>
        <Page title="Daily review" width="narrow">
          <div className={`${cardClasses} p-6`}>
            <output aria-live="polite" className="font-literata text-lg">
              Loading today’s highlights…
            </output>
            <div className="mt-6 grid gap-3" aria-hidden="true">
              <div className="h-3 w-1/3 bg-stone-200 dark:bg-neutral-700" />
              <div className="h-3 w-full bg-stone-200 dark:bg-neutral-700" />
              <div className="h-3 w-4/5 bg-stone-200 dark:bg-neutral-700" />
            </div>
          </div>
        </Page>
      </ReviewShell>
    );
  }

  if (loadError) {
    return (
      <ReviewShell>
        <Page title="Daily review" width="narrow">
          <EmptyState
            title="Review unavailable"
            action={
              <div className="grid gap-2 sm:flex">
                <Button text="Try again" onClick={fetchDaily} />
                <Button variant="ghost" text="Import highlights" onClick={() => navigate("/import")} />
              </div>
            }
          >
            {loadError}
          </EmptyState>
        </Page>
      </ReviewShell>
    );
  }

  if (
    !reviewIsCompleted &&
    (!dailyHighlights || dailyHighlights.length === 0)
  ) {
    return (
      <ReviewShell>
        <Page title="Daily review" width="narrow">
          <EmptyState
            title="Nothing is due today"
            action={
              <Button
                text="Import highlights"
                onClick={() => navigate("/import")}
                className="w-full sm:w-auto"
              />
            }
          >
            Import more highlights or return tomorrow for another quiet reading
            session.
          </EmptyState>
        </Page>
      </ReviewShell>
    );
  }

  if (reviewIsCompleted) {
    const streak =
      streakCount || Number(localStorage.getItem("streakCount") ?? 0);
    return (
      <ReviewShell>
        <Page title="Daily review" width="narrow">
          <EmptyState
            title="Done for today"
            action={
              <Button
                text="Back to home"
                onClick={() => navigate("/home")}
                className="w-full sm:w-auto"
              />
            }
          >
            <output aria-live="polite" className="grid gap-1">
              <span>You’ve completed your review for today.</span>
              <span className={`flex items-center gap-1 ${metaTextClasses}`}>
                <BiSolidFlame size={16} aria-hidden="true" />
                Streak: {streak} {streak === 1 ? "day" : "days"}
              </span>
              {toDeleteIds.length > 0 && (
                <span className={metaTextClasses}>
                  Deleted {toDeleteIds.length} highlights
                </span>
              )}
            </output>
          </EmptyState>
        </Page>
      </ReviewShell>
    );
  }

  if (activeHighlight && dailyHighlights) {
    return (
      <ReviewShell padForButtons>
        <Page
          title="Daily review"
          description={
            <output aria-live="polite" className="tabular-nums">
              Highlight {currentIndex + 1} of {dailyHighlights.length}
            </output>
          }
          width="narrow"
        >
          {actionError && (
            <p className={`mb-4 ${errorTextClasses}`} role="alert">
              {actionError}
            </p>
          )}
          {actionStatus && (
            <output className="sr-only" aria-live="polite">
              {actionStatus}
            </output>
          )}
          <HighlightCardComponent
            key={`${activeHighlight.id}-${currentIndex}`}
            bookId={activeHighlight.bookId}
            id={activeHighlight.id}
            starred={activeHighlight.starred}
            text={activeHighlight.quote}
            book={activeBook}
            onStar={handleAddToStarred}
            onDelete={handleMarkForDelete}
            isDeleted={toDeleteIds.includes(activeHighlight.id)}
            isFinishing={isFinishing}
            isStarUpdating={isStarUpdating}
            options={["hideDelete", "hideStar"]}
          />
          <DailyReviewButtonsComponent
            currentIndex={currentIndex}
            onBack={handleBack}
            onNext={handleNext}
            numberOfCards={dailyHighlights.length}
            isFinishing={isFinishing}
            isStarUpdating={isStarUpdating}
          />
        </Page>
      </ReviewShell>
    );
  }
}
