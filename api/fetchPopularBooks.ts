import { IBook } from "@/types/book";

export const fetchPopularBooks = async (
  category?: string
): Promise<IBook[]> => {
  try {
    const params = new URLSearchParams();
    if (category) {
      params.append("category", category);
    }

    const url = `/api/books${params.toString() ? `?${params.toString()}` : ""}`;
    console.log("Запрос к API:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const books = await response.json();
    console.log(`Получено ${books.length} книг`);
    return books;
  } catch (error) {
    console.error("Ошибка при получении книг:", error);
    throw error;
  }
};
