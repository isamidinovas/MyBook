import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Тип для элемента корзины
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

// Тип для корзины
interface Cart {
  items: CartItem[];
}

// Получение данных о книге по ID
async function getBookById(bookId: string) {
  try {
    console.log(`Получаем информацию о книге: ${bookId}`);

    // Проверяем формат ID книги
    const isGoogleBooksId =
      bookId.startsWith("googlebooks/") || bookId.includes("_");

    // Если ID не в формате Google Books, мы должны использовать другой маршрут или преобразовать ID
    let googleBooksId = bookId;
    if (isGoogleBooksId && bookId.startsWith("googlebooks/")) {
      googleBooksId = bookId.replace("googlebooks/", "");
    }

    // Улучшенный запрос к Google Books API с дополнительными параметрами
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${googleBooksId}?fields=id,volumeInfo(title,authors,description,imageLinks)`,
      {
        cache: "force-cache",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Ошибка получения данных о книге ${googleBooksId}: ${response.status}`
      );
      // Для отладки выводим полное содержимое ответа
      const errorText = await response.text();
      console.error("Подробности ошибки:", errorText);

      // Вместо использования заглушки, попробуем найти книгу по поиску
      console.log(`Пробуем найти книгу по поиску для ID: ${bookId}`);
      return await findBookBySearch(bookId);
    }

    const data = await response.json();
    console.log(`Получены данные о книге:`, data);

    // Проверяем наличие данных и формируем безопасный объект книги
    if (!data || !data.volumeInfo) {
      console.error("Некорректный формат данных книги");
      return await findBookBySearch(bookId);
    }

    // Преобразуем данные в нужный формат с проверками
    const volumeInfo = data.volumeInfo;
    const bookData = {
      id: data.id || bookId,
      title: volumeInfo.title || "Название недоступно",
      authors: Array.isArray(volumeInfo.authors)
        ? volumeInfo.authors
        : ["Автор не указан"],
      thumbnail: volumeInfo.imageLinks?.thumbnail || null,
      description: volumeInfo.description || "",
    };

    console.log(`Успешно получены данные о книге:`, bookData);
    return bookData;
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

    // Используем эвристику для поиска - пробуем найти книгу по идентификатору как части названия или ISBN
    const searchQuery = bookId.includes("_")
      ? bookId.replace("_", " ").slice(0, 20)
      : bookId;

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        searchQuery
      )}&maxResults=1`,
      { cache: "force-cache" }
    );

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
    const volumeInfo = book.volumeInfo;

    console.log(`Книга найдена через поиск:`, book);

    return {
      id: book.id || bookId,
      title: volumeInfo.title || "Название недоступно",
      authors: Array.isArray(volumeInfo.authors)
        ? volumeInfo.authors
        : ["Автор не указан"],
      thumbnail: volumeInfo.imageLinks?.thumbnail || null,
      description: volumeInfo.description || "",
    };
  } catch (error) {
    console.error("Ошибка при поиске книги:", error);
    // В крайнем случае возвращаем заглушку
    return {
      id: bookId,
      title: "Книга не найдена",
      authors: ["Нет данных об авторах"],
      thumbnail: "https://via.placeholder.com/128x192.png?text=Book+Not+Found",
      description: "Описание книги не найдено",
    };
  }
}

// Получение корзины
export async function GET() {
  try {
    const cookieStore = cookies();
    const cartCookie = cookieStore.get("cart");

    if (!cartCookie || !cartCookie.value) {
      // Если корзина не существует, возвращаем пустую корзину
      return NextResponse.json({ items: [] });
    }

    // Возвращаем данные корзины
    return NextResponse.json(JSON.parse(cartCookie.value));
  } catch (error) {
    console.error("Ошибка при получении корзины:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при получении корзины" },
      { status: 500 }
    );
  }
}

// Добавление товара в корзину
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const body = await request.json();
    const { bookId, quantity = 1 } = body;

    console.log(`Запрос на добавление книги в корзину:`, body);

    // Проверка входных данных
    if (!bookId) {
      console.error("ID книги не указан");
      return NextResponse.json(
        { error: "Необходимо указать ID книги" },
        { status: 400 }
      );
    }

    // Получаем информацию о книге
    const book = await getBookById(bookId);
    console.log(`Информация о книге получена:`, book);

    // Получаем текущую корзину из cookie или создаем новую
    const cartCookie = cookieStore.get("cart");
    let cart: Cart = { items: [] };

    if (cartCookie && cartCookie.value) {
      try {
        cart = JSON.parse(cartCookie.value) as Cart;
        console.log("Текущая корзина:", cart);
      } catch (error) {
        console.error("Ошибка при парсинге корзины:", error);
        cart = { items: [] };
      }

      if (!cart.items || !Array.isArray(cart.items)) {
        console.warn("Корзина имеет неверный формат, создаем новую");
        cart = { items: [] };
      }
    }

    // Проверяем, есть ли уже такая книга в корзине
    const existingItemIndex = cart.items.findIndex(
      (item) => item.book.id === bookId
    );

    if (existingItemIndex !== -1) {
      // Если книга уже в корзине, увеличиваем количество
      console.log(`Книга уже в корзине, обновляем количество`);
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Добавляем новый товар в корзину
      console.log(`Добавляем новый товар в корзину`);
      const cartItem: CartItem = {
        id: uuidv4(), // Генерируем уникальный ID для элемента корзины
        quantity,
        book,
      };
      cart.items.push(cartItem);
      console.log(`Товар добавлен:`, cartItem);
    }

    // Проверяем корректность данных корзины
    const validItems = cart.items.filter(
      (item) => item && item.book && item.book.id && item.book.title
    );

    if (validItems.length !== cart.items.length) {
      console.warn("Обнаружены некорректные элементы в корзине, фильтруем");
      cart.items = validItems;
    }

    console.log(`Сохраняем корзину:`, cart);

    // Сохраняем обновленную корзину в cookie
    cookieStore.set("cart", JSON.stringify(cart), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    });

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Ошибка при добавлении товара в корзину:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при добавлении товара в корзину" },
      { status: 500 }
    );
  }
}

// Обработчик DELETE запросов - удаление товара из корзины
export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    let cartItemId;

    try {
      const body = await request.json();
      cartItemId = body.cartItemId;
    } catch (parseError) {
      console.error("Ошибка при парсинге тела запроса:", parseError);
      return NextResponse.json(
        { error: "Неверный формат запроса" },
        { status: 400 }
      );
    }

    // Проверка входных данных
    if (!cartItemId) {
      return NextResponse.json(
        { error: "Необходимо указать идентификатор товара" },
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

    // Парсим данные корзины
    let cart: Cart;
    try {
      cart = JSON.parse(cartCookie.value) as Cart;
    } catch (parseError) {
      console.error("Ошибка при парсинге корзины:", parseError);
      return NextResponse.json(
        { error: "Неверный формат данных корзины" },
        { status: 400 }
      );
    }

    if (!cart.items || !Array.isArray(cart.items)) {
      return NextResponse.json({ error: "Корзина пуста" }, { status: 404 });
    }

    // Находим товар перед удалением
    const itemExists = cart.items.some((item) => item.id === cartItemId);
    if (!itemExists) {
      return NextResponse.json(
        { error: "Товар не найден в корзине" },
        { status: 404 }
      );
    }

    // Фильтруем товары, удаляя указанный
    cart.items = cart.items.filter((item) => item.id !== cartItemId);

    // Сохраняем обновленную корзину в cookie
    cookieStore.set("cart", JSON.stringify(cart), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    });

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Ошибка при удалении товара из корзины:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при удалении товара из корзины" },
      { status: 500 }
    );
  }
}
