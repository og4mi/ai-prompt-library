"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { debounce } from "@/lib/utils";
import type { SortOption } from "@/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "dateAdded", label: "Date Added" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "lastUsed", label: "Last Used" },
  { value: "favorites", label: "Favorites First" },
  { value: "mostUsed", label: "Most Used" },
];

export function SearchBar() {
  const { filters, setFilters, settings, setSortBy } = useStore();
  const [searchValue, setSearchValue] = useState(filters.searchQuery);

  useEffect(() => {
    const debouncedSearch = debounce((query: string) => {
      setFilters({ searchQuery: query });
    }, 300);

    debouncedSearch(searchValue);
  }, [searchValue, setFilters]);

  const handleClearSearch = () => {
    setSearchValue("");
    setFilters({ searchQuery: "" });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search prompts..."
          className="pl-9 pr-9"
        />
        {searchValue && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="w-48">
        <Select
          value={settings.sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
