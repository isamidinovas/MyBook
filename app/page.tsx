import BookList from "@/components/BooksList/BooksList";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/SideBar/SideBar";
import HeroImg from "../assets/Image Hero.svg";

export default function Home() {
  return (
    <div className="">
      <Header
        title="read and add your insight"
        subtitle="find your favorite book and read it here for free"
        img={HeroImg}
      />
      <div className="md:flex bg-slate-100">
        <Sidebar />
        <div className="shadow-[0_5px_30px_0_rgba(0,0,0,0.2)]  md:mt-20 mb-20">
          <BookList />
        </div>
      </div>
    </div>
  );
}
