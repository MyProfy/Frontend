"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, MapPin, DollarSign, FileText, Tag, Upload, Loader2, Image as ImageIcon, Link, Check, AlertCircle } from "lucide-react";
import TarrifModal from "../Modals/TarrifModal";
import { getAPIClient } from "@/components/types/apiClient";
import type { Vacancy, Category, SubCategory } from "@/components/types/apiTypes";

interface VacancyFormData {
  title: string;
  description: string;
  price: string;
  category: number | null;
  sub_category: number | null;
  client: number | null;
  images?: string;
}

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  category: number | null;
  sub_category: number | null;
}

const Services = () => {
  const router = useRouter();
  const apiClient = getAPIClient();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [showTarrifs, setShowTarrifs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [serviceSubCategories, setServiceSubCategories] = useState<SubCategory[]>([]);
  const [userVacancies, setUserVacancies] = useState<Vacancy[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageInputType, setImageInputType] = useState<"file" | "url">("file");
  const [apiStatus, setApiStatus] = useState<{ services: boolean; vacancies: boolean }>({ services: true, vacancies: true });

  const [formData, setFormData] = useState<VacancyFormData>({
    title: "",
    description: "",
    price: "",
    category: null,
    sub_category: null,
    client: null,
    images: undefined
  });

  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    price: "",
    category: null,
    sub_category: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serviceErrors, setServiceErrors] = useState<{ [key: string]: string }>({});

  const SUPPORTED_IMAGE_FORMATS = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'image/bmp'
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setInitialLoading(true);
    try {
      const user = await apiClient.getCurrentUser();
      setCurrentUser(user);

      const [categoriesData, vacanciesData] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getVacancies({ client: user.id })
      ]);

      setCategories(categoriesData);
      setUserVacancies(vacanciesData);

      // Проверяем доступность эндпоинтов
      await checkApiEndpoints();

    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const checkApiEndpoints = async () => {
    try {
      await apiClient.checkServicesEndpoint();
      setApiStatus(prev => ({ ...prev, services: true }));
      console.log("✅ Services endpoint is available");
    } catch (error: any) {
      console.error("❌ Services endpoint unavailable:", error.message);
      setApiStatus(prev => ({ ...prev, services: false }));
    }
  };

  useEffect(() => {
    if (formData.category) {
      loadSubCategories(formData.category);
    } else {
      setSubCategories([]);
      setFormData(prev => ({ ...prev, sub_category: null }));
    }
  }, [formData.category]);

  // Для сервисов
  useEffect(() => {
    if (serviceFormData.category) {
      loadServiceSubCategories(serviceFormData.category);
    } else {
      setServiceSubCategories([]);
      setServiceFormData(prev => ({ ...prev, sub_category: null }));
    }
  }, [serviceFormData.category]);

  const loadSubCategories = async (categoryId: number) => {
    try {
      const subCategoriesData = await apiClient.getSubcategories({ category: categoryId });
      setSubCategories(subCategoriesData);
    } catch (error) {
      console.error("Ошибка загрузки подкатегорий:", error);
      setSubCategories([]);
    }
  };

  const loadServiceSubCategories = async (categoryId: number) => {
    try {
      const subCategoriesData = await apiClient.getSubcategories({ category: categoryId });
      setServiceSubCategories(subCategoriesData);
    } catch (error) {
      console.error("Ошибка загрузки подкатегорий для сервиса:", error);
      setServiceSubCategories([]);
    }
  };

  const validateServiceData = (data: any): boolean => {
    if (!data.title || !data.description || !data.category || !data.executor) {
      console.error("❌ Missing required fields:", {
        title: !data.title,
        description: !data.description,
        category: !data.category,
        executor: !data.executor
      });
      return false;
    }

    if (typeof data.executor !== 'number' || data.executor <= 0) {
      console.error("❌ Invalid executor ID:", data.executor);
      return false;
    }

    if (typeof data.category !== 'number' || data.category <= 0) {
      console.error("❌ Invalid category ID:", data.category);
      return false;
    }

    return true;
  };

  const handleFindSpecialist = () => {
    setShowServiceModal(true);
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
      category: null,
      sub_category: null,
      client: null,
      images: undefined
    });
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
    setImageInputType("file");
    setErrors({});
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setServiceFormData({
      title: "",
      description: "",
      price: "",
      category: null,
      sub_category: null,
    });
    setServiceErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "category" || name === "sub_category"
        ? (value ? parseInt(value) : null)
        : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setServiceFormData(prev => ({
      ...prev,
      [name]: name === "category" || name === "sub_category"
        ? (value ? parseInt(value) : null)
        : value
    }));

    if (serviceErrors[name]) {
      setServiceErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubCategorySelect = (subCategoryId: number) => {
    setFormData(prev => ({
      ...prev,
      sub_category: prev.sub_category === subCategoryId ? null : subCategoryId
    }));
  };

  const handleServiceSubCategorySelect = (subCategoryId: number) => {
    setServiceFormData(prev => ({
      ...prev,
      sub_category: prev.sub_category === subCategoryId ? null : subCategoryId
    }));
  };

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: "Неподдерживаемый формат файла. Поддерживаются: JPEG, PNG, GIF, WebP, AVIF, SVG, BMP"
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      return {
        valid: false,
        error: `Размер файла не должен превышать ${sizeMB}MB`
      };
    }

    return { valid: true };
  };

  const validateImageUrl = (url: string): { valid: boolean; error?: string } => {
    if (!url.trim()) {
      return { valid: true };
    }

    try {
      new URL(url);
      return { valid: true };
    } catch {
      return {
        valid: false,
        error: "Неверный формат URL"
      };
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, images: validation.error || "Ошибка загрузки файла" }));
      e.target.value = '';
      return;
    }

    setImageFile(file);
    setImageUrl("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, images: "Ошибка чтения файла" }));
      setImageFile(null);
    };
    reader.readAsDataURL(file);

    setErrors(prev => ({ ...prev, images: "" }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);

    if (url.trim()) {
      const validation = validateImageUrl(url);
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, images: validation.error || "Неверный URL изображения" }));
      } else {
        setErrors(prev => ({ ...prev, images: "" }));
        setImagePreview(url);
      }
    } else {
      setErrors(prev => ({ ...prev, images: "" }));
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
    setErrors(prev => ({ ...prev, images: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название обязательно";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Укажите корректную цену";
    }

    if (!formData.category) {
      newErrors.category = "Выберите категорию";
    }

    if (!currentUser?.id) {
      newErrors.client = "Пользователь не авторизован";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateServiceForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!serviceFormData.title.trim()) {
      newErrors.title = "Название обязательно";
    }

    if (!serviceFormData.description.trim()) {
      newErrors.description = "Описание обязательно";
    }

    if (!serviceFormData.category) {
      newErrors.category = "Выберите категорию";
    }

    if (!currentUser?.id) {
      newErrors.executor = "Пользователь не авторизован";
    }

    setServiceErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const vacancyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        client: currentUser.id,
        ...(formData.sub_category && { sub_category: formData.sub_category }),
        ...(imageInputType === "file" && imageFile && { images: imageFile }),
        ...(imageInputType === "url" && imageUrl.trim() && { images: imageUrl })
      };

      console.log("📤 Отправка данных вакансии:", vacancyData);

      const response = await apiClient.createVacancy(vacancyData);

      console.log("✅ Вакансия успешно создана:", response);

      await loadInitialData();
      handleCloseModal();

      alert("Вакансия успешно создана!");

    } catch (error: any) {
      console.error("❌ Ошибка создания вакансии:", error);

      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors: { [key: string]: string } = {};

        Object.keys(apiErrors).forEach(key => {
          if (Array.isArray(apiErrors[key])) {
            newErrors[key] = apiErrors[key][0];
          } else if (typeof apiErrors[key] === 'string') {
            newErrors[key] = apiErrors[key];
          }
        });

        setErrors(newErrors);

        const errorMessage = Object.values(newErrors).join('\n');
        alert(`Ошибка создания вакансии:\n${errorMessage}`);
      } else {
        alert("Произошла ошибка при создании вакансии. Попробуйте снова.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSubmit = async () => {
    if (!validateServiceForm()) {
      return;
    }

    setServiceLoading(true);

    try {
      // Диагностика перед отправкой
      console.log("🔍 Running pre-submit diagnostics...");

      if (!apiStatus.services) {
        throw new Error("SERVICE_ENDPOINT_UNAVAILABLE");
      }

      const serviceData = {
        executor: currentUser.id,
        category: serviceFormData.category!,
        sub_categories: serviceFormData.sub_category ? [serviceFormData.sub_category] : [],
        title: serviceFormData.title,
        description: serviceFormData.description,
        price: serviceFormData.price ? parseFloat(serviceFormData.price) : 0,
        moderation: "Pending",
        boost: 1,
      };

      console.log("📤 Отправка данных сервиса:", serviceData);

      // Дополнительная валидация
      if (!validateServiceData(serviceData)) {
        alert("Некорректные данные. Пожалуйста, проверьте введенную информацию.");
        return;
      }

      const response = await apiClient.createService(serviceData);

      console.log("✅ Сервис успешно создан:", response);

      handleCloseServiceModal();
      alert("Услуга успешно создана!");

    } catch (error: any) {
      console.error("❌ Ошибка создания сервиса:", error);

      // Улучшенная обработка ошибки 500
      if (error.message === "SERVICE_ENDPOINT_UNAVAILABLE" || error.response?.status === 500) {
        const errorDetails = error.response?.status === 500 ? 
          "Ошибка сервера (500). Сервис временно недоступен." :
          "Сервис создания услуг временно недоступен.";

        console.error("🔧 Service creation failed:", errorDetails);
        
        // Предлагаем создать вакансию вместо услуги
        const useVacancy = confirm(
          `${errorDetails}\n\n` +
          "Хотите создать вакансию вместо услуги? Это временное решение.\n\n" +
          "Вакансия будет создана с теми же данными."
        );

        if (useVacancy) {
          // Автоматически переносим данные из сервиса в вакансию
          setFormData({
            title: serviceFormData.title,
            description: serviceFormData.description,
            price: serviceFormData.price || "0",
            category: serviceFormData.category,
            sub_category: serviceFormData.sub_category,
            client: currentUser.id,
            images: undefined
          });
          
          handleCloseServiceModal();
          setShowModal(true);
        }
        return;
      }

      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors: { [key: string]: string } = {};

        Object.keys(apiErrors).forEach(key => {
          if (Array.isArray(apiErrors[key])) {
            newErrors[key] = apiErrors[key][0];
          } else if (typeof apiErrors[key] === 'string') {
            newErrors[key] = apiErrors[key];
          }
        });

        setServiceErrors(newErrors);

        const errorMessage = Object.values(newErrors).join('\n');
        alert(`Ошибка создания услуги:\n${errorMessage}`);
      } else {
        alert("Произошла неизвестная ошибка при создании услуги. Попробуйте снова.");
      }
    } finally {
      setServiceLoading(false);
    }
  };

  const handleGoToCandidates = (id: number) => {
    router.push(`/vacancies/${id}`);
  };

  const quickTags = ["сантехник", "под ключ", "сантехработы", "электрик", "строитель"];

  const getCategoryName = (category: Category): string => {
    return category.display_ru || category.name || 'Без названия';
  };

  const getSubCategoryName = (subCategory: SubCategory): string => {
    return subCategory.display_ru || subCategory.name || 'Без названия';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {!apiStatus.services && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={24} />
              <div>
                <h3 className="text-yellow-800 font-medium">Сервисы временно недоступны</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Создание услуг временно недоступно из-за технических работ на сервере. 
                  Вы можете создавать вакансии как временное решение - данные автоматически перенесутся.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Мои вакансии ({userVacancies.length})
            </h1>

            <div className="flex gap-3">
              <button
                onClick={handleFindSpecialist}
                disabled={!apiStatus.services}
                className={`px-5 py-2 border rounded-lg transition-all text-sm font-medium ${!apiStatus.services
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Найти специалиста
                {!apiStatus.services && (
                  <span className="ml-2 text-xs text-yellow-600">(временно недоступно)</span>
                )}
              </button>
              <button
                onClick={handleFindClients}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
              >
                Создать вакансию
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {userVacancies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                У вас пока нет вакансий. Создайте свою первую вакансию!
              </div>
            ) : (
              userVacancies.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {item.description.substring(0, 100)}
                        {item.description.length > 100 ? '...' : ''}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium text-green-600">
                          {item.price.toLocaleString()} сум
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGoToCandidates(item.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Просмотр
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTarrifs(true)}
                        className="border border-gray-600 hover:bg-gray-600 hover:text-white text-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Выбрать тариф
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Модальное окно для создания СЕРВИСА (Найти специалиста) */}
        <AnimatePresence>
          {showServiceModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={handleCloseServiceModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Найти специалиста
                  </h2>
                  <button
                    onClick={handleCloseServiceModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={serviceLoading}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Баннер предупреждения */}
                  {!apiStatus.services && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-yellow-600" size={16} />
                        <span className="text-yellow-800 text-sm font-medium">
                          Сервисы временно недоступны
                        </span>
                      </div>
                      <p className="text-yellow-700 text-xs mt-1">
                        При отправке будет предложено создать вакансию вместо услуги
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название услуги *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={serviceFormData.title}
                      onChange={handleServiceInputChange}
                      placeholder="Например: Ремонт квартиры"
                      disabled={serviceLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${serviceErrors.title
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                    />
                    {serviceErrors.title && (
                      <p className="mt-1 text-sm text-red-600">{serviceErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание *
                    </label>
                    <textarea
                      name="description"
                      value={serviceFormData.description}
                      onChange={handleServiceInputChange}
                      rows={3}
                      placeholder="Опишите вашу услугу..."
                      disabled={serviceLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all resize-none ${serviceErrors.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                    />
                    {serviceErrors.description && (
                      <p className="mt-1 text-sm text-red-600">{serviceErrors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категория *
                    </label>
                    <select
                      name="category"
                      value={serviceFormData.category || ""}
                      onChange={handleServiceInputChange}
                      disabled={serviceLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${serviceErrors.category
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {getCategoryName(cat)}
                        </option>
                      ))}
                    </select>
                    {serviceErrors.category && (
                      <p className="mt-1 text-sm text-red-600">{serviceErrors.category}</p>
                    )}
                  </div>

                  {serviceSubCategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Подкатегория (необязательно)
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                        {serviceSubCategories.map((subCat) => (
                          <button
                            key={subCat.id}
                            type="button"
                            onClick={() => handleServiceSubCategorySelect(subCat.id)}
                            disabled={serviceLoading}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${serviceFormData.sub_category === subCat.id
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${serviceFormData.sub_category === subCat.id
                              ? 'bg-green-600 border-green-600'
                              : 'bg-white border-gray-300'
                              }`}>
                              {serviceFormData.sub_category === subCat.id && (
                                <Check size={14} className="text-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {getSubCategoryName(subCat)}
                            </span>
                          </button>
                        ))}
                      </div>
                      {serviceFormData.sub_category && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Выбрана: {getSubCategoryName(serviceSubCategories.find(sc => sc.id === serviceFormData.sub_category)!)}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Цена (необязательно)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={serviceFormData.price}
                      onChange={handleServiceInputChange}
                      placeholder="Например: 500000"
                      min="0"
                      disabled={serviceLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {serviceErrors.executor && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{serviceErrors.executor}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseServiceModal}
                      disabled={serviceLoading}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Отмена
                    </button>

                    <button
                      type="button"
                      onClick={handleServiceSubmit}
                      disabled={serviceLoading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {serviceLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Отправка...
                        </>
                      ) : (
                        "Отправить"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Модальное окно для создания ВАКАНСИИ */}
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
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Найти клиентов
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название вакансии *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Например: Требуется сантехник"
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${errors.title
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {quickTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, title: tag }))}
                          disabled={loading}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors disabled:opacity-50"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} />
                      Подробное описание *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Опишите требования к специалисту, объем работ, условия..."
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all resize-none ${errors.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Tag size={16} />
                      Категория *
                    </label>
                    <select
                      name="category"
                      value={formData.category || ""}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${errors.category
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {getCategoryName(cat)}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  {subCategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Подкатегория (необязательно) - выберите одну
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                        {subCategories.map((subCat) => (
                          <button
                            key={subCat.id}
                            type="button"
                            onClick={() => handleSubCategorySelect(subCat.id)}
                            disabled={loading}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${formData.sub_category === subCat.id
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.sub_category === subCat.id
                              ? 'bg-green-600 border-green-600'
                              : 'bg-white border-gray-300'
                              }`}>
                              {formData.sub_category === subCat.id && (
                                <Check size={14} className="text-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {getSubCategoryName(subCat)}
                            </span>
                          </button>
                        ))}
                      </div>
                      {formData.sub_category && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Выбрана подкатегория: {getSubCategoryName(subCategories.find(sc => sc.id === formData.sub_category)!)}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      Бюджет (сум) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Например: 500000"
                      min="0"
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${errors.price
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon size={16} />
                      Изображение (необязательно)
                    </label>

                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="imageType"
                          checked={imageInputType === "file"}
                          onChange={() => setImageInputType("file")}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm">Загрузить файл</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="imageType"
                          checked={imageInputType === "url"}
                          onChange={() => setImageInputType("url")}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm flex items-center gap-1">
                          <Link size={14} />
                          Ввести URL
                        </span>
                      </label>
                    </div>

                    {imageInputType === "file" ? (
                      <>
                        <p className="text-xs text-gray-500 mb-2">
                          Поддерживаются: JPEG, PNG, GIF, WebP, AVIF, SVG, BMP (до 10MB)
                        </p>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 cursor-pointer">
                            <div className={`border-2 border-dashed rounded-lg p-4 transition-all text-center ${errors.images
                              ? 'border-red-300 hover:border-red-400'
                              : 'border-gray-300 hover:border-green-500'
                              }`}>
                              <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                              <span className="text-sm text-gray-600 block">
                                {imageFile ? imageFile.name : 'Выберите файл'}
                              </span>
                              {imageFile && (
                                <span className="text-xs text-gray-500 mt-1 block">
                                  {formatFileSize(imageFile.size)}
                                </span>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*,.avif"
                              onChange={handleImageChange}
                              disabled={loading}
                              className="hidden"
                            />
                          </label>
                          {imagePreview && (
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={clearImage}
                                disabled={loading}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50 shadow-lg"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={handleImageUrlChange}
                          placeholder="https://example.com/image.jpg"
                          disabled={loading}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${errors.images
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                            }`}
                        />
                        {imagePreview && (
                          <div className="relative w-24 h-24">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={clearImage}
                              disabled={loading}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50 shadow-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {errors.images && (
                      <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                    )}
                  </div>

                  {errors.client && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{errors.client}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={loading}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Создание...
                        </>
                      ) : (
                        'Создать вакансию'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showTarrifs && <TarrifModal onClose={() => setShowTarrifs(false)} />}
    </div>
  );
};

export default Services;