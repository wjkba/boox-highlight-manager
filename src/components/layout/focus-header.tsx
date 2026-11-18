import { BiChevronLeft } from "react-icons/bi";
import { Link } from "react-router-dom";
import { pressedClasses } from "@/components/ui/styles";

/**
 * Top bar for full-screen flows like daily review, which hide the tab bar and
 * sidebar. Its only job is a way back home.
 */
export default function FocusHeader() {
  return (
    <header className="mb-4 flex h-14 w-full items-center border-b border-black/20 dark:border-white/20 lg:h-[70px]">
      <Link
        to="/home"
        className={`-ml-2 flex min-h-11 items-center gap-1 pr-3 font-medium ${pressedClasses}`}
      >
        <BiChevronLeft size={28} aria-hidden="true" />
        Home
      </Link>
    </header>
  );
}
