import { categories, ICategory } from "@/constants/categories";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "../UI/Button/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../UI/select";

export const Sidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (categoryValue: string) => {
    const newQueryString = createQueryString(
      "category",
      categoryValue === currentCategory ? "" : categoryValue
    );
    router.push(`/?${newQueryString}`);
  };

  return (
    <>
      <div className="md:flex flex-col hidden w-[50%] p-20">
        <div className="flex justify-between items-center mb-7">
          <p className="font-bold text-xl">Book by Category</p>
          {currentCategory && (
            <Button
              variant="outline"
              size="sm"
              textColor="yellow"
              backgroundColor="amber"
              borderColor="black"
              onClick={() => handleCategoryClick(currentCategory)}
            >
              Сбросить
            </Button>
          )}
        </div>
        <ul className="mb-10 flex flex-col gap-4 cursor-pointer">
          {categories.map((category: ICategory) => (
            <li
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              className={`px-4 py-2 rounded transition-colors duration-200 ${
                category.value === currentCategory
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {category.label}
            </li>
          ))}
        </ul>
        <div className="h-7 border-t border-gray-400 opacity-30"></div>
      </div>
      <div className="md:hidden pt-10 relative top-5">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default Sidebar;
