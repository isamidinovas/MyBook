export type ICategory = {
  value: string;
  label: string;
};

export const categories: ICategory[] = [
  { value: "business", label: "Business" },
  { value: "scienes", label: "Science" },
  { value: "fiction", label: "Fiction" },
  { value: "philosophy", label: "Philosophy" },
  { value: "biography", label: "Biography" },
];

export const recomendations: ICategory[] = [
  { value: "artist-of-the-month", label: "Artist of the Month" },
  { value: "book-of-the-year", label: "Book of the Year" },
  { value: "top-genre", label: "Top Genre" },
  { value: "trending", label: "Trending" },
];
