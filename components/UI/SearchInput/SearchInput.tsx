import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "../Input/input";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const newQueryString = createQueryString("search", value);
    router.push(`/?${newQueryString}`);
  };

  return (
    <Input
      type="search"
      value={searchValue}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search Book"
      className="md:w-[350px] bg-zinc-100 w-[280px]"
    />
  );
};
