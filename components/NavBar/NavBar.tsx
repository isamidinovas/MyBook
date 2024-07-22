import Link from "next/link";
import { Rubik } from "next/font/google";
import Image from "next/image";

import ShopIcon from "../../assets/shopping-cart 1.svg";
import { Button } from "../UI/Button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../UI/dropdown-menu";

const rubik = Rubik({
  subsets: ["latin"],
  weight: "400",
});

export const NavBar = () => {
  return (
    <div className=" flex justify-between items-center max-w-[1430px] w-fill p-10 mx-auto absolute right-20 ">
      <div className="flex gap-5">
        <Link
          href="/"
          className={`text-2xl font-bold cursor-pointer ${rubik.className}`}
        >
          MyBook
        </Link>
        <div className="h-7 border-l border-gray-400"></div>
        {/* Вертикальная линия */}
        <Image src={ShopIcon} alt="Logo" />
      </div>
      <ul className="gap-20 font-medium items-center lg:flex hidden ">
        <li>
          <Link href="/">Explorer</Link>
        </li>
        <li>
          <Link href="/shop">Shop</Link>
        </li>
        <li>
          <Link href="/blog">Blog</Link>
        </li>
        <li>
          <Link href="/login">
            <Button size="lg" borderRadius="xl" textColor="white">
              Log in
            </Button>
          </Link>
        </li>
      </ul>
      <div className="block lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="top">
                Explorer
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">Shop</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Blog</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
export default NavBar;
