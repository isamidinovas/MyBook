import BookItem from "../BookItem/BookItem";
import { IBook } from "@/types/book-item";

type BookListProp = {
  isShopPage?: boolean;
  books: IBook[];
};

export const BookList: React.FC<BookListProp> = ({
  isShopPage,
  books = [],
}) => {
  return (
    <div className="flex flex-wrap gap-20 justify-between h-auto  p-20 ">
      {books &&
        books.map((book: IBook) => (
          <BookItem key={book.id} book={book} isShopPage={isShopPage} />
        ))}
    </div>
  );
};

export default BookList;
