"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, MapPin, DollarSign, FileText, Tag } from "lucide-react";

const Services = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    tags: "",
    proposalType: "limited"
  });

  const announcements = [
    {
      id: 1,
      title: "Сантехника",
      date: "создан 12.12.2024",
      time: "в 20:23",
      candidates: "более 2022 кондидатов"
    },
    {
      id: 2,
      title: "Грузчики",
      date: "создан 10.11.2024",
      time: "в 19:10",
      candidates: "12 кандидатов"
    },
  ];

  const handleFindSpecialist = () => {
    router.push('/vacancies');
  };

  const handleFindClients = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      category: "",
      tags: "",
      proposalType: "limited"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log("Данные формы:", formData);
    
    handleCloseModal();
    
    const searchParams = new URLSearchParams();
    if (formData.category) searchParams.set('category', formData.category);
    if (formData.title) searchParams.set('q', formData.title);
    searchParams.set('mode', 'services');
    
    router.push(`/vacancies?${searchParams.toString()}`);
  };

  const handleGoToCandidates = (id) => {
    router.push(`/vacancies/${id}`);
  };

  const quickTags = ["сантехник", "под ключ", "сантехработы", "сантехнические"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Мои объявления
            </h1>
            
            <div className="flex gap-3">
              <button
                onClick={handleFindSpecialist}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Найти специалиста
              </button>
              <button
                onClick={handleFindClients}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
              >
                Найти клиентов
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {announcements.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.date} {item.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700 mb-2 text-sm">{item.candidates}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGoToCandidates(item.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                    >
                      Перейти к кандидатам
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Создать объявление
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Как назвать задачу?
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Например: Сантехника"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {quickTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, title: tag }))}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} />
                      Подробное описание
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Опишите детали работы..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                    />
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2 text-sm">
                      Как вам удобнее получить предложения от профи?
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="proposalType"
                          value="limited"
                          checked={formData.proposalType === "limited"}
                          onChange={handleInputChange}
                          className="mt-0.5"
                        />
                        <div className="text-sm text-gray-900">
                          Хочу получать до 6 предложений специалистов с ценой
                        </div>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="proposalType"
                          value="full"
                          checked={formData.proposalType === "full"}
                          onChange={handleInputChange}
                          className="mt-0.5"
                        />
                        <div className="text-sm text-gray-900">
                          Хочу увидеть полный список специалистов
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={16} />
                      Где выполнить работу?
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Улица и номер дома"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      Выше какой цены не готовы рассматривать предложения?
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="до 0 сум"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Tag size={16} />
                      Категория
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="">Выберите категорию</option>
                      <option value="1">Ремонт и строительство</option>
                      <option value="2">IT и программирование</option>
                      <option value="3">Дизайн</option>
                      <option value="4">Обучение</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm"
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all text-sm"
                    >
                      Опубликовать
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Services;