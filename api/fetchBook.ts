import { db } from "@/lib/db";

// const apiKey = "AIzaSyCTuVDalSOewvP5nMz_v_G4JLimUMEpH4g";

export const fetchBook = async (bookId: string) => {
  try {
    console.log("Fetching book with ID:", bookId);

    const book = await db.book.findUnique({
      where: {
        id: bookId,
      },
    });

    console.log("Found book:", book);

    if (!book) {
      throw new Error("Книга не найдена");
    }

    const result = {
      volumeInfo: {
        title: book.title,
        authors: book.authors,
        publishedDate: book.publishedDate,
        description: book.description,
        imageLinks: {
          thumbnail: book.thumbnail,
        },
        language: book.language,
        publisher: book.publisher,
        categories: book.categories,
        pageCount: book.pageCount,
        price: book.price,
      },
    };

    console.log("Formatted result:", result);
    return result;
  } catch (error) {
    console.error("Error in fetchBook:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Произошла ошибка при загрузке данных о книге");
  }
};
