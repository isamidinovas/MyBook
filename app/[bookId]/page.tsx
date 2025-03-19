"use client";
import Image from "next/image";
import ArrowButton from "../../assets/Arrow.png";
import Header from "../../assets/Header.png";
import { Button } from "@/components/UI/Button/button";
import useBook from "@/hooks/useBook";
import { useParams, useRouter } from "next/navigation";
import { MutatingDots } from "react-loader-spinner";

export const PageDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { bookId } = params;

  console.log("Current bookId:", bookId);

  const {
    data,
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useBook(bookId as string);

  const handleBack = () => {
    router.back();
  };

  if (isLoadingSearch) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <MutatingDots
          height="100"
          width="100"
          color="#4F46E5"
          secondaryColor="#4F46E5"
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  if (errorSearch) {
    console.error("Error in PageDetail:", errorSearch);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {errorSearch.message?.includes("503")
            ? "Сервис временно недоступен. Пожалуйста, попробуйте позже."
            : "Произошла ошибка при загрузке данных о книге"}
        </h2>
        <Button
          onClick={handleBack}
          variant="outline"
          size="lg"
          textColor="yellow"
          backgroundColor="amber"
          borderColor="black"
        />
      </div>
    );
  }

  if (!data || !data.volumeInfo) {
    console.log("No data or volumeInfo:", data);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">
          Книга не найдена
        </h2>
        <Button
          onClick={handleBack}
          variant="outline"
          size="lg"
          textColor="yellow"
          backgroundColor="amber"
          borderColor="black"
        />
      </div>
    );
  }

  const { volumeInfo } = data;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[200px]">
        <Image
          src={Header}
          alt="Header"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">
            {volumeInfo.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={handleBack}
          // variant="outline"
          // textColor="yellow"
          // backgroundColor="amber"
          borderColor="black"
          className=" bg-black rounded-full"
        >
          <Image
            src={ArrowButton}
            alt="Back"
            width={24}
            height={24}
            className="mr-2"
          />
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full h-[400px]">
            {volumeInfo.imageLinks?.thumbnail ? (
              <Image
                src={volumeInfo.imageLinks.thumbnail}
                alt={volumeInfo.title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Изображение отсутствует</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{volumeInfo.title}</h2>
              <p className="text-gray-600">
                Автор: {volumeInfo.authors?.join(", ") || "Не указан"}
              </p>
            </div>

            {volumeInfo.price && (
              <div className="text-2xl font-bold text-green-600">
                {volumeInfo.price.toLocaleString("kg-KG")} сом
              </div>
            )}

            <div className="space-y-2">
              <p className="text-gray-600">
                Дата публикации: {volumeInfo.publishedDate || "Не указана"}
              </p>
              <p className="text-gray-600">
                Издательство: {volumeInfo.publisher || "Не указано"}
              </p>
              <p className="text-gray-600">
                Язык: {volumeInfo.language || "Не указан"}
              </p>
              <p className="text-gray-600">
                Количество страниц: {volumeInfo.pageCount || "Не указано"}
              </p>
            </div>

            {volumeInfo.categories && volumeInfo.categories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Категории:</h3>
                <div className="flex flex-wrap gap-2">
                  {volumeInfo.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Описание:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {volumeInfo.description || "Описание отсутствует"}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                textColor="yellow"
                backgroundColor="amber"
                borderColor="black"
                className="flex-1"
              >
                В корзину
              </Button>
              <Button
                variant="outline"
                size="lg"
                textColor="yellow"
                backgroundColor="amber"
                borderColor="black"
                className="flex-1"
              >
                Купить сейчас
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetail;
