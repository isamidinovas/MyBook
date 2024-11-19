// const apiKey = "AIzaSyCTuVDalSOewvP5nMz_v_G4JLimUMEpH4g";

export const fetchBook = async (bookId: number) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  return data;
};
