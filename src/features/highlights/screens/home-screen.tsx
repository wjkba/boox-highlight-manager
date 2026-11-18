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
        <div className="grid gap-8">
          <section
            aria-labelledby="home-review"
            className={`${cardClasses} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between lg:px-5`}
          >
            <div>
              <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
                <h2 id="home-review" className={sectionTitleClasses}>
                  Daily review
                </h2>
                {streakCount > 0 && (
                  <p
                    className={`flex items-center gap-1 tabular-nums ${metaTextClasses}`}
                  >
                    <BiSolidFlame size={16} aria-hidden="true" />
                    {streakCount} {streakCount === 1 ? "day" : "days"} streak
                  </p>
                )}
              </div>
              <p>
                {isReviewCompleted
                  ? "You’ve finished today’s review. Come back tomorrow."
                  : "A few highlights are waiting for you today."}
              </p>
            </div>
            {!isReviewCompleted && (
              <Button
                text="Start daily review"
                onClick={() => navigate("/review")}
                className="w-full shrink-0 sm:w-auto"
              />
            )}
          </section>

          <section aria-labelledby="home-newest">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 id="home-newest" className={sectionTitleClasses}>
                Newest highlights
              </h2>
              <Link
                to="/all"
                className="min-h-11 content-center text-sm font-medium underline"
              >
                See all
              </Link>
            </div>
            <ul className="grid gap-2 sm:grid-cols-3">
              {highlights.map((highlight) => (
                <li key={highlight.id}>
                  <Link
                    to={`/highlight/${highlight.id}`}
                    className={`${cardClasses} block h-full p-4 font-literata leading-relaxed lg:px-5 ${pressableCardClasses}`}
                  >
                    <span className="line-clamp-5">{highlight.quote}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

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
