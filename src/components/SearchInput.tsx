import * as React from "react";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

export interface ISearchProps {
  onChangeSearchQuery: (searchQuery: string) => void;
}

export default function SearchInput(props: ISearchProps) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const { onChangeSearchQuery } = props;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      onChangeSearchQuery(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onChangeSearchQuery]);

  return (
    <>
      <label htmlFor="search" className="mt-3">Enter neighborhood, building name, street address, or zip code:</label>
      <input
        id="search"
        className="form-control w-50"
        type="search"
        placeholder="Search"
        aria-label="Search"
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </>
  );
}
