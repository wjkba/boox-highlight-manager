/**
 * Shared class strings so every screen draws fields, cards, menus and status text
 * the same way. Follows EINK_UI_STYLE_GUIDE.md: flat borders, square corners,
 * inversion for pressed states, one grey for meta text.
 */

/** Pressed state: full inversion, readable in grayscale and fast-refresh modes. */
export const pressedClasses =
  "active:bg-neutral-900 active:text-white dark:active:bg-neutral-100 dark:active:text-neutral-900";

/** A whole card that is a link (book, list, quote preview). */
export const pressableCardClasses = `can-hover:hover:bg-stone-100 can-hover:dark:hover:bg-neutral-900 ${pressedClasses}`;

/** Thin rule above a secondary section of a page, e.g. "Restore a backup". */
export const sectionDividerClasses =
  "border-t border-stone-400 pt-8 dark:border-stone-500";

/** Text inputs, selects and textareas. */
export const fieldClasses =
  "min-h-11 w-full min-w-0 border border-neutral-900 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-500 dark:border-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400";

export const labelClasses = "mb-1 block text-sm font-medium";

/** Heading of a section inside a page (an h2, or a fieldset legend). */
export const sectionTitleClasses = "text-lg font-medium";

/** Secondary text: authors, descriptions, helper copy. */
export const metaTextClasses = "text-sm text-neutral-600 dark:text-neutral-300";

/** Resting card border. Editing/confirming cards use `activeCardClasses`. */
export const cardClasses = "border border-stone-400 dark:border-stone-500";
export const activeCardClasses = "border border-neutral-900 dark:border-neutral-100";

export const errorTextClasses = "text-sm text-red-700 dark:text-red-400";
export const successTextClasses = "text-sm text-green-700 dark:text-green-400";

/** Pop-over menu opened from a card's options button. */
export const menuClasses =
  "absolute right-0 top-full z-10 w-max min-w-[11rem] max-w-[calc(100vw-2rem)] divide-y divide-neutral-300 border border-neutral-900 bg-white p-1 text-neutral-900 dark:divide-neutral-600 dark:border-neutral-100 dark:bg-neutral-900 dark:text-neutral-100";
export const menuItemClasses = `flex min-h-11 w-full items-center gap-2 px-2 text-left text-sm can-hover:hover:bg-neutral-100 can-hover:dark:hover:bg-neutral-700 ${pressedClasses}`;

/** Square icon-only button (card options, star). */
export const iconButtonClasses = `grid size-11 shrink-0 place-items-center text-neutral-700 dark:text-neutral-300 ${pressedClasses}`;
