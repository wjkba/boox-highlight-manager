import { BiSearch } from "react-icons/bi";
import { fieldClasses } from "@/components/ui/styles";

interface SearchBarProps {
  setSearchValue: (value: string) => void;
}

export default function SearchBar({ setSearchValue }: SearchBarProps) {
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  return (
    <div className="relative">
      <BiSearch
        size={20}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-300"
      />
      <input
        type="search"
        aria-label="Search highlights"
        onChange={handleSearch}
        className={`${fieldClasses} pl-10`}
        placeholder="Search"
      />
    </div>
  );
}
