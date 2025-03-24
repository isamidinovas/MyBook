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

export async function DELETE(request: Request) {
  try {
    console.log("Запрос на удаление элемента корзины");

    // Получаем ID из тела запроса
    const body = await request.json();
    const { cartItemId } = body;

    console.log("Полученный ID элемента корзины:", cartItemId);

    if (!cartItemId) {
      return NextResponse.json(
        { error: "ID элемента корзины не указан" },
        { status: 400 }
      );
    }

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
      `Удаление элемента корзины для пользователя: ${userId} -> ${compatibleUserId}`
    );

    // Находим элемент корзины и проверяем, принадлежит ли он корзине пользователя
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

    // Удаляем элемент из базы данных
    await db.cartItem.delete({
      where: { id: cartItemId },
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
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      {
        error: `Ошибка при удалении из корзины: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
