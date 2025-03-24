import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Пути, которые не требуют авторизации
const publicPaths = ["/", "/auth", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, является ли путь публичным
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Получаем сессию из cookie
  const session = request.cookies.get("session");

  // Если путь требует авторизации и сессии нет
  if (!isPublicPath && !session) {
    // Сохраняем текущий URL для редиректа после авторизации
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  // Если пользователь авторизован и пытается зайти на страницу авторизации
  if (isPublicPath && pathname === "/auth" && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Указываем, для каких путей нужно применять middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
