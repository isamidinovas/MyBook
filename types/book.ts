export interface IBook {
  id: string;
  googleBookId: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string | null;
  publishedDate: string;
  categories: string[];
  pageCount: number;
  publisher: string;
  language: string;
}
