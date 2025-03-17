"use client";
import { BookList } from "@/components/BookList/BookList";
import { MutatingDots } from "react-loader-spinner";
import HeroImg from "../assets/Image Hero.svg";
import Sidebar from "@/components/SideBar/SideBar";
import Header from "@/components/Header/Header";

export const Home = () => {
  return (
    <div className="">
      <Header
        title="read and add your insight"
        subtitle="find your favorite book and read it here for free"
      />
      <div className="md:flex bg-slate-100">
        <Sidebar />
        <div className="shadow-[0_5px_30px_0_rgba(0,0,0,0.2)] md:mt-20 md:mb-20 mb-0 w-[100%] mr-20">
          <h2 className="md:text-3xl xl font-bold ml-10 mt-10">Каталог</h2>
          <BookList />
        </div>
      </div>
    </div>
  );
};

export default Home;
