import { useRecentHighlights } from "../hooks";
import { BiSolidFlame } from "react-icons/bi";
import Button from "@/components/ui/button";
import Page from "@/components/ui/page";
import {
  cardClasses,
  metaTextClasses,
  pressableCardClasses,
  sectionDividerClasses,
  sectionTitleClasses,
} from "@/components/ui/styles";
import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { Link, ScrollRestoration, useNavigate } from "react-router-dom";

export default function Home({
  ImportDatabaseComponent,
  UploadBooxComponent,
  getCurrentStreak,
  isDailyReviewCompleted,
}: {
  ImportDatabaseComponent: ElementType;
  UploadBooxComponent: ElementType;
  getCurrentStreak: () => number;
  isDailyReviewCompleted: () => boolean;
}) {
  const navigate = useNavigate();
  const highlights = useRecentHighlights();
  const [isReviewCompleted, setIsReviewCompleted] = useState(true);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    setIsReviewCompleted(isDailyReviewCompleted());
    setStreakCount(getCurrentStreak());
  }, [getCurrentStreak, isDailyReviewCompleted]);

  // Avoid flashing the welcome screen while the database is still loading.
  if (highlights === undefined) return null;

  if (highlights && highlights.length > 0)
    return (
      <Page title="Home">
        <section aria-labelledby="home-review" className={`${cardClasses} mb-10 p-6`}>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <h2 id="home-review" className={sectionTitleClasses}>
              Daily review
            </h2>
            {streakCount > 0 && (
              <p className={`flex items-center gap-1 tabular-nums ${metaTextClasses}`}>
                <BiSolidFlame size={16} aria-hidden="true" />
                {streakCount} {streakCount === 1 ? "day" : "days"}
              </p>
            )}
          </div>
          {isReviewCompleted ? (
            <p>You’ve finished today’s review. Come back tomorrow.</p>
          ) : (
            <>
              <p className="mb-6">A few highlights are waiting for you today.</p>
              <Button
                text="Start daily review"
                onClick={() => navigate("/review")}
                className="w-full sm:w-auto"
              />
            </>
          )}
        </section>

        <section aria-labelledby="home-newest">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="home-newest" className={sectionTitleClasses}>
              Newest highlights
            </h2>
            <Link to="/all" className="min-h-11 content-center text-sm font-medium underline">
              See all
            </Link>
          </div>
          <ul className="grid gap-2 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <li key={highlight.id}>
                <Link
                  to={`/highlight/${highlight.id}`}
                  className={`${cardClasses} block h-full p-4 font-literata leading-relaxed ${pressableCardClasses}`}
                >
                  <span className="line-clamp-5">{highlight.quote}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ScrollRestoration />
      </Page>
    );

  return (
    <Page
      title="Welcome"
      description="Import your highlights to get started. Everything stays on this device."
      width="narrow"
    >
      <div className="grid gap-10">
        <UploadBooxComponent />
        <section className={sectionDividerClasses}>
          <ImportDatabaseComponent />
        </section>
      </div>
    </Page>
  );
}
