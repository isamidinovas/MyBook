"use client";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Получаем URL для редиректа после авторизации
  const redirectTo = searchParams.get("redirect") || "/";

  // Валидация email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Валидация пароля
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!validateEmail(email)) {
      toast.error("Пожалуйста, введите корректный email");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        // Вход
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Успешный вход!");
      } else {
        // Регистрация
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Аккаунт успешно создан!");
      }

      // Создаем сессию
      const user = auth.currentUser;
      if (user) {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            email: user.email,
          }),
        });

        if (!response.ok) {
          throw new Error("Ошибка создания сессии");
        }
      }

      // Перенаправляем на сохраненный URL или главную страницу
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = "Произошла ошибка";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Этот email уже используется";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Некорректный email";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Слишком слабый пароль";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "Пользователь не найден";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Неверный пароль";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Вход" : "Регистрация"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading
              ? "Загрузка..."
              : isLogin
              ? "Войти"
              : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-700"
            disabled={isLoading}
          >
            {isLogin
              ? "Нет аккаунта? Зарегистрируйтесь"
              : "Уже есть аккаунт? Войдите"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
