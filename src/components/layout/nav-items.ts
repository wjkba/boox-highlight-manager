import type { IconType } from "react-icons";
import {
  BiCalendarCheck,
  BiCog,
  BiDotsHorizontalRounded,
  BiExport,
  BiHelpCircle,
  BiSolidHome,
  BiImport,
  BiPlus,
  BiSolidBook,
  BiSolidQuoteRight,
  BiSolidStar,
} from "react-icons/bi";

export type NavItem = {
  to: string;
  label: string;
  icon: IconType;
  /** Shown under the label on the More screen. */
  description?: string;
  /** Extra path prefixes that count as this destination. */
  match?: string[];
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

/** Destinations people browse every day. Bottom tabs on mobile, top of the sidebar on desktop. */
export const PRIMARY_NAV: NavItem[] = [
  { to: "/home", label: "Home", icon: BiSolidHome },
  {
    to: "/all",
    label: "Highlights",
    icon: BiSolidQuoteRight,
    match: ["/highlight/"],
  },
  { to: "/books", label: "Books", icon: BiSolidBook },
  { to: "/lists", label: "Lists", icon: BiSolidStar, match: ["/starred"] },
];

/** Occasional actions. The More screen on mobile, grouped sidebar sections on desktop. */
export const SECONDARY_NAV: NavGroup[] = [
  {
    title: "Quick actions",
    items: [
      {
        to: "/review",
        label: "Daily review",
        icon: BiCalendarCheck,
        description: "Revisit today’s highlights",
      },
      {
        to: "/add",
        label: "Add highlight",
        icon: BiPlus,
        description: "Type in a passage by hand",
      },
    ],
  },
  {
    title: "Your data",
    items: [
      {
        to: "/import",
        label: "Import",
        icon: BiImport,
        description: "Boox, KOReader or a backup file",
      },
      {
        to: "/export",
        label: "Export",
        icon: BiExport,
        description: "Save a backup of everything",
      },
    ],
  },
  {
    title: "App",
    items: [
      {
        to: "/settings",
        label: "Settings",
        icon: BiCog,
        description: "Review delay, cards per review",
      },
      {
        to: "/help",
        label: "Help",
        icon: BiHelpCircle,
        description: "Exporting annotations from Boox",
      },
    ],
  },
];

export const MORE_NAV: NavItem = {
  to: "/more",
  label: "More",
  icon: BiDotsHorizontalRounded,
  match: SECONDARY_NAV.flatMap((group) => group.items.map((item) => item.to)),
};

/** "/books" matches "/books" and "/books/1"; a prefix ending in "/" matches anything under it. */
function matchesPrefix(pathname: string, prefix: string) {
  if (prefix.endsWith("/")) return pathname.startsWith(prefix);
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isNavItemActive(item: NavItem, pathname: string) {
  return [item.to, ...(item.match ?? [])].some((prefix) =>
    matchesPrefix(pathname, prefix),
  );
}
