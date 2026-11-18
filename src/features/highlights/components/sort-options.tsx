import { BiSortAlt2 } from "react-icons/bi";
import Select from "@/components/ui/select";

type SortOrder = "desc" | "asc";

interface SortOptionsProps {
  sortOption: string;
  setSortOption: (option: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (option: SortOrder) => void;
}

/** Field and direction in one choice, so the toolbar needs a single control. */
const SORT_CHOICES: { field: string; order: SortOrder; label: string }[] = [
  { field: "dateHighlighted", order: "desc", label: "Newest first" },
  { field: "dateHighlighted", order: "asc", label: "Oldest first" },
  { field: "dateAdded", order: "desc", label: "Recently added" },
  { field: "dateAdded", order: "asc", label: "First added" },
  { field: "alphabet", order: "asc", label: "A to Z" },
  { field: "alphabet", order: "desc", label: "Z to A" },
];

/** The select's value encodes both parts, e.g. "dateAdded:desc". */
const toValue = (field: string, order: SortOrder) => `${field}:${order}`;

export default function SortOptions({
  sortOption,
  setSortOption,
  sortOrder,
  setSortOrder,
}: SortOptionsProps) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const [field, order] = event.target.value.split(":");
    setSortOption(field);
    setSortOrder(order as SortOrder);
  }

  return (
    <div className="shrink-0">
      <label htmlFor="sort-field" className="sr-only">
        Sort by
      </label>
      <Select
        id="sort-field"
        icon={BiSortAlt2}
        wrapperClassName="w-44 sm:w-52"
        value={toValue(sortOption, sortOrder)}
        onChange={handleChange}
      >
        {SORT_CHOICES.map((choice) => (
          <option
            key={toValue(choice.field, choice.order)}
            value={toValue(choice.field, choice.order)}
          >
            {choice.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
