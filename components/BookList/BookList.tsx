import { BookItem } from "../BookItem/BookItem";
import usePopularBooks from "@/hooks/usePopularBooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IBook } from "@/types/book";
import { MutatingDots } from "react-loader-spinner";

export const BookList = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: books = [],
    isLoading,
    error,
  } = usePopularBooks(category || undefined);

  // Фильтруем книги на фронтенде
  const filteredBooks = useMemo(() => {
    if (!books || !searchQuery) return books;

    const search = searchQuery.toLowerCase().trim();
    return books.filter((book: IBook) => {
      const titleMatch = book.title?.toLowerCase().includes(search);
      const authorMatch = book.authors?.some((author) =>
        author.toLowerCase().includes(search)
      );
      const categoryMatch = book.categories?.some((cat) =>
        cat.toLowerCase().includes(search)
      );

      return titleMatch || authorMatch || categoryMatch;
    });
  }, [books, searchQuery]);

  useEffect(() => {
    setIsSearching(!!searchQuery);
    console.log("Параметры поиска:", {
      категория: category || "все",
      поиск: searchQuery || "нет",
    });
  }, [searchQuery, category]);

  useEffect(() => {
    if (books) {
      console.log("Всего книг:", books.length);
      if (searchQuery) {
        console.log("Найдено после фильтрации:", filteredBooks.length);
      }
    }
  }, [books, filteredBooks, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10 h-[100%]">
        <MutatingDots />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500">Ошибка при загрузке книг</p>
      </div>
    );
  }

  const booksToDisplay = filteredBooks || [];

  if (booksToDisplay.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">
          {isSearching
            ? "По вашему запросу ничего не найдено"
            : "Книги не найдены"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {booksToDisplay.map((book) => (
        <BookItem key={book.id} book={book} isShopPage={true} />
      ))}
    </div>
  );
};
