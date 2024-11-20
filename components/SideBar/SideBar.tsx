import { categories, ICategory } from "@/constants/categories";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/select";

type SideBarProp = {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
};

export const Sidebar: React.FC<SideBarProp> = ({ category, setCategory }) => {
  return (
    <>
      <div className=" md:flex flex-col hidden w-[50%] p-20">
        <p className="font-bold text-xl mb-7">Book by Category</p>
        <ul className="mb-10 flex flex-col gap-4 cursor-pointer">
          {categories.map((cat: ICategory) => (
            <li
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded ${
                category === cat.value ? "bg-blue-500 text-white" : ""
              }`}
            >
              {cat.label}
            </li>
          ))}
        </ul>
        <div className="h-7 border-t border-gray-400 opacity-30"></div>
      </div>
      {/* <div className="md:hidden pt-10 relative top-5">
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
      </div> */}
    </>
  );
};

export default Sidebar;
