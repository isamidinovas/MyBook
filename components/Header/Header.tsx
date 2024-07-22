import Image from "next/image";
import { Input } from "../UI/input";
import HeroImg from "../../assets/Image Hero.svg";

// нужно в инпут добавить bacground img Search
import SearchIcon from "../../assets/search.svg";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

export const Header = () => {
  return (
    <div className=" flex justify-end items-center ">
      <div className="w-[50%] flex-col flex gap-7">
        <h1 className="text-6xl uppercase font-bold w-[70%]">
          read and add your insight
        </h1>
        <p className="text-lg font-medium ">
          Find Your Favorite Book And Read It Here For Free
        </p>
        <Input
          type="search"
          placeholder="Search Book"
          className="w-[350px] bg-zinc-100"
        />
      </div>
      <Image src={HeroImg} alt="HeroImg" />
    </div>
  );
};
export default Header;
