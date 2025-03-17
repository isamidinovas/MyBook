// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Тип для книги в корзине
interface CartBook {
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Загрузка корзины из localStorage при монтировании компонента
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("bookCart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Обновление localStorage при изменении корзины
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("bookCart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  // Расчет итоговой стоимости
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Удаление товара из корзины
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Изменение количества товара
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Оформление заказа
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Ваша корзина пуста");
      return;
    }

    // В реальном приложении здесь был бы редирект на страницу оформления заказа
    alert("Переход к оформлению заказа");
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Загрузка корзины...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">Ваша корзина пуста</h2>
          <p className="mb-6">
            Добавьте книги в корзину, чтобы продолжить покупки
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Список товаров */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid md:grid-cols-12 bg-gray-100 p-4 font-medium">
                <div className="col-span-6">Книга</div>
                <div className="col-span-2 text-center">Цена</div>
                <div className="col-span-2 text-center">Количество</div>
                <div className="col-span-2 text-center">Сумма</div>
              </div>

              {cartItems.map((book) => (
                <div
                  key={book.id}
                  className="border-b border-gray-200 last:border-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 p-4 gap-4 items-center">
                    {/* Информация о книге */}
                    <div className="md:col-span-6 flex items-center gap-4">
                      <div className="w-16 h-24 relative flex-shrink-0 bg-gray-100">
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          className="object-cover"
                          fill
                          sizes="100%"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <button
                          onClick={() => removeFromCart(book.id)}
                          className="text-sm text-red-600 hover:underline mt-2 md:hidden"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>

                    {/* Цена */}
                    <div className="md:col-span-2 text-center">
                      <span className="md:hidden font-medium">Цена: </span>
                      {book.price.toLocaleString()} ₽
                    </div>

                    {/* Количество */}
                    <div className="md:col-span-2 flex justify-center">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(book.id, book.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-10 text-center">
                          {book.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(book.id, book.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Сумма */}
                    <div className="md:col-span-2 text-center font-medium">
                      <span className="md:hidden font-medium">Сумма: </span>
                      {(book.price * book.quantity).toLocaleString()} ₽
                    </div>

                    {/* Кнопка Удалить (десктоп) */}
                    <button
                      onClick={() => removeFromCart(book.id)}
                      className="hidden md:block absolute right-4 text-gray-400 hover:text-red-600"
                      aria-label="Удалить товар"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Link
                href="/catalog"
                className="text-blue-600 hover:underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Продолжить покупки
              </Link>
              <button
                onClick={() => setCartItems([])}
                className="text-gray-600 hover:text-red-600"
              >
                Очистить корзину
              </button>
            </div>
          </div>

          {/* Итого и оформление заказа */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Итого</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>
                    Товары (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    шт.)
                  </span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка</span>
                  <span>0 ₽</span>
                </div>
                <div className="border-t pt-3 mt-3 border-gray-200 flex justify-between font-bold text-lg">
                  <span>Итого:</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Оформить заказ
              </button>

              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Безопасная оплата
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Несколько способов оплаты
                </div>
              </div>
            </div>

            {/* Промокод */}
            <div className="mt-4 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium mb-3">Промокод</h3>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите промокод"
                />
                <button className="bg-gray-200 px-4 py-2 rounded-r-lg hover:bg-gray-300">
                  Применить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
