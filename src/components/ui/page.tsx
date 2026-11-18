import type { ReactNode } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { Link } from "react-router-dom";
import { metaTextClasses, pressedClasses } from "./styles";

const widthClasses = {
  /** Forms and prose: settings, import, export, help. */
  narrow: "lg:max-w-[600px]",
  /** Collections: highlights, books, lists. */
  wide: "lg:max-w-[892px]",
};

type PageProps = {
  title?: ReactNode;
  description?: ReactNode;
  /** Shown above the title on detail screens, which have no tab of their own. */
  back?: { to: string; label: string };
  width?: keyof typeof widthClasses;
  children?: ReactNode;
};

/** Every screen renders inside one Page so titles, spacing and widths match. */
export default function Page({
  title,
  description,
  back,
  width = "wide",
  children,
}: PageProps) {
  return (
    <div className={`w-full pb-8 ${widthClasses[width]}`}>
      {back && (
        <Link
          to={back.to}
          className={`-ml-2 mb-2 inline-flex min-h-11 items-center gap-1 pr-3 font-medium ${pressedClasses}`}
        >
          <BiChevronLeft size={24} aria-hidden="true" />
          {back.label}
        </Link>
      )}
      {title && (
        <header className="mb-6">
          <h1 className="text-2xl font-medium">{title}</h1>
          {description && <p className={`mt-1 ${metaTextClasses}`}>{description}</p>}
        </header>
      )}
      {children}
    </div>
  );
}
