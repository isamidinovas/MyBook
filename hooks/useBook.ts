import { useState, useEffect } from "react";

interface BookData {
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
    imageLinks: {
      thumbnail: string;
    };
    language: string;
    publisher: string;
    categories: string[];
    pageCount: number;
    price: number;
  };
}

export default function useBook(bookId: string) {
  const [data, setData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getBook = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/books/${bookId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Произошла ошибка при загрузке данных о книге"
          );
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Произошла ошибка при загрузке данных о книге")
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) {
      getBook();
    }
  }, [bookId]);

  return { data, isLoading, error };
}
