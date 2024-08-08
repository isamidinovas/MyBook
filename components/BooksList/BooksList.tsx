import BookItem from "../BookItem/BookItem";
import { IBook } from "@/types/book-item";

type BookListProp = {
  isShopPage?: boolean;
  books: IBook[];
  isLoadingPopular?: boolean; // Optional: Handle loading state if needed
  errorPopular?: string;
  title?: string;
};

export const BookList: React.FC<BookListProp> = ({
  isShopPage,
  books,
  title,
  isLoadingPopular = false, // Default to false if not provided
  errorPopular = null, // Default to null if not provided
}) => {
  if (isLoadingPopular) {
    return <p className="m-auto font-bold text-lg">Loading...</p>;
  }

  if (errorPopular) {
    return (
      <p className="m-auto font-bold text-lg text-red-500">
        Error: {errorPopular}
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-20 justify-between h-auto  p-10 ">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className="flex flex-wrap gap-20 justify-between h-auto">
        {books.length > 0 ? (
          books.map((book: IBook) => (
            <BookItem key={book.id} book={book} isShopPage={isShopPage} />
          ))
        ) : (
          <p className="m-auto font-bold text-lg">No Data</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
