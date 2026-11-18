import { BiAdjust, BiChevronLeft } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useTheme } from "./use-theme";

type NavbarProps = {
  /** "focus" swaps the brand for a way back home, for full-screen flows like daily review. */
  variant?: "default" | "focus";
};

export default function Navbar({ variant = "default" }: NavbarProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="mb-4 flex h-14 w-full items-center justify-between border-b border-black/20 bg-white dark:border-white/20 dark:bg-neutral-800 dark:text-white lg:h-[70px]">
      {variant === "focus" ? (
        <Link
          to="/home"
          className="-ml-2 flex min-h-11 items-center gap-1 pr-3 text-base font-medium active:bg-neutral-900 active:text-white dark:active:bg-neutral-100 dark:active:text-neutral-900"
        >
          <BiChevronLeft size={28} aria-hidden="true" />
          Home
        </Link>
      ) : (
        <Link to="/home" className="flex min-h-11 shrink-0 items-center font-robotoSlab text-xl font-bold">
          Highlights
        </Link>
      )}
      {/* On mobile the theme switch lives on the More screen. */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDark}
        className="hidden min-h-11 items-center gap-2 px-2 can-hover:hover:bg-neutral-100 active:bg-neutral-900 active:text-white can-hover:dark:hover:bg-neutral-700 dark:active:bg-neutral-100 dark:active:text-neutral-900 lg:flex"
      >
        <BiAdjust size={20} aria-hidden="true" />
        Dark mode
      </button>
    </header>
  );
}
