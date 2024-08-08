const apiKey = "AIzaSyCTuVDalSOewvP5nMz_v_G4JLimUMEpH4g";

export const fetchBooks = async (search: string, category: string) => {
  if (!search) return null;

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${search}${
      category ? `+subject:${category}` : ""
    }&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  return data.items || [];
};
