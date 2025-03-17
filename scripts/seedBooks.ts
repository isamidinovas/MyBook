import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { categories } from "../constants/categories";

const prisma = new PrismaClient();

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate?: string;
    categories?: string[];
    pageCount?: number;
    publisher?: string;
    language?: string;
  };
}

async function fetchBooksFromGoogle(
  query: string,
  maxResults: number = 40,
  maxRetries: number = 3
): Promise<GoogleBook[]> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}`,
        {
          headers: {
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );
      return response.data.items || [];
    } catch (error) {
      if (attempt === maxRetries - 1) {
        if (axios.isAxiosError(error)) {
          console.error(
            `Error fetching books from Google Books API: ${error.message}`
          );
          if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
          }
        } else {
          console.error("Error fetching books from Google Books API:", error);
        }
        return [];
      }

      if (axios.isAxiosError(error) && error.response?.status === 503) {
        console.log(`Attempt ${attempt + 1} failed, retrying...`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      } else {
        throw error;
      }
    }
  }
  return [];
}

async function seedBooks() {
  try {
    console.log("Fetching books from Google Books API...");

    // Получаем книги для каждой категории из нашего списка
    let allBooks: GoogleBook[] = [];

    for (const category of categories) {
      console.log(`Fetching books for category: ${category.label}`);
      const books = await fetchBooksFromGoogle(`subject:${category.value}`, 40);

      // Добавляем категорию к каждой книге
      const booksWithCategory = books.map((book) => ({
        ...book,
        volumeInfo: {
          ...book.volumeInfo,
          categories: [category.value, ...(book.volumeInfo.categories || [])],
        },
      }));

      allBooks = [...allBooks, ...booksWithCategory];
      console.log(`Found ${books.length} books for ${category.label}`);

      // Небольшая задержка между запросами
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`Total books found: ${allBooks.length}`);

    // Сохраняем книги в базу данных
    for (const book of allBooks) {
      if (!book.volumeInfo) {
        console.log(`Skipping book ${book.id} - no volume info`);
        continue;
      }

      const volumeInfo = book.volumeInfo;

      try {
        await prisma.book.create({
          data: {
            googleBookId: book.id,
            title: volumeInfo.title,
            authors: volumeInfo.authors || ["Unknown Author"],
            description: volumeInfo.description || "No description available",
            thumbnail: volumeInfo.imageLinks?.thumbnail || null,
            publishedDate: volumeInfo.publishedDate || new Date().toISOString(),
            categories: volumeInfo.categories || ["Uncategorized"],
            pageCount: volumeInfo.pageCount || 0,
            publisher: volumeInfo.publisher || "Unknown Publisher",
            language: volumeInfo.language || "en",
          },
        });
        console.log(
          `Added book: ${
            volumeInfo.title
          } with categories: ${volumeInfo.categories?.join(", ")}`
        );
      } catch (error) {
        console.error(`Error adding book ${volumeInfo.title}:`, error);
      }
    }

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBooks();
