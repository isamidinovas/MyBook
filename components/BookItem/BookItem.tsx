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
  const { authors, description, imageLinks } = book.volumeInfo;

  const maxLength = 100;
  const truncatedText =
    description?.length > maxLength
      ? description.slice(0, maxLength)
      : description;

  return (
    <>
      <div
        className="md:flex gap-7 items-start xl:w-[45%] h-auto "
        style={{
          backgroundColor: isShopPage ? "white" : "transparent",
          padding: isShopPage ? "30px" : "0",
          borderRadius: isShopPage ? "10px" : "0",
        }}
      >
        <div flex-shrink-0>
          {imageLinks ? (
            <Image
              src={imageLinks?.smallThumbnail}
              alt="img"
              width={300}
              height={400}
            />
          ) : (
            <div className="w-[200px] h-[300px] bg-gray-200 flex items-center justify-center"></div>
          )}
        </div>
        <div className="flex flex-col justify-between w-full gap-5">
          <p className={`md:text-2xl font-bold ${rubik.className}`}>
            {book.volumeInfo.title}
          </p>
          {Array.isArray(authors) ? authors.join(" , ") : <p>{authors}</p>}
          <span>
            {book.volumeInfo.categories ? book.volumeInfo.categories : "s"}
          </span>
          <p className="opacity-50 ">{truncatedText}</p>
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
