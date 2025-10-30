"use client";

import Navbar from "@/components/Header/Navbar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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

export default function Create() {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const router = useRouter();

  // Set client-side flag and get auth data
  useEffect(() => {
    setIsClient(true);
    
    // Get user data from localStorage
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

  // Fetch categories & subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch("https://api.myprofy.uz/api/categories/"),
          fetch("https://api.myprofy.uz/api/subcategories/"),
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

  // Filter subcategories
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter((sub) => {
        const catId = typeof sub.category === "number" ? sub.category : sub.category?.id;
        return Number(catId) === Number(selectedCategory);
      });
      setFilteredSubcategories(filtered);
      setSelectedSubcategory("");
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("❌ Файл слишком большой. Максимальный размер: 10MB");
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

  const handleCreate = async () => {
    if (!title || !description || !selectedCategory) {
      alert("❌ Пожалуйста, заполните все обязательные поля!");
      return;
    }


    // Check if user is authenticated
    if (!currentUser || !authToken) {
      alert("❌ Вы должны быть авторизованы для создания вакансии!");
      router.push("/auth");
      return;
    }

    setLoading(true);
    try {
      // Create payload with current user ID
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        category: Number(selectedCategory),
        client: currentUser.id, // Use actual user ID instead of hardcoded value
      };

      // Add optional fields
      if (price) {
        const priceValue = Number(price);
        if (priceValue > 0) {
          payload.price = priceValue;
        }
      }
      
      if (selectedSubcategory) {
        payload.sub_category = Number(selectedSubcategory);
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      // Add authorization header if token exists
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const res = await fetch("https://api.myprofy.uz/api/vacancies/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        
        if (res.status === 401) {
          throw new Error("Ошибка авторизации. Пожалуйста, войдите снова.");
        } else if (res.status === 500) {
          throw new Error("Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.");
        } else {
          throw new Error(`Сервер вернул ошибку: ${res.status}. Попробуйте позже.`);
        }
      }

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data);
        
        if (data.detail) {
          throw new Error(data.detail);
        } else if (data.client) {
          throw new Error(`Ошибка клиента: ${Array.isArray(data.client) ? data.client[0] : data.client}`);
        } else if (data.category) {
          throw new Error(`Ошибка категории: ${Array.isArray(data.category) ? data.category[0] : data.category}`);
        } else {
          throw new Error(data.message || "Ошибка при создании вакансии");
        }
      }

      alert("✅ Вакансия успешно создана!");
      router.push("/");
    } catch (error: any) {
      console.error("Error details:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const getProgress = () => {
    return (step / 4) * 100;
  };

  // Prevent rendering until client-side to avoid hydration mismatch
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


      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-3">
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              Шаг {step} из 4
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
          {/* STEP 1 - Title & Description */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: step > 1 ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: step > 1 ? "100%" : "-100%", opacity: 0 }}
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
                    Опишите вашу задачу
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Укажите название и детальное описание работы
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Название задачи <span className="text-red-500">*</span>
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
                      placeholder="Опишите подробно что нужно сделать..."
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
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Отменить
                </button>
                <button
                  disabled={!title || !description || description.length < 20}
                  onClick={nextStep}
                  className="px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Продолжить →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 - Category Selection */}
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
                    Это поможет специалистам найти вашу задачу
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
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
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
                              className={`font-medium text-sm ${
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
                        Подкатегория (необязательно)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                        {filteredSubcategories.map((sub) => (
                          <motion.button
                            key={sub.id}
                            type="button"
                            onClick={() => setSelectedSubcategory(String(sub.id))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                              selectedSubcategory === String(sub.id)
                                ? "border-green-500 bg-green-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                  selectedSubcategory === String(sub.id)
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedSubcategory === String(sub.id) && (
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
                                  selectedSubcategory === String(sub.id)
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
                    </motion.div>
                  )}
                </div>
              </div>


              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Назад
                </button>
                <button
                  disabled={!selectedCategory}
                  onClick={nextStep}
                  className="px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Продолжить →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 - Image Upload */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: step > 3 ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: step > 3 ? "100%" : "-100%", opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Добавьте фото
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Загрузите изображение для вашей вакансии (необязательно)
                  </p>
                </div>


                <div className="max-w-md mx-auto">
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
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    💡 Фото помогает привлечь больше откликов от специалистов
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Назад
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                >
                  Продолжить →
                </button>
              </div>
            </motion.div>
          )}


          {/* STEP 4 - Price & Summary */}
          {step === 4 && (
            <motion.div
              key="step4"
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
                    Укажите бюджет
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Примерная стоимость работы (необязательно)
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Бюджет в сумах
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Например: 500000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      className="w-full px-4 py-4 pr-20 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-800 text-lg placeholder:text-gray-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      сум
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    💡 Вы можете оставить это поле пустым, если не уверены в цене
                  </p>
                </div>

                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">📋 Итоговые данные:</h3>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li><span className="font-medium">Название:</span> {title}</li>
                    <li><span className="font-medium">Категория:</span> {categories.find(c => c.id === Number(selectedCategory))?.display_ru || "Не указана"}</li>
                    {selectedSubcategory && (
                      <li><span className="font-medium">Подкатегория:</span> {filteredSubcategories.find(s => s.id === Number(selectedSubcategory))?.display_ru || "Не указана"}</li>
                    )}
                    {image && <li><span className="font-medium">Фото:</span> ✓ Загружено</li>}
                    {price && <li><span className="font-medium">Бюджет:</span> {Number(price).toLocaleString()} сум</li>}
                  </ul>
                </div>

                {!currentUser && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Вы не авторизованы. Для создания вакансии необходимо войти в систему.
                    </p>
                  </div>
                )}
              </div>


              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Назад
                </button>
                <button
                  disabled={loading || !currentUser}
                  onClick={handleCreate}
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
                      <span>✓ Создать вакансию</span>
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