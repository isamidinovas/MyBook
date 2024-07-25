import { IBlog } from "@/types/blog-item";
import Image from "next/image";

type BlogItemProp = {
  blog: IBlog;
};

export const BlogItem: React.FC<BlogItemProp> = ({ blog }) => {
  return (
    <div className="flex flex-col  items-center w-[100%] md:w-[30%]">
      <Image src={blog.img} alt="blog" width={300} height={300} />
      <h3 className="text-sm md:text-lg font-bold pt-7 w-[200px] text-center">
        {blog.title}
      </h3>
      <p className="w-[200px] pt-5 text-xs md:text-sm">{blog.text}</p>
    </div>
  );
};
export default BlogItem;
