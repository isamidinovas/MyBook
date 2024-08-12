"use client";
import Header from "@/components/Header/Header";
import HeroImg from "../../assets/Image Hero.svg";
import BookList from "@/components/BooksList/BooksList";
import Sidebar from "@/components/SideBar/SideBar";
import { Input } from "@/components/UI/input";
import { useState } from "react";
import useSearchBooks from "@/hooks/useSearchBooks";
import usePopularBooks from "@/hooks/usePopularBooks";
import { MagnifyingGlass, MutatingDots } from "react-loader-spinner";
export const page = () => {
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
  };

  return (
    <div>
      <Header
        title="appreciate your author's work"
        subtitle=" Find Your Favorite Book And Read It Here For Free"
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
      <div className="md:flex bg-slate-100">
        <Sidebar category={category} setCategory={setCategory} />
        <div className=" md:mt-20 mb-20 w-[100%] mr-20">
          {isLoadingSearch ? (
            <div className="flex justify-center items-center  h-[100%]">
              <MagnifyingGlass />
            </div>
          ) : (
            <>
              {showSearchResults && (
                <section>
                  <h2 className="text-3xl font-bold ml-10 mt-10">
                    Search Results
                  </h2>
                  <BookList books={searchResults} isShopPage={true} />
                </section>
              )}
            </>
          )}
          <>
            {isLoadingPopular ? (
              <div className="flex justify-center items-center  h-[100%]">
                <MutatingDots />
              </div>
            ) : (
              <>
                {showPopularBooks && (
                  <section>
                    <h2 className="text-3xl font-bold ml-10 mt-10">Popular</h2>
                    <BookList books={popularBooks} isShopPage={true} />
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
export default page;
