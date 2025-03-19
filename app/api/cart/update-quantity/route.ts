import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Определяем типы данных
interface CartItem {
  id: string;
  quantity: number;
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail: string | null;
    description: string;
  };
}

interface Cart {
  items: CartItem[];
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const { cartItemId, quantity } = await request.json();

    // Проверка входных данных
    if (!cartItemId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Необходимо указать cartItemId и количество больше 0" },
        { status: 400 }
      );
    }

    // Получаем текущую корзину из cookie
    const cartCookie = cookieStore.get("cart");
    if (!cartCookie || !cartCookie.value) {
      return NextResponse.json(
        { error: "Корзина не найдена" },
        { status: 404 }
      );
    }

    try {
      // Парсим данные корзины
      let cart: Cart;
      try {
        cart = JSON.parse(cartCookie.value) as Cart;
      } catch (parseError) {
        console.error("Ошибка при парсинге корзины:", parseError);
        return NextResponse.json(
          { error: "Некорректный формат данных корзины" },
          { status: 400 }
        );
      }

      if (!cart.items || !Array.isArray(cart.items)) {
        cart = { items: [] };
      }

      // Ищем товар в корзине
      const itemIndex = cart.items.findIndex((item) => item.id === cartItemId);
      if (itemIndex === -1) {
        return NextResponse.json(
          { error: "Товар не найден в корзине" },
          { status: 404 }
        );
      }

      // Обновляем количество
      cart.items[itemIndex].quantity = quantity;

      // Сохраняем обновленную корзину в cookie
      cookieStore.set("cart", JSON.stringify(cart), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 дней
      });

      return NextResponse.json({ success: true, cart });
    } catch (error) {
      console.error("Внутренняя ошибка при обновлении количества:", error);
      return NextResponse.json(
        { error: "Ошибка при обработке данных корзины" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Ошибка при обновлении количества товара:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при обновлении количества товара" },
      { status: 500 }
    );
  }
}
