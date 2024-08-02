export type IBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[] | string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    description: string;
    categories: string;
  };
};
