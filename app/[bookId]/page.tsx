"use client";
import Image from "next/image";
import ArrowButton from "../../assets/Arrow.png";
import Header from "../../assets/Header.png";
import { getBookinfo, IInfo } from "../../constants/book-info";
import { Button } from "@/components/UI/Button/button";
import BookItem from "@/components/BookItem/BookItem";
import useBook from "@/hooks/useBook";
import { useParams, useRouter } from "next/navigation";
import { IBook } from "@/types/book-item";

type BookProp = {
  book: IBook;
};
export const pageDetail: React.FC<BookProp> = ({ book }) => {
  const params = useParams();
  const router = useRouter();
  const info = getBookinfo(book);
  const { bookId } = params;
  const {
    data,
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useBook(bookId);

  const handleBack = () => {
    router.back();
  };
  console.log("dataa:", data);

  if (isLoadingSearch) {
    return <div className="text-center mt-[20%]">Loading...</div>;
  }

  const {
    title,
    authors,
    publishedDate,
    description,
    imageLinks,
    averageRating,
    language,
    publisher,
  } = data?.volumeInfo;
  return (
    <div
      className="bg-cover bg-center  w-full flex "
      style={{ backgroundImage: `url(${Header.src})` }}
    >
      <Image
        onClick={handleBack}
        src={ArrowButton}
        alt="img"
        width={50}
        height={50}
        className="absolute top-10 left-16 cursor-pointer"
      />
      <div className="flex flex-wrap w-[90%] justify-center bg-white mt-36 ml-20 mb-20 p-10 gap-7 shadow-lg">
        <Image src={imageLinks?.thumbnail} alt="img" width={250} height={300} />
        <div className="w-[60%] flex flex-col gap-4">
          <h3 className="text-[70px] font-bold">{title}</h3>
          <span>By {authors}</span>
          <span>{publishedDate}</span>
          <p>Rating:{!averageRating ? "  -" : averageRating}</p>
          <p>Язык:{!language ? " -" : language}</p>
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="lg"
              textColor="yellow"
              backgroundColor="amber"
              borderColor="black"
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              textColor="yellow"
              backgroundColor="amber"
              borderColor="black"
            >
              Read book
            </Button>
          </div>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
};
export default pageDetail;
