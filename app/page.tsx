"use client";
import BookList from "@/components/BooksList/BooksList";
import { JSX, useState } from "react";

import HeroImg from "../assets/Image Hero.svg";
import { MagnifyingGlass, MutatingDots } from "react-loader-spinner";

import Sidebar from "@/components/SideBar/SideBar";
import { Input } from "@/components/UI/input";
import Header from "@/components/Header/Header";
import useSearchBooks from "@/hooks/useSearchBooks";
import usePopularBooks from "@/hooks/usePopularBooks";

export const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");

  const {
    data: searchResults = [],
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useSearchBooks(search, category);

  const {
    data: popularBooks = [],
    isLoading: isLoadingPopular,
    error: errorPopular,
  } = usePopularBooks(category);

  const showSearchResults = search && searchResults.length > 0;
  const showPopularBooks = !search && popularBooks.length > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="">
      <Header
        title="read and add your insight"
        subtitle="find your favorite book and read it here for free"
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
      ></Header>
      <div className="md:flex bg-slate-100 ">
        <Sidebar category={category} setCategory={setCategory} />
        <div className="shadow-[0_5px_30px_0_rgba(0,0,0,0.2)]  md:mt-20 mb-20 w-[100%] mr-20">
          {showSearchResults ? (
            <section>
              <h2 className="text-3xl font-bold ml-10 mt-10">Search Results</h2>
              {isLoadingSearch ? (
                <div className="flex justify-center items-center mt-10">
                  <MagnifyingGlass
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="magnifying-glass-loading"
                    wrapperStyle={{}}
                    wrapperClass="magnifying-glass-wrapper"
                    glassColor="#c0efff"
                    color="#e15b64"
                  />
                </div>
              ) : (
                <BookList books={searchResults} />
              )}
            </section>
          ) : (
            <>
              {isLoadingPopular ? (
                <div className="flex justify-center items-center mt-10 h-[100%]">
                  <MutatingDots
                    visible={true}
                    height="100"
                    width="100"
                    color="#4fa94d"
                    secondaryColor="#4fa94d"
                    radius="12.5"
                    ariaLabel="mutating-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : (
                <>
                  {showPopularBooks && (
                    <section>
                      <h2 className="text-3xl font-bold ml-10 mt-10">
                        Popular
                      </h2>
                      <BookList books={popularBooks} />
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
