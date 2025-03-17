"use client";
import Header from "@/components/Header/Header";

import HeroImg from "../../assets/Image Hero.svg";
import BlogList from "@/components/BlogList/BlogList";
import { Input } from "@/components/UI/input";
import { useState } from "react";

export const page = () => {
  const [search, setSearch] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            О нас
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Ваш надежный книжный магазин в Бишкеке
          </p>
        </div>

        {/* История компании */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                История My Book
              </h2>
              <div className="prose prose-indigo text-gray-700">
                <p>
                  Основанный в 2012 году, My Book начал свой путь как небольшой
                  книжный магазин с коллекцией всего в 200 книг. Сегодня мы
                  являемся одним из крупнейших книжных магазинов в Бишкеке с
                  ассортиментом более 50,000 наименований книг разных жанров и
                  направлений.
                </p>
                <p className="mt-4">
                  Наша миссия — делать чтение доступным каждому жителю
                  Кыргызстана, вдохновлять на саморазвитие и расширять кругозор.
                  Мы стремимся создать пространство, где книги становятся
                  проводниками в мир знаний и отдыха.
                </p>
                <p className="mt-4">
                  За годы работы мы завоевали доверие тысяч клиентов благодаря
                  качественному обслуживанию, широкому ассортименту и
                  индивидуальному подходу к каждому покупателю.
                </p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto overflow-hidden rounded-lg">
              <img
                src="https://prorus.ru/files/661/bc6f96d354/01%D0%BA%D0%BD%D0%B8%D0%B6%D0%BD%D1%8B%D0%B9.jpeg"
                alt="Книжный магазин My Book"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Наши ценности */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Наши ценности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Доступность знаний
              </h3>
              <p className="text-gray-600">
                Мы верим, что книги должны быть доступны каждому. Поэтому мы
                предлагаем широкий ценовой диапазон, регулярные акции и
                специальные предложения.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Сообщество читателей
              </h3>
              <p className="text-gray-600">
                Мы создаем пространство, где читатели могут делиться
                впечатлениями, обсуждать прочитанное и находить единомышленников
                через клубы книголюбов и мероприятия.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Инновации
              </h3>
              <p className="text-gray-600">
                Мы постоянно развиваемся, внедряя цифровые технологии и новые
                форматы для улучшения качества обслуживания и расширения
                возможностей для наших клиентов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
