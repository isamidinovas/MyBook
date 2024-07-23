import { IBook } from "@/types/book-item";
import Image from "next/image";
import { Rubik } from "next/font/google";
import { Button } from "../UI/Button/button";
const rubik = Rubik({
  subsets: ["latin"],
  weight: "400",
});

type BookItemProp = {
  book: IBook;
  isShopPage?: boolean;
};

export const BookItem: React.FC<BookItemProp> = ({ book, isShopPage }) => {
  return (
    <>
      <div
        className="md:flex gap-7 items-center xl:w-[40%]"
        style={{
          backgroundColor: isShopPage ? "white" : "transparent",
          padding: isShopPage ? "30px" : "0",
          borderRadius: isShopPage ? "10px" : "0",
        }}
      >
        <Image src={book.img} alt="img" width={200} height={200} />
        <div className="flex flex-col justify-between gap-2 xl:h-[100%] ">
          <p className={`md:text-xl font-bold ${rubik.className}`}>
            {book.title}
          </p>
          <span>{book.author}</span>
          <span>1232.323 votes</span>
          <p>{book.text}</p>
          {isShopPage && (
            <Button
              variant="outline"
              size="lg"
              textColor="yellow"
              backgroundColor="amber"
              borderColor="yellow"
            >
              Buy Now
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default BookItem;
