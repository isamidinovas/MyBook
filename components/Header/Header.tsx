// "use client";
import Image from "next/image";

// нужно в инпут добавить bacground img Search
import SearchIcon from "../../assets/search.svg";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { useBooks } from "@/app/hooks/UseBooks";

type HeaderProp = {
  title: string;
  subtitle: string;
  img: string;
  Input: React.ReactElement;
  children?: React.ReactNode;
};

export const Header: React.FC<HeaderProp> = ({
  title,
  subtitle,
  img,
  Input,
  children,
}) => {
  return (
    <div className=" flex justify-end items-center ">
      <div className="w-[50%] flex-col flex gap-7">
        <h1 className="text-6xl uppercase font-bold w-[70%]">{title}</h1>
        <p className="text-lg font-medium ">{subtitle}</p>
        {children}
        {Input}
      </div>
      <Image src={img} alt="HeroImg" />
    </div>
  );
};
export default Header;
