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
    ratingsCount,
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
      <div className="flex flex-wrap w-[50%]  bg-white mt-36 ml-20 mb-20 p-10 gap-7 shadow-lg">
        <Image src={imageLinks?.thumbnail} alt="img" width={250} height={300} />
        <div className="w-[60%] flex flex-col gap-4">
          <h3 className="text-[70px] font-bold">{title}</h3>
          <span>By {authors}</span>
          <span>{publishedDate}</span>
          <p>Rating:{!averageRating ? "  -" : averageRating}</p>
          <p>Оценок:{!ratingsCount ? "  -" : ratingsCount}</p>
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="lg"
              textColor="yellow"
              backgroundColor="amber"
              borderColor="yellow"
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              textColor="yellow"
              backgroundColor="amber"
              borderColor="yellow"
            >
              Read book
            </Button>
          </div>
        </div>
        <p className="text-xl font-bold">Sinopsis</p>
        <p>{description}</p>
        <p className="bg-gray-300 rounded-lg p-1">Memoar</p>
        <p className="text-xl font-bold w-[100%]">Informasi Tambahan</p>
        <div className="flex gap-10 flex-wrap w-[80%]">
          {info.map((info: IInfo) => (
            <div className="flex flex-col gap-3 w-[25%]">
              <p key={info.value}>{info.label}</p>
              <p key={info.value} className="opacity-35">
                {info.value}
              </p>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="xl"
          textColor="yellow"
          backgroundColor="amber"
          borderColor="yellow"
          className="m-auto text-base"
        >
          See comment
        </Button>
      </div>
      <div className="w-[40%] mt-36 ml-20 ">
        <h3 className="text-3xl text-white font-bold p-6">Cerita serupa</h3>
        <div className="bg-white rounded-lg m-2 shadow-lg">
          <BookItem
            book={{
              id: "",
              volumeInfo: {
                title: "hhhhhh",
                authors: "sssssss",
                averageRating: 1,
                publishedDate: "2012",
                ratingsCount: 3,
                publisher: "ss",
                imageLinks: {
                  smallThumbnail: "",
                  thumbnail: "",
                },
                description:
                  "ssssssssssssssssssssssssssssssdddddddddddddddddddddddddddddddddddddddsssssssssss",
                categories: "sssssssssss",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default pageDetail;
