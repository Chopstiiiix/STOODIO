"use client";

import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div
      className="
        border-[1px]
        w-full
        md:w-auto
        py-2
        rounded-full
        shadow-sm
        hover:shadow-md
        transition
        cursor-pointer
      "
    >
      <div
        className="
          flex
          flex-row
          items-center
          justify-between
        "
      >
        <div
          className="
            text-sm
            font-semibold
            px-6
          "
        >
          Search studios and locations
        </div>
        <div
          className="
            text-sm
            pl-6
            pr-2
            text-gray-600
            flex
            flex-row
            items-center
            gap-3
          "
        >
          <div
            className="
              p-2
              bg-primary
              rounded-full
              text-white
            "
          >
            <SearchIcon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
