"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface TarrifModalProps {
  onClose: () => void;
}

const TarrifModal: React.FC<TarrifModalProps> = ({ onClose }) => {
  const tariffs = [
    {
      title: "START",
      price: "19 900",
      duration: "3 дня",
      features: [
        "Выделение анкеты цветной рамкой",
        "Размещение в ТОП на 3 дня",
        "Возможность автоматического поднятия в динамичный ТОП в 10:00 в течение 3 дней",
      ],
    },
    {
      title: "BOOST",
      price: "69 900",
      duration: "5 дней",
      features: [
        "Выделение рамкой",
        "Размещение в ТОП на 10 дней",
        "Возможность автоматического поднятия в динамичный ТОП 5 дней подряд в 10:00",
        "XL-выделение — жирный текст и визуальный акцент на анкете",
      ],
    },
    {
      title: "TURBO",
      price: "99 900",
      duration: "5 дней",
      features: [
        "Выделение рамкой",
        "Размещение в ТОП на 10 дней",
        "Ежедневное автоматическое поднятие в динамичный ТОП (10:00)",
        "Значки «Готов приступить немедленно» и «Срочный заказ»",
        "XL-выделение — жирный текст и визуальный акцент на анкете",
        "Рассылка по всей базе заказчиков, которые искали похожие услуги",
        "Приоритетная поддержка",
        "Приоритет в поиске — ваша анкета отображается первой в поиске",
      ],
    },
    {
      title: "TURBO+",
      price: "499 000",
      duration: "Эксклюзив",
      features: [
        "Всё, что входит в тариф TURBO",
        "Только ваша вакансия или услуга отображается в выбранной категории — без конкурентов",
        "Максимальный охват, внимание и поток заявок",
      ],
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-3xl font-bold text-gray-900">
              Выберите тариф
            </h2>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tariffs.map((tariff, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {tariff.title}
                  </h3>
                  <div className="mb-4">
                    <p className="text-4xl font-bold text-green-600">
                      {tariff.price} <span className="text-lg">UZS</span>
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {tariff.duration}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 flex-grow">
                  <ul className="space-y-3">
                    {tariff.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <Check
                          className="text-green-600 flex-shrink-0 mt-0.5"
                          size={18}
                        />
                        <span className="text-sm text-gray-600 leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  <button className="w-full py-3 bg-green-100 hover:bg-green-600 text-gray-900 hover:text-white font-medium rounded-xl transition-all duration-300">
                    Оформить подписку
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TarrifModal;