import { Link, useLocation } from "react-router-dom";
import { MORE_NAV, PRIMARY_NAV, isNavItemActive } from "./nav-items";

const TABS = [...PRIMARY_NAV, MORE_NAV];

/**
 * Mobile and e-reader navigation. Pinned to the bottom so every tab sits in thumb
 * reach, with labels always visible and the current tab shown by inversion
 * (survives grayscale panels and Boox fast-refresh modes).
 */
export default function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-neutral-900 bg-white pb-[env(safe-area-inset-bottom)] dark:border-neutral-100 dark:bg-neutral-800 lg:hidden"
    >
      <ul className="mx-auto grid max-w-[600px] grid-cols-5 gap-1 px-2 py-1">
        {TABS.map((tab) => {
          const current = isNavItemActive(tab, pathname);
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[0.8125rem] font-semibold leading-tight ${
                  current
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "text-neutral-900 active:bg-neutral-900 active:text-white dark:text-neutral-100 dark:active:bg-neutral-100 dark:active:text-neutral-900"
                }`}
              >
                <Icon size={24} aria-hidden="true" />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
