import { useState } from "react";
import Image from "next/image";
import { Button } from "../UI/Button/button";
import { removeFromCart } from "@/api/cartApi";
import { toast } from "react-hot-toast";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    book: {
      id: string;
      title: string;
      authors: string[];
      thumbnail: string | null;
      description?: string;
    };
  };
  onUpdate: () => void;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
}

const CartItem = ({ item, onUpdate, updateQuantity }: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [isRemoved, setIsRemoved] = useState(false);

  // Используем фиксированную цену, так как у нас нет реальных цен для книг
  const price = 499; // фиксированная цена в рублях
  const totalPrice = price * quantity;

  const handleRemove = async () => {
    if (isRemoving) return;

    try {
      setIsRemoving(true);
      await removeFromCart(item.id);
      toast.success("Книга удалена из корзины");

      // Помечаем товар как удаленный для визуального эффекта
      setIsRemoved(true);

      // Отправляем событие обновления корзины через window
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { items: [] },
        })
      );

      // Вызываем функцию обновления после небольшой задержки
      setTimeout(() => {
        onUpdate();
      }, 300);
    } catch (error) {
      console.error("Ошибка при удалении из корзины:", error);
      toast.error("Не удалось удалить книгу из корзины");
      setIsRemoving(false);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (isUpdating || newQuantity < 1) return;

    try {
      setIsUpdating(true);
      await updateQuantity(item.id, newQuantity);
      setQuantity(newQuantity);
      toast.success("Количество обновлено");
    } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
      toast.error("Не удалось обновить количество");
    } finally {
      setIsUpdating(false);
    }
  };

  // Если товар удален, не отображаем его
  if (isRemoved) {
    return (
      <div className="p-6 flex flex-col sm:flex-row items-center animate-fade-out bg-red-50">
        <p className="text-gray-500 italic">Товар удален из корзины...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col sm:flex-row items-center">
      <div className="flex-shrink-0 w-24 h-32 relative mb-4 sm:mb-0">
        {item.book.thumbnail ? (
          <Image
            src={item.book.thumbnail}
            alt={item.book.title}
            width={96}
            height={128}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            Нет изображения
          </div>
        )}
      </div>

      <div className="sm:ml-6 flex-1">
        <h3 className="text-lg font-medium text-gray-900">{item.book.title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {item.book.authors?.join(", ") || "Автор не указан"}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Количество:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={isUpdating || quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                -
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isUpdating}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-gray-600">
            <span className="font-medium">Цена:</span> {price} ₽
          </div>

          <div className="text-gray-900 font-medium">
            <span>Сумма:</span> {totalPrice} ₽
          </div>

          <Button
            variant="outline"
            size="sm"
            textColor="yellow"
            backgroundColor="amber"
            borderColor="black"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? "Удаление..." : "Удалить"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
