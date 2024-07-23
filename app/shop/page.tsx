import Header from "@/components/Header/Header";
import HeroImg from "../../assets/Image Hero.svg";
import BookList from "@/components/BooksList/BooksList";
import Sidebar from "@/components/SideBar/SideBar";
export const page = () => {
  return (
    <div>
      <Header
        title="appreciate your author's work"
        subtitle=" Find Your Favorite Book And Read It Here For Free"
        img={HeroImg}
      />
      <div className="md:flex bg-slate-100">
        <Sidebar />
        <div className="">
          <BookList isShopPage={true} />
        </div>
      </div>
    </div>
  );
};
export default page;
