import { IBook } from "@/types/book-item";

export type IInfo = {
  value: string;
  label: string;
};

export const getBookinfo = (book: IBook) => {
  const info = [
    { value: book?.volumeInfo.publisher, label: "Penerbit" },
    { value: book?.volumeInfo.publishedDate, label: "Diterbitkan tanggal" },
    { value: book?.volumeInfo.description, label: "Bahasa" },
    { value: "philosophy", label: "Genre" },
    { value: "science", label: "Halaman" },
    { value: "biography", label: "Keterangan" },
  ];
  return info;
};

// Нужно доработать
