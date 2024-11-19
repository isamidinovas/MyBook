import { IBook } from "@/types/book-item";
import Image from "next/image";
import { Rubik } from "next/font/google";
import { Button } from "../UI/Button/button";
import Link from "next/link";

const rubik = Rubik({
  subsets: ["latin"],
  weight: "400",
});

type BookItemProp = {
  book: IBook;
  isShopPage?: boolean;
};

export const BookItem: React.FC<BookItemProp> = ({ book, isShopPage }) => {
  const { authors, description, imageLinks, title } = book.volumeInfo;

  const maxLength = 80;
  const truncatedText =
    description?.length > maxLength
      ? description.slice(0, maxLength)
      : description;
  const truncatedTitle = title?.length > 20 ? title.slice(0, 25) : title;

  return (
    <div
      className={`group relative md:flex gap-7 items-start xl:w-[45%] min-h-[250px] p-4 transition-transform duration-300 ease-in-out  ${
        isShopPage
          ? "bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105"
          : "hover:scale-105"
      }`}
    >
      {/* Image Section */}
      <div className="w-[140px] h-[220px] flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-200">
        {imageLinks ? (
          <Link href={`/${book.id}`}>
            <Image
              src={imageLinks?.thumbnail}
              alt="Book cover"
              width={140}
              height={220}
              className="object-cover"
            />
          </Link>
        ) : (
          <div className="text-center text-sm text-gray-500">No Image</div>
        )}
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-between flex-grow gap-3 w-full">
        <p className={`md:text-2xl font-bold ${rubik.className}`}>
          {truncatedTitle + "..."}
        </p>
        <p className="text-sm text-gray-600">
          {Array.isArray(authors) ? authors.join(", ") : authors}
        </p>
        <span className="text-xs text-gray-500">
          {book.volumeInfo.categories}
        </span>
        <p className="opacity-50 break-words text-sm">
          {truncatedText + "..."}
        </p>
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
  );
};

export default BookItem;
