import type { ReactNode } from "react";
import { cardClasses, sectionTitleClasses } from "./styles";

type EmptyStateProps = {
  title: string;
  children?: ReactNode;
  /** Usually a single Button that gets the person unstuck. */
  action?: ReactNode;
};

export default function EmptyState({ title, children, action }: EmptyStateProps) {
  return (
    <section className={`${cardClasses} p-6`}>
      <h2 className={`${sectionTitleClasses} mb-2`}>{title}</h2>
      {children && <p className="max-w-prose">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}
