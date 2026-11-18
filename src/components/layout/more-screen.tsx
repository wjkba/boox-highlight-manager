import { BiAdjust, BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import Switch from "@/components/ui/switch";
import Page from "@/components/ui/page";
import { SECONDARY_NAV } from "./nav-items";
import { useTheme } from "./use-theme";

const rowClasses =
  "flex min-h-16 w-full items-center gap-4 border-b border-neutral-300 px-2 py-2 text-left dark:border-neutral-600";
const pressableClasses =
  "can-hover:hover:bg-neutral-100 active:bg-neutral-900 active:text-white can-hover:dark:hover:bg-neutral-700 dark:active:bg-neutral-100 dark:active:text-neutral-900";
const groupHeadingClasses =
  "border-b-2 border-neutral-900 pb-1 text-sm font-semibold dark:border-neutral-100";

export default function MoreScreen() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Page title="More" width="narrow">
      {SECONDARY_NAV.map((group) => (
        <section key={group.title} aria-label={group.title} className="mb-8">
          <h2 className={groupHeadingClasses}>{group.title}</h2>
          <ul>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`${rowClasses} ${pressableClasses}`}>
                    <Icon size={24} aria-hidden="true" className="shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{item.label}</span>
                      {item.description && (
                        <span className="block text-sm text-neutral-600 dark:text-neutral-300">
                          {item.description}
                        </span>
                      )}
                    </span>
                    <BiChevronRight size={24} aria-hidden="true" className="shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <section aria-label="Appearance" className="mb-8">
        <h2 className={groupHeadingClasses}>Appearance</h2>
        <div className={rowClasses}>
          <BiAdjust size={24} aria-hidden="true" className="shrink-0" />
          <span className="min-w-0 flex-1">
            <span id="dark-mode-label" className="block font-medium">
              Dark mode
            </span>
            <span className="block text-sm text-neutral-600 dark:text-neutral-300">
              Light mode refreshes more cleanly on e-ink screens
            </span>
          </span>
          <Switch
            checked={isDark}
            onCheckedChange={toggleTheme}
            aria-labelledby="dark-mode-label"
            className="shrink-0"
          />
        </div>
      </section>
    </Page>
  );
}
