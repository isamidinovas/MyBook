// Получение корзины пользователя
export const getCart = async () => {
  try {
    console.log("Запрашиваем данные корзины...");

    const response = await fetch("/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Ошибка при получении корзины: ${response.status}`,
        errorText
      );
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
    if (!bookId) {
      throw new Error("ID книги не указан");
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

    // Проверяем успешность ответа
    if (!response.ok) {
      let errorMessage = `Ошибка при добавлении в корзину: ${response.status}`;

      try {
        // Пытаемся получить текст или JSON с ошибкой
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += `, ${errorText}`;
          }
        }
      } catch (parseError) {
        console.error("Ошибка при чтении ответа:", parseError);
      }

      throw new Error(errorMessage);
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

// Удаление товара из корзины
export const removeFromCart = async (cartItemId: string) => {
  try {
    if (!cartItemId) {
      throw new Error("ID элемента корзины не указан");
    }

    console.log(`Удаление элемента корзины ${cartItemId}`);

    // Отправляем ID в теле запроса
    const response = await fetch(`/api/cart/remove-item`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItemId }),
    });

    if (!response.ok) {
      let errorMessage = `Ошибка при удалении из корзины: ${response.status}`;

      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += `, ${errorText}`;
          }
        }
      } catch (parseError) {
        console.error("Ошибка при чтении ответа:", parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Результат удаления из корзины:", result);

    // Оповещаем о изменении корзины
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    return result;
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
    if (!cartItemId) {
      throw new Error("ID элемента корзины не указан");
    }

    if (quantity < 1) {
      throw new Error("Количество должно быть больше 0");
    }

    console.log(`Обновление количества элемента ${cartItemId} на ${quantity}`);

    const response = await fetch("/api/cart/update-quantity", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItemId, quantity }),
    });

    if (!response.ok) {
      let errorMessage = `Ошибка при обновлении количества: ${response.status}`;

      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += `, ${errorText}`;
          }
        }
      } catch (parseError) {
        console.error("Ошибка при чтении ответа:", parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Результат обновления количества:", result);

    // Оповещаем о изменении корзины
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    return result;
  } catch (error) {
    console.error("Ошибка при обновлении количества:", error);
    throw error;
  }
};
