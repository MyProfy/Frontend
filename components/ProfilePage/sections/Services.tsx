"use client";

import Navbar from "@/components/Header/Navbar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Category {
  id: number;
  display_ru?: string;
  name?: string;
}

interface Subcategory {
  id: number;
  category: number | { id: number };
  display_ru?: string;
  name?: string;
}

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export default function CreateService() {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/`),
        ]);
        
        if (!catRes.ok || !subRes.ok) {
          throw new Error("Failed to fetch categories");
        }
        
        const catData = await catRes.json();
        const subData = await subRes.json();

        setCategories(Array.isArray(catData) ? catData : catData.results || []);
        setSubcategories(Array.isArray(subData) ? subData : subData.results || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter((sub) => {
        const catId = typeof sub.category === "number" ? sub.category : sub.category?.id;
        return Number(catId) === Number(selectedCategory);
      });
      setFilteredSubcategories(filtered);
      setSelectedSubcategories([]);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Файл слишком большой. Максимальный размер: 10MB");
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSubcategory = (subcategoryId: number) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
      }
    });
  };

  const handleCreateService = async () => {
    if (!title || !description || !selectedCategory) {
      toast.error("Пожалуйста, заполните все обязательные поля!");
      return;
    }

    if (!currentUser || !authToken) {
      toast.error("Вы должны быть авторизованы для создания услуги!");
      router.push("/auth");
      return;
    }

    setLoading(true);
    try {
      // Build payload matching the working Services.jsx pattern
      const payload: any = {
        executor: currentUser.id,
        category: Number(selectedCategory),
        title: title.trim(),
        description: description.trim(),
        price: price ? parseFloat(price) : 0,
        moderation: "pending",  // Required field - lowercase to match backend
        boost: 0,  // Required field - default value
      };

      // Only add sub_categories if there are any selected
      if (selectedSubcategories.length > 0) {
        payload.sub_categories = selectedSubcategories;
      }

      console.log("📤 Отправка данных сервиса:", payload);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      console.log("📊 Response status:", res.status);

      // Try to parse response as JSON
      let responseData;
      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        const text = await res.text();
        console.error("❌ Non-JSON response:", text);
        console.error("Status:", res.status);
        
        throw new Error(`Сервер вернул некорректный ответ (статус ${res.status}). Пожалуйста, попробуйте позже.`);
      }

      if (!res.ok) {
        console.error("❌ API Error:", responseData);
        
        // Build detailed error message from validation errors
        const newErrors: { [key: string]: string } = {};
        
        Object.keys(responseData).forEach(key => {
          if (Array.isArray(responseData[key])) {
            newErrors[key] = responseData[key][0];
          } else if (typeof responseData[key] === 'string') {
            newErrors[key] = responseData[key];
          }
        });
        
        const errorMessage = Object.entries(newErrors)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        
        throw new Error(errorMessage || "Ошибка при создании услуги. Проверьте корректность данных.");
      }

      console.log("✅ Услуга успешно создана:", responseData);
      
      toast.success("Услуга успешно создана и отправлена на модерацию!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setSelectedCategory("");
      setSelectedSubcategories([]);
      setImage(null);
      setImagePreview("");
      setStep(1);
      
      // Redirect to home or services page
      setTimeout(() => {
        router.push("/");
      }, 1500);
      
    } catch (error: any) {
      console.error("❌ Error details:", error);
      toast.error(error.message || "Произошла ошибка при создании услуги");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const getProgress = () => {
    return (step / 3) * 100;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-3">
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              Шаг {step} из 3
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-green-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Опишите вашу услугу
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Укажите название и детальное описание услуги
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Название услуги <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Например: Ремонт сантехники"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Описание <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Опишите подробно вашу услугу..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none text-gray-800 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Минимум 20 символов
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition-colors"
                >
                  ← Отменить
                </button>
                <button
                  disabled={!title || !description || description.length < 20}
                  onClick={nextStep}
                  className="px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 cursor-pointer transition-all shadow-lg shadow-green-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Продолжить →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: step > 2 ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: step > 2 ? "100%" : "-100%", opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Выберите категорию
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Это поможет клиентам найти вашу услугу
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Категория услуги <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(String(cat.id))}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                            selectedCategory === String(cat.id)
                              ? "border-green-500 bg-green-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                selectedCategory === String(cat.id)
                                  ? "border-green-500 bg-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedCategory === String(cat.id) && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </motion.svg>
                              )}
                            </div>
                            <span
                              className={`font-medium cursor-pointer text-sm ${
                                selectedCategory === String(cat.id)
                                  ? "text-green-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {cat.display_ru || cat.name || `Категория ${cat.id}`}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {filteredSubcategories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Подкатегории (можно выбрать несколько)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                        {filteredSubcategories.map((sub) => (
                          <motion.button
                            key={sub.id}
                            type="button"
                            onClick={() => toggleSubcategory(sub.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-4 rounded-xl cursor-pointer border-2 transition-all text-left ${
                              selectedSubcategories.includes(sub.id)
                                ? "border-green-500 bg-green-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  selectedSubcategories.includes(sub.id)
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedSubcategories.includes(sub.id) && (
                                  <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </motion.svg>
                                )}
                              </div>
                              <span
                                className={`font-medium text-sm ${
                                  selectedSubcategories.includes(sub.id)
                                    ? "text-green-700"
                                    : "text-gray-700"
                                }`}
                              >
                                {sub.display_ru || sub.name || `Подкатегория ${sub.id}`}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Выбрано: {selectedSubcategories.length} подкатегорий
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium cursor-pointer transition-colors"
                >
                  ← Назад
                </button>
                <button
                  disabled={!selectedCategory}
                  onClick={nextStep}
                  className="px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 cursor-pointer transition-all shadow-lg shadow-green-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Продолжить →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Укажите цену и фото
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Стоимость вашей услуги и дополнительное изображение
                  </p>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Цена в сумах (необязательно)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Например: 500000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        max="99999999"
                        className="w-full px-4 py-4 pr-20 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-800 text-lg placeholder:text-gray-400"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        сум
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      💡 Если не указано, будет установлена цена 0
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Фото услуги (необязательно)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {imagePreview ? (
                          <div className="space-y-4">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="mx-auto h-48 w-full object-cover rounded-lg"
                            />
                            <p className="text-sm text-gray-600">
                              Нажмите чтобы изменить фото
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Нажмите для загрузки фото
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, JPEG до 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Фото помогает привлечь больше клиентов
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">📋 Итоговые данные:</h3>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li><span className="font-medium">Название:</span> {title}</li>
                    <li><span className="font-medium">Категория:</span> {categories.find(c => c.id === Number(selectedCategory))?.display_ru || "Не указана"}</li>
                    {selectedSubcategories.length > 0 && (
                      <li>
                        <span className="font-medium">Подкатегории:</span>{" "}
                        {selectedSubcategories.map(id => 
                          filteredSubcategories.find(s => s.id === id)?.display_ru
                        ).filter(Boolean).join(", ")}
                      </li>
                    )}
                    {image && <li><span className="font-medium">Фото:</span> ✓ Загружено</li>}
                    <li><span className="font-medium">Цена:</span> {price ? Number(price).toLocaleString() + ' сум' : 'Не указана (0 сум)'}</li>
                  </ul>
                </div>

                {!currentUser && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Вы не авторизованы. Для создания услуги необходимо войти в систему.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 cursor-pointer hover:text-gray-800 font-medium transition-colors"
                >
                  ← Назад
                </button>
                <button
                  disabled={loading || !currentUser}
                  onClick={handleCreateService}
                  className="px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Создание...
                    </>
                  ) : (
                    <>
                      <span>✓ Создать услугу</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}