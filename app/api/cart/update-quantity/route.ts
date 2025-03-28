import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// Функция для преобразования строки в совместимый ObjectID
function getCompatibleObjectId(input: string): string {
  // Если это уже ObjectID в шестнадцатеричном формате, возвращаем его
  if (/^[0-9a-fA-F]{24}$/.test(input)) {
    return input;
  }

  // Иначе генерируем детерминированный хэш из входной строки
  const hash = crypto.createHash("md5").update(input).digest("hex");
  return hash.substring(0, 24);
}

export async function PUT(request: Request) {
  try {
    console.log("Запрос на обновление количества товара в корзине");

    const sessionCookie = cookies().get("session");
    if (!sessionCookie) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (error) {
      console.error("Ошибка при парсинге сессии:", error);
      return NextResponse.json(
        { error: "Недействительная сессия" },
        { status: 401 }
      );
    }

    if (!session.userId) {
      return NextResponse.json(
        { error: "Отсутствует ID пользователя" },
        { status: 401 }
      );
    }

    // Преобразуем userId в совместимый с MongoDB ObjectID
    const userId = session.userId;
    const compatibleUserId = getCompatibleObjectId(userId);

    console.log(
      `Обновление количества товара для пользователя: ${userId} -> ${compatibleUserId}`
    );

    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Ошибка при парсинге тела запроса:", error);
      return NextResponse.json(
        { error: "Некорректный формат запроса" },
        { status: 400 }
      );
    }

    const { cartItemId, quantity } = body;

    // Проверка входных данных
    if (!cartItemId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Необходимо указать cartItemId и количество больше 0" },
        { status: 400 }
      );
    }

    // Находим элемент корзины и убеждаемся, что он принадлежит корзине этого пользователя
    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Элемент корзины не найден" },
        { status: 404 }
      );
    }

    // Проверяем, принадлежит ли элемент корзине пользователя
    if (cartItem.cart.userId !== compatibleUserId) {
      console.log(
        `Несоответствие ID пользователя: ${cartItem.cart.userId} !== ${compatibleUserId}`
      );
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    // Обновляем количество
    console.log(
      `Обновление количества для элемента ${cartItemId}: ${cartItem.quantity} -> ${quantity}`
    );

    const updatedCartItem = await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { book: true },
    });

    // Получаем обновленную корзину для ответа
    const updatedCart = await db.cart.findFirst({
      where: { userId: compatibleUserId },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      cartItem: updatedCartItem,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Ошибка при обновлении количества товара:", error);
    return NextResponse.json(
      {
        error: `Ошибка сервера при обновлении количества товара: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
