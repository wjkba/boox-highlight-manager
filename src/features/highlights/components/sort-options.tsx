import { BiSortDown, BiSortUp } from "react-icons/bi";
import Button from "@/components/ui/button";
import { fieldClasses } from "@/components/ui/styles";

interface SortOptionsProps {
  sortOption: string;
  setSortOption: (option: string) => void;
  sortOrder: "desc" | "asc";
  setSortOrder: (option: "desc" | "asc") => void;
}

const SORT_FIELDS = [
  { value: "dateHighlighted", label: "Date highlighted" },
  { value: "dateAdded", label: "Date added" },
  { value: "alphabet", label: "Alphabetical" },
];

export default function SortOptions({
  sortOption,
  setSortOption,
  sortOrder,
  setSortOrder,
}: SortOptionsProps) {
  const isDescending = sortOrder === "desc";
  const SortIcon = isDescending ? BiSortDown : BiSortUp;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-field" className="shrink-0 text-sm font-medium">
        Sort by
      </label>
      <select
        id="sort-field"
        value={sortOption}
        onChange={(event) => setSortOption(event.target.value)}
        className={`${fieldClasses} flex-1 sm:max-w-[14rem]`}
      >
        {SORT_FIELDS.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      <Button
        onClick={() => setSortOrder(isDescending ? "asc" : "desc")}
        aria-label={`Sort order: ${isDescending ? "descending" : "ascending"}. Switch order`}
        className="shrink-0 gap-1"
      >
        <SortIcon size={20} aria-hidden="true" />
        {isDescending ? "Desc" : "Asc"}
      </Button>
    </div>
  );
}
