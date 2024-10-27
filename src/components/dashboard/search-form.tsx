import React from "react";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";

const SearchForm = () => {
  return (
    <>
      <li className="hidden lg:block">
        <form>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search"
              className="w-full rounded-full border border-stroke bg-gray-2 py-3 pl-13.5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary xl:w-[300px]"
            />
            <Button variant={"outline"} size={"icon"}>
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </li>
    </>
  );
};

export default SearchForm;
