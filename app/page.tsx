"use client";
import BookList from "@/components/BooksList/BooksList";
import { useState } from "react";
import { MagnifyingGlass, MutatingDots } from "react-loader-spinner";

import HeroImg from "../assets/Image Hero.svg";
import Sidebar from "@/components/SideBar/SideBar";
import { Input } from "@/components/UI/input";
import Header from "@/components/Header/Header";
import useSearchBooks from "@/hooks/useSearchBooks";
import usePopularBooks from "@/hooks/usePopularBooks";

export const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

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
    console.log("setSearch");
  };
  if (errorPopular) {
    return <p>Error fetching popular books: {errorPopular.message}</p>;
  }
  if (errorSearch) {
    return <p>Error fetching popular books: {errorSearch.message}</p>;
  }
  return (
    <div className="">
      <Header
        title="read and add your insight"
        subtitle="find your favorite book and read it here for free"
        Input={
          <Input
            type="search"
            value={search}
            onChange={handleChange}
            placeholder="Search Book"
            className="md:w-[350px] bg-zinc-100 w-[280px] "
          />
        }
      ></Header>
      <div className="md:flex bg-slate-100 ">
        <Sidebar category={category} setCategory={setCategory} />
        <div className="shadow-[0_5px_30px_0_rgba(0,0,0,0.2)]  md:mt-20 md:mb-20 mb-0 w-[100%] mr-20">
          {isLoadingSearch ? (
            <div className="flex justify-center items-center mt-10 h-[100%]">
              <MagnifyingGlass />
            </div>
          ) : (
            <>
              {showSearchResults && (
                <section>
                  <h2 className="text-3xl font-bold ml-10 mt-10">
                    Search Results
                  </h2>
                  <BookList books={searchResults} />
                </section>
              )}
            </>
          )}
          <>
            {isLoadingPopular ? (
              <div className="flex justify-center items-center mt-10 h-[100%]">
                <MutatingDots />
              </div>
            ) : (
              <>
                {showPopularBooks && (
                  <section>
                    <h2 className="md:text-3xl  xl font-bold  ml-10 mt-10">
                      Popular
                    </h2>
                    <BookList books={popularBooks} />
                  </section>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
};
export default Home;
