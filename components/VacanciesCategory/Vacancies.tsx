"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Search, MapPin, Clock, User } from "lucide-react";

const vacancies = [
  {
    id: 1,
    title: "Сантехника",
    price: "10 000 руб",
    specialist: "Олег Фёдоров",
    avatar: "🧑‍🔧",
    hours: "11 - 20",
    location: "Мирзо Улуғбек туман, Аранчи куча",
  },
  {
    id: 2,
    title: "Сантехника",
    price: "10 000 руб",
    specialist: "Олег Фёдоров",
    avatar: "🧑‍🔧",
    hours: "11 - 20",
    location: "Мирзо Улуғбек туман, Аранчи куча",
  },
  {
    id: 3,
    title: "Сантехника",
    price: "10 000 руб",
    specialist: "Олег Фёдоров",
    avatar: "🧑‍🔧",
    hours: "11 - 20",
    location: "Мирзо Улуғбек туман, Аранчи куча",
  },
  {
    id: 4,
    title: "Сантехника",
    price: "10 000 руб",
    specialist: "Олег Фёдоров",
    avatar: "🧑‍🔧",
    hours: "11 - 20",
    location: "Мирзо Улуғбек туман, Аранчи куча",
  },
  {
    id: 5,
    title: "Сантехника",
    price: "10 000 руб",
    specialist: "Олег Фёдоров",
    avatar: "🧑‍🔧",
    hours: "11 - 20",
    location: "Мирзо Улуғбек туман, Аранчи куча",
  },
];

const categories = [
  "Все категории",
  "Математика",
  "Сантехника",
  "Няня",
  "Уборка",
  "Мастер",
  "Английский",
  "Эвакуатор",
];

const priceRanges = [
  "Стоимость",
  "10 000 - 30 000",
  "30 000 - 60 000",
  "60 000 - 80 000",
];

const experienceYears = [
  "Стаж лет",
  "1 - 2 года",
  "3 - 4 года",
  "5 - 6+ лет",
];

const workingHours = [
  "Часы работы",
  "0 - 10 часов",
  "11 - 20 часов",
  "21 - 40 часов",
];

export default function Vacancies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все категории");
  const [selectedPrice, setSelectedPrice] = useState("Стоимость");
  const [selectedExperience, setSelectedExperience] = useState("Стаж лет");
  const [selectedHours, setSelectedHours] = useState("Часы работы");
  const [activeFilters, setActiveFilters] = useState({
    specialist: false,
    order: false,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors mb-6">
            <MapPin size={16} />
            Выберите свой регион
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Зарабатывайте на том, что умеете
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 shadow-sm sticky top-8">
              <div className="mb-6">
                <button className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    Все категории
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                <div className="space-y-1">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {category === "Сантехника" && "○ "}
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <button className="flex items-center gap-2 w-full text-left font-semibold text-gray-900 mb-3">
                  <span className="text-lg">💰</span>
                  Стоимость
                </button>
                <div className="space-y-1">
                  {priceRanges.slice(1).map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedPrice(range)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedPrice === range
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <button className="flex items-center gap-2 w-full text-left font-semibold text-gray-900 mb-3">
                  <span className="text-lg">📅</span>
                  Стаж лет
                </button>
                <div className="space-y-1">
                  {experienceYears.slice(1).map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setSelectedExperience(exp)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedExperience === exp
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button className="flex items-center gap-2 w-full text-left font-semibold text-gray-900 mb-3">
                  <span className="text-lg">⏰</span>
                  Часы работы
                </button>
                <div className="space-y-1">
                  {workingHours.slice(1).map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setSelectedHours(hours)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedHours === hours
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {hours}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              {vacancies.map((vacancy, index) => (
                <motion.div
                  key={vacancy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative ${
                    index === 0 ? "ring-2 ring-blue-400" : ""
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <span>🔥</span>
                      840 Fill × 34
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {vacancy.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {vacancy.title}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <span>{vacancy.specialist}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-400" />
                            <span>Часы работы: {vacancy.hours}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{vacancy.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-gray-900">
                          {vacancy.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            specialist: !prev.specialist,
                          }))
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeFilters.specialist
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span>🔥</span>
                        Найти специалистов
                      </button>
                      <button
                        onClick={() =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            order: !prev.order,
                          }))
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeFilters.order
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span>⚡</span>
                        Найти заказы
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}