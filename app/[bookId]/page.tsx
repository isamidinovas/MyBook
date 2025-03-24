"use client";
import Image from "next/image";
import ArrowButton from "../../assets/Arrow.png";
import Header from "../../assets/Header.png";
import { Button } from "@/components/UI/Button/button";
import useBook from "@/hooks/useBook";
import { useParams, useRouter } from "next/navigation";
import { MutatingDots } from "react-loader-spinner";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { addToCart, getCart, removeFromCart } from "@/api/cartApi";

export const PageDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { bookId } = params;
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState("");

  console.log("Current bookId:", bookId);

  const {
    data,
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useBook(bookId as string);

  // Проверяем, есть ли книга уже в корзине при загрузке страницы
  useEffect(() => {
    const checkIfInCart = async () => {
      try {
        const cart = await getCart();

        if (cart && cart.items && Array.isArray(cart.items)) {
          const cartItem = cart.items.find(
            (item: {
              book: { id: string | string[]; googleBookId: string | string[] };
            }) =>
              item.book &&
              (item.book.id === bookId || item.book.googleBookId === bookId)
          );

          if (cartItem) {
            setIsInCart(true);
            setCartItemId(cartItem.id);
            console.log("Книга уже в корзине, ID элемента:", cartItem.id);
          } else {
            setIsInCart(false);
            setCartItemId("");
          }
        }
      } catch (error) {
        console.error("Ошибка при проверке корзины:", error);
      }
    };

    if (bookId) {
      checkIfInCart();
    }

    // Также слушаем событие обновления корзины
    const handleCartUpdate = () => {
      checkIfInCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [bookId]);

  const handleBack = () => {
    router.back();
  };

  const handleToggleCart = async () => {
    try {
      setIsAddingToCart(true);

      if (isInCart) {
        // Если книга уже в корзине, удаляем её
        await removeFromCart(cartItemId);
        setIsInCart(false);
        setCartItemId("");
        toast.success("Книга удалена из корзины");
      } else {
        // Если книги нет в корзине, добавляем её
        const result = await addToCart(bookId as string, 1);

        if (result && result.id) {
          setIsInCart(true);
          setCartItemId(result.id);
        }

        toast.success("Книга добавлена в корзину");
      }
    } catch (error) {
      console.error("Error toggling cart:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось выполнить операцию с корзиной"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setIsAddingToCart(true);

      if (!isInCart) {
        // Только если книги еще нет в корзине, добавляем её
        await addToCart(bookId as string, 1);
      }

      // Перенаправляем на страницу корзины
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Не удалось добавить книгу в корзину");
    } finally {
      setIsAddingToCart(false);
    }
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
        >
          Вернуться назад
        </Button>
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
        >
          Вернуться назад
        </Button>
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
          variant="outline"
          size="lg"
          textColor="yellow"
          backgroundColor="amber"
          borderColor="black"
          className="mb-8"
        >
          <Image
            src={ArrowButton}
            alt="Back"
            width={24}
            height={24}
            className="mr-2"
          />
          Вернуться назад
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
                {typeof volumeInfo.price === "number"
                  ? volumeInfo.price.toLocaleString("ru-RU")
                  : volumeInfo.price}{" "}
                ₽
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
                onClick={handleToggleCart}
                variant={isInCart ? "secondary" : "outline"}
                size="lg"
                textColor={isInCart ? "white" : "yellow"}
                backgroundColor="amber"
                borderColor="black"
                className={`flex-1 ${
                  isInCart ? "bg-green-600 text-white hover:bg-green-700" : ""
                }`}
                disabled={isAddingToCart}
              >
                {isAddingToCart
                  ? "Обработка..."
                  : isInCart
                  ? "В корзине ✓"
                  : "В корзину"}
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                size="lg"
                textColor="yellow"
                backgroundColor="amber"
                borderColor="black"
                className="flex-1"
                disabled={isAddingToCart}
              >
                {isAddingToCart ? "Обработка..." : "Купить сейчас"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetail;
