import { useAllHighlights } from "../hooks";
import HighlightsList from "../components/highlights-list";
import SearchBar from "../components/search-bar";
import SortOptions from "../components/sort-options";
import Button from "@/components/ui/button";
import Page from "@/components/ui/page";
import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { ScrollRestoration } from "react-router-dom";
import { type Highlight } from "@/lib/db/types";

export default function AllHighlightsPage({ UploadBooxComponent }: { UploadBooxComponent: ElementType }) {
  const [sortOption, setSortOption] = useState("dateHighlighted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const allHighlights = useAllHighlights(sortOption, sortOrder);

  const [displayedHighlights, setDisplayedHighlights] = useState<
    null | Highlight[]
  >(null);
  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    // SEARCH, LIMIT
    if (allHighlights) {
      let filteredHighlights = allHighlights;
      if (searchValue.trim() !== "") {
        filteredHighlights = allHighlights.filter((highlight) =>
          highlight.quote.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      const limitedHighlights = filteredHighlights.slice(0, limit);
      setDisplayedHighlights(limitedHighlights);
    }
  }, [allHighlights, searchValue, limit]);

  function handleLoadMore() {
    setLimit((prevLimit) => prevLimit + 20);
  }

  if (allHighlights && allHighlights.length <= 0) {
    return (
      <Page title="Highlights" width="narrow">
        <UploadBooxComponent />
      </Page>
    );
  }

  if (displayedHighlights) {
    return (
      <Page title="Highlights">
            <div className="mb-2">
              <SearchBar setSearchValue={setSearchValue} />
            </div>
            <div className="mb-4">
              <SortOptions
                sortOption={sortOption}
                setSortOption={setSortOption}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
            <HighlightsList highlights={displayedHighlights} />
            {limit <= displayedHighlights.length && (
              <Button text="Load more" onClick={handleLoadMore} className="mt-6 w-full" />
            )}
        <ScrollRestoration />
      </Page>
    );
  }
}
