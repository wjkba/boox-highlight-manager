import { BiAdjust } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { metaTextClasses } from "@/components/ui/styles";
import { PRIMARY_NAV, SECONDARY_NAV, isNavItemActive, type NavItem } from "./nav-items";
import { useTheme } from "./use-theme";

const rowClasses = "flex min-h-11 w-full items-center gap-3 p-2";
const restingRowClasses =
  "text-neutral-800 can-hover:hover:bg-neutral-100 active:bg-neutral-800 active:text-white dark:text-neutral-100 can-hover:dark:hover:bg-neutral-700 dark:active:bg-neutral-100 dark:active:text-neutral-900";

function SidebarLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const current = isNavItemActive(item, pathname);
  const Icon = item.icon;
  return (
    <li>
      <Link
        to={item.to}
        aria-current={current ? "page" : undefined}
        className={`${rowClasses} ${
          current
            ? "bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900"
            : restingRowClasses
        }`}
      >
        <Icon size={24} aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

function DarkModeRow() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <li>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        className={`${rowClasses} group text-left ${restingRowClasses}`}
      >
        <BiAdjust size={24} aria-hidden="true" />
        <span className="flex-1">Dark mode</span>
        <span aria-hidden="true" className={`${metaTextClasses} group-active:text-inherit`}>
          {isDark ? "On" : "Off"}
        </span>
      </button>
    </li>
  );
}

/**
 * Desktop navigation. Same structure as the mobile tabs + More screen, plus the
 * app name and theme switch that a phone shows elsewhere.
 */
export default function SidebarMenu() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Main"
      className="hidden lg:sticky lg:top-0 lg:block lg:max-h-dvh lg:w-full lg:max-w-[276px] lg:shrink-0 lg:self-start lg:overflow-y-auto lg:py-8"
    >
      <Link
        to="/home"
        className="mb-6 block px-2 font-robotoSlab text-xl font-bold leading-8"
      >
        Highlights
      </Link>
      <ul>
        {PRIMARY_NAV.map((item) => (
          <SidebarLink key={item.to} item={item} pathname={pathname} />
        ))}
      </ul>
      {SECONDARY_NAV.map((group, index) => (
        <section key={group.title} aria-label={group.title} className="mt-6">
          <h2 className="mb-1 border-b border-neutral-300 px-2 pb-1 text-sm font-semibold text-neutral-600 dark:border-neutral-600 dark:text-neutral-300">
            {group.title}
          </h2>
          <ul>
            {group.items.map((item) => (
              <SidebarLink key={item.to} item={item} pathname={pathname} />
            ))}
            {index === SECONDARY_NAV.length - 1 && <DarkModeRow />}
          </ul>
        </section>
      ))}
    </nav>
  );
}
