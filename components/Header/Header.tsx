import Image from "next/image";
import { Input } from "../UI/input";

// нужно в инпут добавить bacground img Search
import SearchIcon from "../../assets/search.svg";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

type HeaderProp = {
  title: string;
  subtitle: string;
  img: string;
};

export const Header: React.FC<HeaderProp> = ({ title, subtitle, img }) => {
  return (
    <div className=" flex justify-end items-center ">
      <div className="w-[50%] flex-col flex gap-7">
        <h1 className="text-6xl uppercase font-bold w-[70%]">{title}</h1>
        <p className="text-lg font-medium ">{subtitle}</p>
        <Input
          type="search"
          placeholder="Search Book"
          className="w-[350px] bg-zinc-100"
        />
      </div>
      <Image src={img} alt="HeroImg" />
    </div>
  );
};
export default Header;
