import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

type SearchInputProps = {
  handleFilterChange: (value: { target: { name: string; value: any } }) => void;
  value: string | undefined;
};

export const SearchInput = ({
  handleFilterChange,
  value,
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (value) {
      setSearchValue(value);
    }
  }, [value]);

  return (
    <div className="relative flex flex-row">
      <Input
        type="text"
        name="search"
        placeholder="Search by External ID or URL"
        className="p-2 border"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value as string)}
      />
      <Button
        onClick={() => {
          handleFilterChange({
            target: {
              name: "search",
              value: searchValue,
            },
          });
        }}
      >
        <MagnifyingGlassIcon />
      </Button>
    </div>
  );
};
