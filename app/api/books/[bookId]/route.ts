import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const book = await db.book.findUnique({
      where: {
        id: params.bookId,
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Книга не найдена" }, { status: 404 });
    }

    return NextResponse.json({
      volumeInfo: {
        title: book.title,
        authors: book.authors,
        publishedDate: book.publishedDate,
        description: book.description,
        imageLinks: {
          thumbnail: book.thumbnail,
        },
        language: book.language,
        publisher: book.publisher,
        categories: book.categories,
        pageCount: book.pageCount,
        price: book.price,
      },
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при загрузке данных о книге" },
      { status: 500 }
    );
  }
}
