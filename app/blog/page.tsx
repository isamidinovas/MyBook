import Header from "@/components/Header/Header";

import HeroImg from "../../assets/Image Hero.svg";
import BlogList from "@/components/BlogList/BlogList";

export const page = () => {
  return (
    <div>
      <Header
        title="blog mybook"
        subtitle="lightweight article where discussing matters relating to the book"
        img={HeroImg}
      />
      <BlogList />
    </div>
  );
};
export default page;
