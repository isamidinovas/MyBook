const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

// Функция для генерации случайной цены в диапазоне
function generateRandomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateBookPrices() {
  try {
    // Получаем все книги из базы данных
    const booksInDb = await db.book.findMany();

    console.log(`Найдено ${booksInDb.length} книг для обновления`);

    // Обновляем каждую книгу
    for (const book of booksInDb) {
      // Генерируем случайную цену от 100 до 5000 рублей
      const price = generateRandomPrice(100, 5000);

      // Обновляем книгу в базе данных
      await db.book.update({
        where: { id: book.id },
        data: { price },
      });

      console.log(`Обновлена цена для книги "${book.title}": ${price} ₽`);
    }

    console.log("Все цены успешно обновлены");
  } catch (error) {
    console.error("Ошибка при обновлении цен:", error);
  } finally {
    await db.$disconnect();
  }
}

// Запускаем скрипт
updateBookPrices();
