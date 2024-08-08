import { categories } from "@/constants/categories";

const apiKey = "AIzaSyCTuVDalSOewvP5nMz_v_G4JLimUMEpH4g";

export const fetchPopularBooks = async (category?: string, maxResults = 10) => {
  if (category) {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&orderBy=relevance&maxResults=${maxResults}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular books");
    }

    const data = await response.json();
    return data.items || [];
  } else {
    const requests = categories.map((cat) =>
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${cat}&orderBy=relevance&maxResults=${maxResults}&key=${apiKey}`
      )
    );

    const responses = await Promise.all(requests);

    const dataPromises = responses.map((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch popular books");
      }
      return response.json();
    });

    const data = await Promise.all(dataPromises);

    // Combine results and filter out duplicates
    const books = data.flatMap((item) => item.items || []);
    const uniqueBooks = Array.from(new Set(books.map((book) => book.id))).map(
      (id) => books.find((book) => book.id === id)
    );
    return uniqueBooks;
  }
};
