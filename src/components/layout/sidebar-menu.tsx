import { Link, useLocation } from "react-router-dom";
import { PRIMARY_NAV, SECONDARY_NAV, isNavItemActive, type NavItem } from "./nav-items";

function SidebarLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const current = isNavItemActive(item, pathname);
  const Icon = item.icon;
  return (
    <li>
      <Link
        to={item.to}
        aria-current={current ? "page" : undefined}
        className={`flex min-h-11 w-full items-center gap-3 p-2 ${
          current
            ? "bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900"
            : "text-neutral-800 can-hover:hover:bg-neutral-100 active:bg-neutral-800 active:text-white dark:text-neutral-100 can-hover:dark:hover:bg-neutral-700 dark:active:bg-neutral-100 dark:active:text-neutral-900"
        }`}
      >
        <Icon size={24} aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

/** Desktop navigation. Same structure as the mobile tabs + More screen. */
export default function SidebarMenu() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Main"
      className="hidden lg:block lg:w-full lg:max-w-[276px] lg:shrink-0"
    >
      <ul>
        {PRIMARY_NAV.map((item) => (
          <SidebarLink key={item.to} item={item} pathname={pathname} />
        ))}
      </ul>
      {SECONDARY_NAV.map((group) => (
        <section key={group.title} aria-label={group.title} className="mt-6">
          <h2 className="mb-1 border-b border-neutral-300 px-2 pb-1 text-sm font-semibold text-neutral-600 dark:border-neutral-600 dark:text-neutral-300">
            {group.title}
          </h2>
          <ul>
            {group.items.map((item) => (
              <SidebarLink key={item.to} item={item} pathname={pathname} />
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
