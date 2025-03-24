import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
// import { ObjectId } from "mongodb";
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

// Получение данных о книге по ID
async function getBookById(bookId: string) {
  try {
    console.log(`Получаем информацию о книге: ${bookId}`);

    // Защита от null или undefined
    if (!bookId) {
      console.error("ID книги не указан");
      throw new Error("ID книги не указан");
    }

    // Проверяем формат ID книги и нормализуем
    const isGoogleBooksId =
      bookId.startsWith("googlebooks/") || bookId.includes("_");

    // Если ID не в формате Google Books, мы должны использовать другой маршрут или преобразовать ID
    let googleBooksId = bookId;
    if (isGoogleBooksId && bookId.startsWith("googlebooks/")) {
      googleBooksId = bookId.replace("googlebooks/", "");
    }

    // Добавляем обработку ошибок и повторные попытки
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        // Улучшенный запрос к Google Books API с дополнительными параметрами
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
            googleBooksId
          )}?fields=id,volumeInfo(title,authors,description,imageLinks)`,
          {
            cache: "no-store", // Изменено для избегания кэш-проблем
            headers: {
              Accept: "application/json",
            },
            // Добавляем таймаут
            signal: AbortSignal.timeout(5000),
          }
        );

        if (!response.ok) {
          const status = response.status;
          console.error(
            `Попытка ${retryCount + 1}/${
              maxRetries + 1
            }: Ошибка получения данных о книге ${googleBooksId}: ${status}`
          );

          // Для отладки выводим полное содержимое ответа
          const errorText = await response.text();
          console.error("Подробности ошибки:", errorText);

          // Если это последняя попытка или серьезная ошибка, идем к поиску
          if (retryCount === maxRetries || (status !== 429 && status !== 503)) {
            console.log(`Переходим к поиску для ID: ${bookId}`);
            return await findBookBySearch(bookId);
          }

          // Ждем перед повторной попыткой (с экспоненциальной задержкой)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, retryCount))
          );
          retryCount++;
          continue;
        }

        // Если дошли сюда, значит запрос успешен
        const data = await response.json();
        console.log(`Получены данные о книге:`, data);

        // Проверяем наличие данных и формируем безопасный объект книги
        if (!data || !data.volumeInfo) {
          console.error("Некорректный формат данных книги");
          return await findBookBySearch(bookId);
        }

        // Преобразуем данные в нужный формат с проверками и нормализацией
        const volumeInfo = data.volumeInfo;
        const bookData = {
          id: data.id || bookId,
          googleBookId: data.id || bookId,
          title: volumeInfo.title || "Название недоступно",
          authors:
            Array.isArray(volumeInfo.authors) && volumeInfo.authors.length > 0
              ? volumeInfo.authors
              : typeof volumeInfo.authors === "string" && volumeInfo.authors
              ? [volumeInfo.authors]
              : ["Автор не указан"],
          thumbnail: volumeInfo.imageLinks?.thumbnail || null,
          description:
            typeof volumeInfo.description === "string"
              ? volumeInfo.description
              : "",
        };

        console.log(`Успешно получены данные о книге:`, bookData);
        return bookData;
      } catch (fetchError) {
        console.error(
          `Попытка ${retryCount + 1}/${maxRetries + 1}: Ошибка запроса:`,
          fetchError
        );

        if (retryCount === maxRetries) {
          console.log(
            `Все попытки исчерпаны, переходим к поиску для ID: ${bookId}`
          );
          return await findBookBySearch(bookId);
        }

        // Ждем перед повторной попыткой
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, retryCount))
        );
        retryCount++;
      }
    }

    // Если цикл завершился без успеха, пробуем поиск
    return await findBookBySearch(bookId);
  } catch (error) {
    console.error("Ошибка при получении книги по ID:", error);
    // Пробуем альтернативный метод поиска
    return await findBookBySearch(bookId);
  }
}

// Вспомогательная функция для поиска книги по ID через search API
async function findBookBySearch(bookId: string) {
  try {
    console.log(`Поиск книги через поисковый API для ID: ${bookId}`);

    // Защита от null или undefined
    if (!bookId) {
      console.error("ID книги не указан для поиска");
      throw new Error("ID книги не указан для поиска");
    }

    // Чистим и нормализуем поисковый запрос
    const cleanId = bookId.replace(/[^\w\d\s-]/g, " ").trim();

    // Используем эвристику для поиска с несколькими вариантами
    let searchQuery;
    if (cleanId.includes("_")) {
      searchQuery = cleanId.replace(/_/g, " ").slice(0, 30);
    } else if (cleanId.length > 20) {
      // Для длинных ID возьмем только начало
      searchQuery = cleanId.slice(0, 20);
    } else {
      searchQuery = cleanId;
    }

    console.log(`Поисковый запрос: "${searchQuery}"`);

    // Запрос с обработкой ошибок и таймаутом
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=1`,
        {
          cache: "no-store",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Ошибка поиска книги: ${response.status}`);
        throw new Error(`Ошибка поиска книги: ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        console.error("Книга не найдена через поиск");
        throw new Error("Книга не найдена через поиск");
      }

      const book = data.items[0];
      const volumeInfo = book.volumeInfo || {};

      console.log(`Книга найдена через поиск:`, book);

      // Создаем безопасный объект книги с проверками всех полей
      return {
        id: book.id || `book_${Date.now()}`,
        googleBookId: book.id || `book_${Date.now()}`,
        title: volumeInfo.title || "Название недоступно",
        authors:
          Array.isArray(volumeInfo.authors) && volumeInfo.authors.length > 0
            ? volumeInfo.authors
            : typeof volumeInfo.authors === "string" && volumeInfo.authors
            ? [volumeInfo.authors]
            : ["Автор не указан"],
        thumbnail: volumeInfo.imageLinks?.thumbnail || null,
        description:
          typeof volumeInfo.description === "string"
            ? volumeInfo.description.slice(0, 1000) // Ограничиваем длину для защиты
            : "",
      };
    } catch (fetchError) {
      console.error("Ошибка запроса при поиске:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("Ошибка при поиске книги:", error);
    // В крайнем случае создаем заглушку с уникальным ID
    const fallbackId = `book_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;
    return {
      id: fallbackId,
      googleBookId: bookId || fallbackId,
      title: "Книга не найдена",
      authors: ["Нет данных об авторах"],
      thumbnail: null,
      description: "Описание книги не найдено",
    };
  }
}

// Получение корзины
export async function GET() {
  try {
    // Получаем ID пользователя из сессии
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
        { error: "Отсутствует ID пользователя в сессии" },
        { status: 401 }
      );
    }

    // Преобразуем userId в совместимый с MongoDB ObjectID
    const userId = session.userId;
    const compatibleUserId = getCompatibleObjectId(userId);

    console.log(
      `Оригинальный userId: ${userId}, совместимый: ${compatibleUserId}`
    );

    // Получаем корзину пользователя
    const cart = await db.cart.findFirst({
      where: { userId: compatibleUserId },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!cart) {
      // Если корзины нет, создаем новую
      console.log(`Создаем новую корзину для пользователя ${compatibleUserId}`);

      const newCart = await db.cart.create({
        data: {
          userId: compatibleUserId,
        },
        include: {
          items: {
            include: {
              book: true,
            },
          },
        },
      });
      return NextResponse.json(newCart);
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      {
        error: `Ошибка при получении корзины: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}

// Добавление товара в корзину
export async function POST(request: Request) {
  try {
    const { bookId, quantity = 1 } = await request.json();
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
      `Добавление товара в корзину для пользователя: ${userId} -> ${compatibleUserId}`
    );

    // Используем транзакцию Prisma для атомарных операций
    try {
      return await db.$transaction(async (prisma) => {
        // Получаем или создаем корзину пользователя
        let cart = await prisma.cart.findFirst({
          where: { userId: compatibleUserId },
          include: {
            items: {
              include: {
                book: true,
              },
            },
          },
        });

        if (!cart) {
          console.log(
            `Создаем новую корзину для пользователя ${compatibleUserId}`
          );
          cart = await prisma.cart.create({
            data: {
              userId: compatibleUserId,
            },
            include: {
              items: {
                include: {
                  book: true,
                },
              },
            },
          });
        }

        // Проверяем, есть ли уже такая книга в корзине
        const existingItem = cart.items.find((item) => item.bookId === bookId);

        if (existingItem) {
          // Если книга уже есть в корзине, обновляем количество
          console.log(
            `Книга ${bookId} уже в корзине, обновляем количество: ${
              existingItem.quantity
            } -> ${existingItem.quantity + quantity}`
          );

          const updatedItem = await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
            include: {
              book: true,
            },
          });
          return NextResponse.json(updatedItem);
        }

        // Проверяем, существует ли книга в базе данных
        // Сначала пытаемся найти по googleBookId
        let book = await prisma.book.findFirst({
          where: {
            OR: [{ id: bookId }, { googleBookId: bookId }],
          },
        });

        // Если книги нет в базе, получаем данные и создаем запись
        if (!book) {
          console.log(`Книга ${bookId} не найдена в базе, получаем данные`);

          const bookData = await getBookById(bookId);

          // Нормализуем данные перед сохранением
          const normalizedAuthors = Array.isArray(bookData.authors)
            ? bookData.authors
            : [bookData.authors].filter(Boolean).length > 0
            ? [bookData.authors]
            : ["Неизвестный автор"];

          try {
            console.log(`Создаем запись книги: ${bookData.googleBookId}`);

            book = await prisma.book.create({
              data: {
                id: bookData.googleBookId, // Используем googleBookId в качестве id
                googleBookId: bookData.googleBookId,
                title: bookData.title || "Без названия",
                authors: normalizedAuthors,
                thumbnail: bookData.thumbnail,
                description: bookData.description || "",
              },
            });
          } catch (bookCreateError) {
            console.error("Ошибка при создании книги:", bookCreateError);

            // В случае конфликта PK, пробуем сгенерировать уникальный ID
            const uniqueId = `${bookData.googleBookId}_${Date.now()}`;
            console.log(`Пробуем создать с уникальным ID: ${uniqueId}`);

            book = await prisma.book.create({
              data: {
                id: uniqueId,
                googleBookId: bookData.googleBookId,
                title: bookData.title || "Без названия",
                authors: normalizedAuthors,
                thumbnail: bookData.thumbnail,
                description: bookData.description || "",
              },
            });
          }
        }

        // Создаем новый элемент корзины
        console.log(`Добавляем книгу ${book.id} в корзину ${cart.id}`);

        const newItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            bookId: book.id,
            quantity,
          },
          include: {
            book: true,
          },
        });

        return NextResponse.json(newItem);
      });
    } catch (txError) {
      console.error("Ошибка транзакции:", txError);
      throw txError; // Перебрасываем для обработки во внешнем блоке
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    // Более подробное сообщение об ошибке для отладки
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    return NextResponse.json(
      { error: `Ошибка при добавлении в корзину: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Удаление товара из корзины
export async function DELETE(
  request: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const cartItemId = params.cartItemId;
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

    if (!cartItemId) {
      return NextResponse.json(
        { error: "ID элемента корзины не указан" },
        { status: 400 }
      );
    }

    // Удаляем элемент из базы данных
    await db.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ success: true });
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
