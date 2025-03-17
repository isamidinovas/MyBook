export type IBook = {
  id: string;
  googleBookId: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string | null;
  categories: string[];
  publisher: string | null;
  publishedDate: string;
  pageCount: number | null;
  language: string | null;
  createdAt: Date;
  updatedAt: Date;
};
