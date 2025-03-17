import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkBooks() {
  try {
    const books = await prisma.book.findMany();
    console.log("Количество книг в базе данных:", books.length);
    console.log("Первые 5 книг:", books.slice(0, 5));
  } catch (error) {
    console.error("Ошибка при проверке книг:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBooks();
