import { forwardRef } from "react";
import type { ElementType, SelectHTMLAttributes } from "react";
import { BiChevronDown } from "react-icons/bi";
import { fieldClasses } from "./styles";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** Optional leading icon, shown from the `sm` breakpoint up. */
  icon?: ElementType;
  /** Sizing for the outer box, e.g. a fixed width in a toolbar. */
  wrapperClassName?: string;
};

const iconClasses =
  "pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-300";

/**
 * Native select with our own chevron. The browser arrow hugs the border and
 * differs per platform; this one sits at the same 12px inset as the text.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    icon: Icon,
    wrapperClassName = "w-full",
    className = "",
    children,
    ...props
  },
  ref,
) {
  return (
    <div className={`relative min-w-0 ${wrapperClassName}`}>
      {Icon && (
        <Icon
          size={20}
          aria-hidden="true"
          className={`${iconClasses} left-3 hidden sm:block`}
        />
      )}
      <select
        ref={ref}
        className={`${fieldClasses} appearance-none truncate pr-10 ${Icon ? "sm:pl-10" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      <BiChevronDown
        size={20}
        aria-hidden="true"
        className={`${iconClasses} right-3`}
      />
    </div>
  );
});

export default Select;
