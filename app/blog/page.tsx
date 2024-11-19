"use client";
import Header from "@/components/Header/Header";

import HeroImg from "../../assets/Image Hero.svg";
import BlogList from "@/components/BlogList/BlogList";
import { Input } from "@/components/UI/input";
import { useState } from "react";

export const page = () => {
  const [search, setSearch] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  return (
    <div>
      <Header
        title="blog mybook"
        subtitle="lightweight article where discussing matters relating to the book"
        img={HeroImg}
        Input={
          <Input
            type="search"
            value={search}
            onChange={handleChange}
            placeholder="Search Book"
            className="w-[350px] bg-zinc-100"
          />
        }
      />
      <BlogList />
    </div>
  );
};
export default page;
