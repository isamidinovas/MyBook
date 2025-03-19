// Получение корзины пользователя
export const getCart = async () => {
  try {
    const response = await fetch("/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении корзины: ${response.status}`);
    }

    const data = await response.json();
    console.log("Получены данные корзины:", data);
    return data;
  } catch (error) {
    console.error("Ошибка при запросе корзины:", error);
    // Возвращаем пустую корзину в случае ошибки
    return { items: [] };
  }
};

// Добавление товара в корзину
export const addToCart = async (bookId: string, quantity: number = 1) => {
  try {
    // Проверяем, есть ли уже книга в корзине
    const cart = await getCart();
    const existingItem = cart.items?.find(
      (item: any) => item.book && item.book.id === bookId
    );

    if (existingItem) {
      console.log(`Книга ${bookId} уже есть в корзине`);
      // Книга уже в корзине, не добавляем дубликат
      return { success: true, message: "Книга уже в корзине" };
    }

    console.log(
      `Добавление книги ${bookId} в корзину, количество: ${quantity}`
    );

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, quantity }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Ошибка при добавлении в корзину: ${response.status}, ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Ответ сервера при добавлении в корзину:", data);

    // Оповещаем о изменении корзины
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    return data;
  } catch (error) {
    console.error("Ошибка при добавлении в корзину:", error);
    throw error;
  }
};

// Удаление товара из корзины
export const removeFromCart = async (cartItemId: string) => {
  try {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItemId }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при удалении из корзины");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при удалении из корзины:", error);
    throw error;
  }
};

// Функция для обновления количества товара в корзине
export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
) => {
  try {
    const response = await fetch("/api/cart/update-quantity", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItemId, quantity }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при обновлении количества");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении количества:", error);
    throw error;
  }
};
