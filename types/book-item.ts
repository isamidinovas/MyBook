export type IBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[] | string;
    averageRating: number;
    ratingsCount: number;
    publisher: string;
    publishedDate: string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    description: string;
    categories: string;
  };
};
