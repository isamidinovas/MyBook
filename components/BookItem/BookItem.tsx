// import { IBook } from "@/types/book";
// import Image from "next/image";
// import { Rubik } from "next/font/google";
// import { Button } from "../UI/Button/button";
// import Link from "next/link";
// import { useState } from "react";
// import toast from "react-hot-toast";

// const rubik = Rubik({
//   subsets: ["latin"],
//   weight: "400",
// });

// type BookItemProp = {
//   book: IBook;
//   isShopPage?: boolean;
// };

// export const BookItem: React.FC<BookItemProp> = ({ book, isShopPage }) => {
//   const [isAddingToCart, setIsAddingToCart] = useState(false);

//   // Проверяем наличие необходимых данных
//   if (!book || !book.title) {
//     console.error("BookItem received invalid book data:", book);
//     return null;
//   }
//   const handleAddToCart = async () => {
//     try {
//       setIsAddingToCart(true);
//       const response = await fetch("/api/cart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           book,
//           quantity: 1,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Ошибка при добавлении в корзину");
//       }

//       const cartItem = await response.json();

//       window.dispatchEvent(
//         new CustomEvent("cartUpdated", {
//           detail: { cartItem },
//         })
//       );

//       toast.success("Книга добавлена в корзину");
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Не удалось добавить книгу в корзину"
//       );
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   const truncatedTitle =
//     book.title.length > 25 ? book.title.slice(0, 25) + "..." : book.title;

//   return (
//     <div
//       className={`group relative flex md:flex-row flex-col gap-7 items-center md:w-[100%] w-[100%] min-h-[250px] p-4 transition-transform duration-300 ease-in-out ${
//         isShopPage
//           ? "bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105"
//           : "hover:scale-105"
//       }`}
//     >
//       {/* Image Section */}
//       <div className="w-[140px] h-[220px] flex-shrink-0 flex items-center justify-center overflow-hidden">
//         {book.thumbnail ? (
//           <Link href={`/${book.id}`}>
//             <Image
//               src={book.thumbnail}
//               alt={book.title}
//               width={140}
//               height={220}
//               className="object-cover"
//             />
//           </Link>
//         ) : (
//           <div className="text-center text-sm text-gray-500">
//             Нет изображения
//           </div>
//         )}
//       </div>

//       {/* Text Section */}
//       <div className="flex flex-col md:justify-between md:items-start items-center flex-grow gap-3 w-full">
//         <p className={`md:text-2xl font-bold ${rubik.className}`}>
//           {truncatedTitle}
//         </p>
//         <p className="text-sm text-gray-600">
//           {Array.isArray(book.authors) && book.authors.length > 0
//             ? book.authors.join(", ")
//             : "Автор не указан"}
//         </p>
//         <span className="text-xs text-gray-500">
//           {Array.isArray(book.categories) && book.categories.length > 0
//             ? book.categories.join(", ")
//             : "Категория не указана"}
//         </span>
//         <div className="flex justify-between gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             textColor="yellow"
//             backgroundColor="amber"
//             borderColor="black"
//           >
//             Купить
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             textColor="yellow"
//             backgroundColor="amber"
//             borderColor="black"
//             onClick={handleAddToCart}
//           >
//             В корзину
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookItem;
import { IBook } from "@/types/book";
import Image from "next/image";
import { Rubik } from "next/font/google";
import { Button } from "../UI/Button/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { addToCart, getCart, removeFromCart } from "@/api/cartApi";

const rubik = Rubik({
  subsets: ["latin"],
  weight: "400",
});

type BookItemProp = {
  book: IBook;
  isShopPage?: boolean;
};

export const BookItem: React.FC<BookItemProp> = ({ book, isShopPage }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState("");

  // Проверяем, есть ли книга уже в корзине при загрузке компонента
  useEffect(() => {
    const checkIfInCart = async () => {
      try {
        const cart = await getCart();

        if (cart && cart.items && Array.isArray(cart.items)) {
          const cartItem = cart.items.find(
            (item: { book: { id: string; googleBookId?: string } }) =>
              item.book &&
              (item.book.id === book.id || item.book.googleBookId === book.id)
          );

          if (cartItem) {
            setIsInCart(true);
            setCartItemId(cartItem.id);
            console.log(
              `Книга ${book.title} уже в корзине, ID элемента:`,
              cartItem.id
            );
          } else {
            setIsInCart(false);
            setCartItemId("");
          }
        }
      } catch (error) {
        console.error(
          `Ошибка при проверке наличия книги ${book.title} в корзине:`,
          error
        );
      }
    };

    if (book && book.id) {
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
  }, [book]);

  // Проверяем наличие необходимых данных
  if (!book || !book.title) {
    console.error("BookItem received invalid book data:", book);
    return null;
  }

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
        const result = await addToCart(book.id, 1);

        if (result && result.id) {
          setIsInCart(true);
          setCartItemId(result.id);
        }

        toast.success("Книга добавлена в корзину");
      }

      // Оповещаем об изменении корзины
      window.dispatchEvent(new CustomEvent("cartUpdated"));
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
        await addToCart(book.id, 1);
      }

      // Перенаправляем на страницу корзины (используем window.location для перехода на другую страницу)
      window.location.href = "/cart";
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Не удалось добавить книгу в корзину");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const truncatedTitle =
    book.title.length > 25 ? book.title.slice(0, 25) + "..." : book.title;

  return (
    <div
      className={`group relative flex md:flex-row flex-col gap-7 items-center md:w-[100%] w-[100%] min-h-[250px] p-4 transition-transform duration-300 ease-in-out ${
        isShopPage
          ? "bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105"
          : "hover:scale-105"
      }`}
    >
      {/* Image Section */}
      <div className="w-[140px] h-[220px] flex-shrink-0 flex items-center justify-center overflow-hidden">
        {book.thumbnail ? (
          <Link href={`/${book.id}`}>
            <Image
              src={book.thumbnail}
              alt={book.title}
              width={140}
              height={220}
              className="object-cover"
            />
          </Link>
        ) : (
          <div className="text-center text-sm text-gray-500">
            Нет изображения
          </div>
        )}
      </div>

      {/* Text Section */}
      <div className="flex flex-col md:justify-between md:items-start items-center flex-grow gap-3 w-full">
        <p className={`md:text-2xl font-bold ${rubik.className}`}>
          {truncatedTitle}
        </p>
        <p className="text-sm text-gray-600">
          {Array.isArray(book.authors) && book.authors.length > 0
            ? book.authors.join(", ")
            : "Автор не указан"}
        </p>
        <span className="text-xs text-gray-500">
          {Array.isArray(book.categories) && book.categories.length > 0
            ? book.categories.join(", ")
            : "Категория не указана"}
        </span>
        <div className="flex justify-between gap-2 w-full">
          <Button
            onClick={handleBuyNow}
            variant="outline"
            size="sm"
            textColor="yellow"
            backgroundColor="amber"
            borderColor="black"
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Обработка..." : "Купить"}
          </Button>
          <Button
            onClick={handleToggleCart}
            variant={isInCart ? "secondary" : "outline"}
            size="sm"
            textColor={isInCart ? "white" : "yellow"}
            backgroundColor="amber"
            borderColor="black"
            className={`${
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
        </div>
      </div>
    </div>
  );
};

export default BookItem;
