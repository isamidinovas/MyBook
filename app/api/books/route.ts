import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    console.log("API запрос - URL:", request.url);
    console.log("API запрос - Параметры:", {
      category: category || "не указана",
      search: search || "не указан",
    });

    const whereClause: any = {};

    if (category?.trim()) {
      whereClause.categories = {
        has: category.trim(),
      };
    }

    if (search?.trim()) {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { authors: { has: search.trim() } },
      ];
    }

    console.log(
      "API запрос - Условия поиска:",
      JSON.stringify(whereClause, null, 2)
    );

    const books = await prisma.book.findMany({
      where: whereClause,
      take: 40,
      select: {
        id: true,
        googleBookId: true,
        title: true,
        authors: true,
        description: true,
        thumbnail: true,
        publishedDate: true,
        categories: true,
        pageCount: true,
        publisher: true,
        language: true,
      },
    });

    console.log("API ответ - Найдено книг:", books.length);
    if (books.length > 0) {
      console.log(
        "API ответ - Пример первой книги:",
        JSON.stringify(books[0], null, 2)
      );
    } else {
      console.log("API ответ - Книги не найдены");
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error("API ошибка:", error);
    return NextResponse.json(
      { error: "Ошибка при получении книг" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
