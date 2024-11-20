// "use client";
import Image from "next/image";

// нужно в инпут добавить bacground img Search
import SearchIcon from "../../assets/search.svg";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeroImg from "../../assets/Image Hero.svg";
// import { useBooks } from "@/app/hooks/UseBooks";

type HeaderProp = {
  title: string;
  subtitle: string;
  Input: React.ReactElement;
  children?: React.ReactNode;
};

export const Header: React.FC<HeaderProp> = ({
  title,
  subtitle,
  Input,
  children,
}) => {
  return (
    <div className=" flex justify-start items-center md:h-[70vh] h-[40vh] p-20 ">
      <Image
        src={HeroImg}
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-[-1]"
      />
      <div className="md:w-[50%] flex-col flex gap-7">
        <h1 className="md:text-6xl xl  uppercase font-bold md:w-[70%] ">
          {title}
        </h1>
        <p className="md:text-lg w-[50%] font-medium  ">{subtitle}</p>
        {children}
        {Input}
      </div>
    </div>
  );
};
export default Header;
