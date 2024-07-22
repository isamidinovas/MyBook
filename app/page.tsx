import BookList from "@/components/BooksList/BooksList";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/SideBar/SideBar";

export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="md:flex bg-slate-100">
        <Sidebar />
        <BookList />
      </div>
    </div>
  );
}
