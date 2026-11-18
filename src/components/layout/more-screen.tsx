import type { ReactNode } from "react";
import { BiAdjust, BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import Switch from "@/components/ui/switch";
import Page from "@/components/ui/page";
import {
  cardClasses,
  metaTextClasses,
  pressableCardClasses,
  sectionTitleClasses,
} from "@/components/ui/styles";
import { SECONDARY_NAV } from "./nav-items";
import { useTheme } from "./use-theme";

const rowClasses = "flex min-h-16 w-full items-center gap-4 p-4 text-left";

/** Rows share one bordered card, like the Books and Lists screens. */
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title}>
      <h2 className={`${sectionTitleClasses} mb-3`}>{title}</h2>
      <ul className={`${cardClasses} divide-y divide-stone-400 dark:divide-stone-500`}>
        {children}
      </ul>
    </section>
  );
}

function RowText({ label, description, labelId }: { label: string; description?: string; labelId?: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span id={labelId} className="block text-lg">
        {label}
      </span>
      {description && <span className={`block ${metaTextClasses}`}>{description}</span>}
    </span>
  );
}

export default function MoreScreen() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Page title="More" width="narrow">
      <div className="grid gap-8">
        {SECONDARY_NAV.map((group) => (
          <Group key={group.title} title={group.title}>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`${rowClasses} ${pressableCardClasses}`}>
                    <Icon size={24} aria-hidden="true" className="shrink-0" />
                    <RowText label={item.label} description={item.description} />
                    <BiChevronRight size={24} aria-hidden="true" className="shrink-0" />
                  </Link>
                </li>
              );
            })}
          </Group>
        ))}
        <Group title="Appearance">
          <li className={rowClasses}>
            <BiAdjust size={24} aria-hidden="true" className="shrink-0" />
            <RowText
              label="Dark mode"
              description="Light mode refreshes more cleanly on e-ink screens"
              labelId="dark-mode-label"
            />
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
              aria-labelledby="dark-mode-label"
              className="shrink-0"
            />
          </li>
        </Group>
      </div>
    </Page>
  );
}
