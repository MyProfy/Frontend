"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X, MapPin, DollarSign, FileText, Tag, Upload, Loader2, Image as ImageIcon } from "lucide-react";
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

const Services = () => {
  const t = useTranslations('vacancies');
  const commonT = useTranslations('common'); 
  const errorsT = useTranslations('errors');
  const router = useRouter();
  const apiClient = getAPIClient();
  
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showTarrifs, setShowTarrifs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [userVacancies, setUserVacancies] = useState<Vacancy[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<VacancyFormData>({
    title: "",
    description: "",
    price: "",
    category: null,
    sub_category: null,
    client: null,
    images: undefined
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  
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
      console.log("Current user:", user);

      const [categoriesData, vacanciesData] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getVacancies({ client: user.id }) 
      ]);
      
      const extractedCategories = Array.isArray(categoriesData) 
        ? categoriesData 
        : categoriesData?.results || [];
      
      const extractedVacancies = Array.isArray(vacanciesData)
        ? vacanciesData
        : vacanciesData?.results || [];
      
      setCategories(extractedCategories);
      setUserVacancies(extractedVacancies);
      
      console.log("Loaded categories:", extractedCategories.length);
      console.log("Loaded vacancies:", extractedVacancies.length);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setInitialLoading(false);
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

  const loadSubCategories = async (categoryId: number) => {
    // try {
    //   const subCategoriesData = await apiClient.getSubcategories({ category: categoryId });
    //   const extractedSubCategories = Array.isArray(subCategoriesData)
    //     ? subCategoriesData
    //     : subCategoriesData?.results || [];
    //   setSubCategories(extractedSubCategories);
    //   console.log("Loaded subcategories:", extractedSubCategories.length);
    // } catch (error) {
    //   console.error("Ошибка загрузки подкатегорий:", error);
    //   setSubCategories([]); 
    // }
  };

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
      category: null,
      sub_category: null,
      client: null,
      images: undefined
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
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

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Проверка типа файла
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: `${commonT('errors.unsupportedFormat') || 'Неподдерживаемый формат файла. Поддерживаются: JPEG, PNG, GIF, WebP, AVIF, SVG, BMP'}`
      };
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      return {
        valid: false,
        error: `${commonT('errors.fileSizeExceeded', { size: sizeMB }) || `Размер файла не должен превышать ${sizeMB}MB`}`
      };
    }

    return { valid: true };
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
    });

    // Валидация файла
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, images: validation.error || "Ошибка загрузки файла" }));
      e.target.value = ''; // Сброс input
      return;
    }

    setImageFile(file);
    
    // Создание preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      console.log("Image preview created successfully");
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, images: "Ошибка чтения файла" }));
      setImageFile(null);
    };
    reader.readAsDataURL(file);
    
    setErrors(prev => ({ ...prev, images: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('errors.required_fields.name') || "Название обязательно";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('errors.required_fields.description') || "Описание обязательно";
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = t('errors.invalidPrice') || "Укажите корректную цену";
    }
    
    if (!formData.category) {
      newErrors.category = t('errors.required_fields.category') || "Выберите категорию";
    }
    
    if (!currentUser?.id) {
      newErrors.client = t('errors.notAuthenticated') || "Пользователь не авторизован";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const vacancyData: any = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        client: currentUser.id
      };

      if (formData.sub_category) {
        vacancyData.sub_category = formData.sub_category;
      }

      if (imageFile) {
        console.log("Converting image to base64...");
        const base64 = await convertToBase64(imageFile);
        vacancyData.images = base64;
        console.log("Image converted, size:", base64.length, "chars");
      }

      console.log("Отправка данных вакансии:", {
        ...vacancyData,
        images: vacancyData.images ? `[Base64 string, ${vacancyData.images.length} chars]` : null
      });

      const response = await apiClient.createVacancy(vacancyData);
      
      console.log("✅ Вакансия успешно создана:", response);
      
      await loadInitialData();
      handleCloseModal();
      
      alert(t('success') || "Вакансия успешно создана!");
      
    } catch (error: any) {
      console.error("❌ Ошибка создания вакансии:", error);
      
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors: {[key: string]: string} = {};
        
        Object.keys(apiErrors).forEach(key => {
          if (Array.isArray(apiErrors[key])) {
            newErrors[key] = apiErrors[key][0];
          } else if (typeof apiErrors[key] === 'string') {
            newErrors[key] = apiErrors[key];
          }
        });
        
        setErrors(newErrors);
        
        const errorMessage = Object.values(newErrors).join('\n');
        alert(`${t('errors.creating_vacancy') || 'Ошибка создания вакансии'}:\n${errorMessage}`);
      } else {
        alert(t('errors.unknown') || "Произошла ошибка при создании вакансии. Попробуйте снова.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToCandidates = (id: number) => {
    router.push(`/vacancies/${id}`);
  };

  const quickTags = ["сантехник", "под ключ", "сантехработы", "электрик", "строитель"]; // These can be translated if needed, but kept as is for specificity

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
          <p className="text-gray-600">{t('loading') || 'Загрузка данных...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t('title') || 'Мои вакансии'} ({userVacancies.length})
            </h1>

            <div className="flex gap-3">
              <button
                onClick={handleFindSpecialist}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
              >
                {t('findSpecialist') || 'Найти специалиста'}
              </button>
              <button
                onClick={handleFindClients}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
              >
                {t('createVacancy') || 'Создать вакансию'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {userVacancies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('empty') || 'У вас пока нет вакансий. Создайте свою первую вакансию!'}
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
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          item.moderation === 'approved' 
                            ? 'bg-green-100 text-green-700'
                            : item.moderation === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {item.moderation_display || item.moderation}
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
                        {t('view') || 'Просмотр'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTarrifs(true)}
                        className="border border-gray-600 hover:bg-gray-600 hover:text-white text-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {t('selectBoost') || 'Выбрать тариф'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
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
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('modalTitle') || 'Создать вакансию'}
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
                  {/* Название */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tooltips.name') || 'Название вакансии *'}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder={t('namePlaceholder') || 'Например: Требуется сантехник'}
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${
                        errors.title 
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

                  {/* Описание */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} />
                      {t('tooltips.description') || 'Подробное описание *'}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder={t('descriptionPlaceholder') || 'Опишите требования к специалисту, объем работ, условия...'}
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all resize-none ${
                        errors.description 
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
                      {t('tooltips.category') || 'Категория *'}
                    </label>
                    <select
                      name="category"
                      value={formData.category || ""}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${
                        errors.category 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                      }`}
                    >
                      <option value="">{t('categorySelect.0') || 'Выберите категорию'}</option>
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
                        {t('subCategories') || 'Подкатегория (необязательно)'}
                      </label>
                      <select
                        name="sub_category"
                        value={formData.sub_category || ""}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                      >
                        <option value="">{t('categorySelect.0') || 'Выберите подкатегорию'}</option>
                        {subCategories.map((subCat) => (
                          <option key={subCat.id} value={subCat.id}>
                            {getSubCategoryName(subCat)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Цена */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      {t('tooltips.price') || 'Бюджет (сум) *'}
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Например: 500000"
                      min="0"
                      disabled={loading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${
                        errors.price 
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
                      {t('tooltips.image') || 'Изображение (необязательно)'}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      {t('imageSupported') || 'Поддерживаются: JPEG, PNG, GIF, WebP, AVIF, SVG, BMP (до 10MB)'}
                    </p>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className={`border-2 border-dashed rounded-lg p-4 transition-all text-center ${
                          errors.images 
                            ? 'border-red-300 hover:border-red-400' 
                            : 'border-gray-300 hover:border-green-500'
                        }`}>
                          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                          <span className="text-sm text-gray-600 block">
                            {imageFile ? imageFile.name : t('selectFile') || 'Выберите файл'}
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
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                              setErrors(prev => ({ ...prev, images: "" }));
                            }}
                            disabled={loading}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50 shadow-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
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
                      {t('cancel') || 'Отмена'}
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
                          {t('saving') || 'Создание...'}
                        </>
                      ) : (
                        t('save') || 'Создать вакансию'
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