import { IBook } from "@/types/book";
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
  // Проверяем наличие необходимых данных
  if (!book || !book.title) {
    console.error("BookItem received invalid book data:", book);
    return null;
  }

  const truncatedTitle =
    book.title.length > 25 ? book.title.slice(0, 25) + "..." : book.title;

  return (
    <div
      className={`group relative flex md:flex-row flex-col gap-7 items-center md:w-[100%] w-[100%] min-h-[250px] p-4 transition-transform duration-300 ease-in-out ${
        isShopPage
          ? "bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105"
          : "hover:scale-105"
      }`}
    >
      {/* Image Section */}
      <div className="w-[140px] h-[220px] flex-shrink-0 flex items-center justify-center overflow-hidden">
        {book.thumbnail ? (
          <Link href={`/${book.id}`}>
            <Image
              src={book.thumbnail}
              alt={book.title}
              width={140}
              height={220}
              className="object-cover"
            />
          </Link>
        ) : (
          <div className="text-center text-sm text-gray-500">
            Нет изображения
          </div>
        )}
      </div>

      {/* Text Section */}
      <div className="flex flex-col md:justify-between md:items-start items-center flex-grow gap-3 w-full">
        <p className={`md:text-2xl font-bold ${rubik.className}`}>
          {truncatedTitle}
        </p>
        <p className="text-sm text-gray-600">
          {Array.isArray(book.authors) && book.authors.length > 0
            ? book.authors.join(", ")
            : "Автор не указан"}
        </p>
        <span className="text-xs text-gray-500">
          {Array.isArray(book.categories) && book.categories.length > 0
            ? book.categories.join(", ")
            : "Категория не указана"}
        </span>
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            textColor="yellow"
            backgroundColor="amber"
            borderColor="black"
          >
            Купить
          </Button>
          <Button
            variant="outline"
            size="sm"
            textColor="yellow"
            backgroundColor="amber"
            borderColor="black"
          >
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
