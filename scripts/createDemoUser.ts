import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    console.log("Создание демо-пользователя...");

    // Проверяем, существует ли уже пользователь
    const existingUser = await prisma.user.findUnique({
      where: { id: "user123" },
    });

    if (existingUser) {
      console.log("Демо-пользователь уже существует.");
      return;
    }

    // Создаем демо-пользователя
    const user = await prisma.user.create({
      data: {
        id: "user123",
        email: "demo@example.com",
        password: "password123",
        name: "Demo User",
        role: "USER",
      },
    });

    console.log("Демо-пользователь создан:", user);

    // Создаем корзину для пользователя
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    console.log("Корзина создана для пользователя:", cart);
  } catch (error) {
    console.error("Ошибка при создании демо-пользователя:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser();
