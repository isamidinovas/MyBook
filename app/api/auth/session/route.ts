import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Отсутствуют необходимые данные" },
        { status: 400 }
      );
    }

    // Создаем сессию
    const session = {
      userId,
      email,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    };

    // Сохраняем сессию в cookie
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expires,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Ошибка создания сессии" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Удаляем сессию
    cookies().delete("session");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Ошибка удаления сессии" },
      { status: 500 }
    );
  }
}
