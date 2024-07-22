import { IBook } from "@/types/book-item";
import Image from "next/image";
import { Rubik } from "next/font/google";
const rubik = Rubik({
  subsets: ["latin"],
  weight: "400",
});

type BookItemProp = {
  book: IBook;
};

export const BookItem: React.FC<BookItemProp> = ({ book }) => {
  return (
    <div className=" md:flex gap-7 items-center xl:w-[40%] ">
      <Image src={book.img} alt="img" width={200} height={200} />
      <div className="flex flex-col justify-between gap-2 xl:h-[100%] ">
        <p className={`md:text-2xl font-bold ${rubik.className}`}>
          {book.title}
        </p>
        <span>{book.author}</span>
        <span>1232.323 votes</span>
        <p>{book.text}</p>
      </div>
    </div>
  );
};

export default BookItem;
