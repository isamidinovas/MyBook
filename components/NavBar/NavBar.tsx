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
    <>
      <div className="   md:flex justify-between hidden items-center max-w-[1430px] w-fill p-10 mx-auto absolute right-20 ">
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
        <ul className="gap-20 font-medium items-center lg:flex hidden text-white">
          <li>
            <Link href="/">Каталог</Link>
          </li>
          <li>
            <Link href="/contacts">Контакты</Link>
          </li>
          <li>
            <Link href="/about">О нас</Link>
          </li>
          <li>
            <Link href="/cart">Корзина</Link>
          </li>
          <li>
            <Link href="/auth">
              <Button size="lg" borderRadius="xl" textColor="white">
                Log in
              </Button>
            </Link>
          </li>
        </ul>
      </div>
      <div className="block lg:hidden m-2 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="top">
                <Link href="/">Explorer</Link>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                <Link href="/shop">Контакты</Link>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">
                <Link href="/blog">Blog</Link>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
export default NavBar;
