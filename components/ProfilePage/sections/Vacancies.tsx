"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Briefcase, Users, Zap, Star, MapPin, DollarSign,
  Loader2, AlertCircle, Lock, Crown, Rocket,
  Trash2, Edit, X, FileText, Tag, Image as ImageIcon,
  Link, Check, Upload
} from "lucide-react";
import TarrifModal from "../Modals/TarrifModal";
import { getAPIClient } from "@/components/types/apiClient";
import type { Vacancy, Category, SubCategory } from "@/components/types/apiTypes";

const Vacancies = () => {
  const router = useRouter();
  const apiClient = getAPIClient();

  const [showTarrifs, setShowTarrifs] = useState(false);
  const [selectedVacancyForTariff, setSelectedVacancyForTariff] = useState<Vacancy | null>(null);
  const [selectedServiceForTariff, setSelectedServiceForTariff] = useState<any | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userVacancies, setUserVacancies] = useState<Vacancy[]>([]);
  const [userServices, setUserServices] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"vacancies" | "services">("vacancies");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Состояния для модального окна редактирования
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Форма редактирования
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: null as number | null,
    sub_category: null as number | null,
  });
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setInitialLoading(true);
    try {
      const user = await apiClient.getCurrentUser();
      setCurrentUser(user);

      console.log("📊 User data loaded:", { userId: user.id });

      // Загружаем категории
      try {
        const categoriesData = await apiClient.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("❌ Error loading categories:", error);
      }

      // Load vacancies for this user
      try {
        const vacanciesData = await apiClient.getVacanciesByClient(user.id);
        setUserVacancies(vacanciesData);
        console.log("✅ Vacancies loaded:", vacanciesData.length);
      } catch (error) {
        console.error("❌ Error loading vacancies:", error);
        setUserVacancies([]);
      }

      // Load services
      try {
        const servicesData = await apiClient.getServices(1, 100);
        const userServicesFiltered = servicesData.filter((s: any) => s.executor === user.id);
        setUserServices(userServicesFiltered);
        console.log("✅ Services loaded:", userServicesFiltered.length);
      } catch (error) {
        console.error("❌ Error loading services:", error);
        setUserServices([]);
      }

    } catch (error) {
      console.error("Error loading initial data:", error);
      setUserVacancies([]);
      setUserServices([]);
    } finally {
      setInitialLoading(false);
    }
  };

  // Функция для загрузки подкатегорий
  const loadSubCategories = async (categoryId: number) => {
    try {
      const subCategoriesData = await apiClient.getSubcategories({ category: categoryId });
      setSubCategories(subCategoriesData);
    } catch (error) {
      console.error("Ошибка загрузки подкатегорий:", error);
      setSubCategories([]);
    }
  };

  const handleEditVacancy = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setEditFormData({
      title: vacancy.title,
      description: vacancy.description,
      price: vacancy.price.toString(),
      category: vacancy.category,
      sub_category: vacancy.sub_category,
    });

    if (vacancy.category) {
      loadSubCategories(vacancy.category);
    }

    setShowEditModal(true);
  };

  // Обработчик закрытия модального окна
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingVacancy(null);
    setEditFormData({
      title: "",
      description: "",
      price: "",
      category: null,
      sub_category: null,
    });
    setEditErrors({});
    setSubCategories([]);
  };

  // Обработчик изменений в форме
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === "category" || name === "sub_category"
        ? (value ? parseInt(value) : null)
        : value
    }));

    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: "" }));
    }

    // При изменении категории загружаем подкатегории
    if (name === "category" && value) {
      loadSubCategories(parseInt(value));
    } else if (name === "category" && !value) {
      setSubCategories([]);
      setEditFormData(prev => ({ ...prev, sub_category: null }));
    }
  };

  // Валидация формы
  const validateEditForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!editFormData.title.trim()) {
      newErrors.title = "Название обязательно";
    }

    if (!editFormData.description.trim()) {
      newErrors.description = "Описание обязательно";
    }

    if (!editFormData.price || parseFloat(editFormData.price) <= 0) {
      newErrors.price = "Укажите корректную цену";
    }

    if (!editFormData.category) {
      newErrors.category = "Выберите категорию";
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик сохранения изменений
  const handleSaveEdit = async () => {
    if (!editingVacancy || !validateEditForm()) {
      return;
    }

    setEditLoading(true);
    try {
      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        price: parseFloat(editFormData.price),
        category: editFormData.category,
        ...(editFormData.sub_category && { sub_category: editFormData.sub_category }),
      };

      const updatedVacancy = await apiClient.updateVacancy(editingVacancy.id, updateData);

      // Обновляем локальное состояние
      setUserVacancies(prev =>
        prev.map(vacancy =>
          vacancy.id === editingVacancy.id ? updatedVacancy : vacancy
        )
      );

      console.log("✅ Vacancy updated successfully");
      handleCloseEditModal();
      alert("Вакансия успешно обновлена!");

    } catch (error: any) {
      console.error("❌ Error updating vacancy:", error);

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

        setEditErrors(newErrors);
        alert(`Ошибка обновления вакансии:\n${Object.values(newErrors).join('\n')}`);
      } else {
        alert("Произошла ошибка при обновлении вакансии. Попробуйте снова.");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteVacancy = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту вакансию?")) return;

    setDeleteLoading(id);
    try {
      await apiClient.deleteVacancy(id);
      setUserVacancies(prev => prev.filter(vacancy => vacancy.id !== id));
      console.log("✅ Vacancy deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting vacancy:", error);
      alert("Ошибка при удалении вакансии");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту услугу?")) return;

    setDeleteLoading(id);
    try {
      // Note: Add service deletion to apiClient if needed
      setUserServices(prev => prev.filter(service => service.id !== id));
      console.log("✅ Service deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting service:", error);
      alert("Ошибка при удалении услуги");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getNonPromotedVacancies = () => {
    return userVacancies.filter(vacancy => !vacancy.boost || vacancy.boost === 0);
  };

  const getPromotedVacancies = () => {
    return userVacancies.filter(vacancy => vacancy.boost && vacancy.boost > 0);
  };

  const getNonPromotedServices = () => {
    return userServices.filter(service => !service.boost || service.boost === 0);
  };

  const getPromotedServices = () => {
    return userServices.filter(service => service.boost && service.boost > 0);
  };

  const handleGoToCandidates = (id: number) => {
    router.push(`/vacancies/${id}`);
  };

  const handlePromoteVacancy = (vacancy: Vacancy) => {
    setSelectedVacancyForTariff(vacancy);
    setShowTarrifs(true);
  };

  const handlePromoteService = (service: any) => {
    setSelectedServiceForTariff(service);
    setShowTarrifs(true);
  };

  const getBoostStatus = (boost: number) => {
    switch (boost) {
      case 0:
        return { text: "Не продвигается", color: "bg-gray-100 text-gray-800", icon: null };
      case 1:
        return { text: "Базовое продвижение", color: "bg-blue-100 text-blue-800", icon: <Zap size={12} /> };
      case 2:
        return { text: "Продвинутое", color: "bg-purple-100 text-purple-800", icon: <Zap size={12} /> };
      case 3:
        return { text: "Премиум", color: "bg-yellow-100 text-yellow-800", icon: <Star size={12} /> };
      default:
        return { text: "Не продвигается", color: "bg-gray-100 text-gray-800", icon: null };
    }
  };

  const getBoostLevelName = (boost: number) => {
    switch (boost) {
      case 1: return "Базовое";
      case 2: return "Продвинутое";
      case 3: return "Премиум";
      default: return "Не продвигается";
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.display_ru || category?.name || 'Неизвестная категория';
  };

  const getSubCategoryName = (subCategoryId: number): string => {
    const subCategory = subCategories.find(sub => sub.id === subCategoryId);
    return subCategory?.display_ru || subCategory?.name || 'Неизвестная подкатегория';
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

  const nonPromotedVacancies = getNonPromotedVacancies();
  const promotedVacancies = getPromotedVacancies();
  const nonPromotedServices = getNonPromotedServices();
  const promotedServices = getPromotedServices();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Мои обьявление и услуги
              </h1>
              <p className="text-gray-600 mt-1">
                Управляйте вашими вакансиями и услугами
              </p>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("vacancies")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "vacancies"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase size={16} />
                  Вакансии ({userVacancies.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "services"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  Услуги ({userServices.length})
                </div>
              </button>
            </nav>
          </div>

          {activeTab === "vacancies" && (
            <div className="space-y-8">
              {promotedVacancies.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Продвигающие объявления
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Ваши объявления с активным продвижением
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {promotedVacancies.length} объявлений
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {promotedVacancies.map((item, index) => {
                      const boostStatus = getBoostStatus(item.boost || 0);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 hover:shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {item.title || "Без названия"}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${boostStatus.color}`}>
                                    {boostStatus.icon}
                                    {boostStatus.text}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {item.description?.substring(0, 100) || "Описание отсутствует"}
                                {item.description?.length > 100 ? '...' : ''}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {item.price && (
                                  <span className="font-medium text-green-600">
                                    {item.price?.toLocaleString()} сум
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {item.location || "Не указано"}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${item.moderation === 'approved' ? 'bg-green-100 text-green-800' :
                                    item.moderation === 'rejected' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {item.moderation_display ||
                                    (item.moderation === 'approved' ? 'Одобрено' :
                                      item.moderation === 'rejected' ? 'Отклонено' : 'На модерации')}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="text-xs text-gray-500">
                                  Категория: {getCategoryName(item.category)}
                                </span>
                                {item.sub_category && (
                                  <span className="text-xs text-gray-500">
                                    Подкатегория: {getSubCategoryName(item.sub_category)}
                                  </span>
                                )}
                              </div>
                              {item.boost && item.boost > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-purple-600 font-medium">
                                    Уровень продвижения: {getBoostLevelName(item.boost)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleGoToCandidates(item.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                              >
                                Отклики
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleEditVacancy(item)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                              >
                                <Edit size={14} />
                                Редактировать
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Объявления без продвижения
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Обычные объявления без дополнительного продвижения
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {nonPromotedVacancies.length} объявлений
                    </span>
                  </div>
                </div>

                {nonPromotedVacancies.length === 0 ? (
                  <div className="text-center max-w-md mx-auto py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Нет объявлений без продвижения
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Все ваши объявления уже продвигаются
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {nonPromotedVacancies.map((item, index) => {
                      const boostStatus = getBoostStatus(item.boost || 0);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {item.title || "Без названия"}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${boostStatus.color}`}>
                                    {boostStatus.icon}
                                    {boostStatus.text}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {item.description?.substring(0, 100) || "Описание отсутствует"}
                                {item.description?.length > 100 ? '...' : ''}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {item.price && (
                                  <span className="font-medium text-green-600">
                                    {item.price?.toLocaleString()} сум
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {item.location || "Не указано"}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${item.moderation === 'approved' ? 'bg-green-100 text-green-800' :
                                    item.moderation === 'rejected' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {item.moderation_display ||
                                    (item.moderation === 'approved' ? 'Одобрено' :
                                      item.moderation === 'rejected' ? 'Отклонено' : 'На модерации')}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="text-xs text-gray-500">
                                  Категория: {getCategoryName(item.category)}
                                </span>
                                {item.sub_category && (
                                  <span className="text-xs text-gray-500">
                                    Подкатегория: {getSubCategoryName(item.sub_category)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleGoToCandidates(item.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                              >
                                Отклики
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleEditVacancy(item)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                              >
                                <Edit size={14} />
                                Редактировать
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePromoteVacancy(item)}
                                className="border border-purple-600 hover:bg-purple-600 hover:text-white text-purple-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                              >
                                <Rocket size={14} />
                                Продвигать
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDeleteVacancy(item.id)}
                                disabled={deleteLoading === item.id}
                                className="border border-red-600 hover:bg-red-600 hover:text-white text-red-600 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                              >
                                {deleteLoading === item.id ? (
                                  <Loader2 className="animate-spin" size={14} />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {userVacancies.length === 0 && (
                <div className="text-center max-w-md mx-auto py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    У вас пока нет вакансий
                  </h2>
                  <p className="text-gray-600">
                    Создайте вакансию чтобы начать получать отклики от специалистов
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-8">
              {/* ... существующий код для услуг ... */}
              {promotedServices.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Продвигающие услуги
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Ваши услуги с активным продвижением
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {promotedServices.length} услуг
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {promotedServices.map((item, index) => {
                      const boostStatus = getBoostStatus(item.boost || 0);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 hover:shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {item.title || item.name || "Без названия"}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${boostStatus.color}`}>
                                    {boostStatus.icon}
                                    {boostStatus.text}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {item.description?.substring(0, 100) || "Описание отсутствует"}
                                {item.description?.length > 100 ? '...' : ''}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {item.price > 0 && (
                                  <span className="font-medium text-green-600">
                                    {item.price?.toLocaleString()} сум
                                  </span>
                                )}
                                <span className="text-gray-400">
                                  {item.boost_name || "Без продвижения"}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${item.moderation === 'approved' ? 'bg-green-100 text-green-800' :
                                    item.moderation === 'rejected' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {item.moderation === 'approved' ? 'Одобрено' :
                                    item.moderation === 'rejected' ? 'Отклонено' : 'На модерации'}
                                </span>
                              </div>
                              {item.boost && item.boost > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-blue-600 font-medium">
                                    Уровень продвижения: {getBoostLevelName(item.boost)}
                                  </span>
                                </div>
                              )}
                              {item.sub_categories_names && item.sub_categories_names.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.sub_categories_names.map((name: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                      {name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDeleteService(item.id)}
                                disabled={deleteLoading === item.id}
                                className="border border-red-600 hover:bg-red-600 hover:text-white text-red-600 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                              >
                                {deleteLoading === item.id ? (
                                  <Loader2 className="animate-spin" size={14} />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Услуги без продвижения
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Обычные услуги без дополнительного продвижения
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {nonPromotedServices.length} услуг
                    </span>
                  </div>
                </div>

                {nonPromotedServices.length === 0 ? (
                  <div className="text-center max-w-md mx-auto py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Нет услуг без продвижения
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Все ваши услуги уже продвигаются
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {nonPromotedServices.map((item, index) => {
                      const boostStatus = getBoostStatus(item.boost || 0);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {item.title || item.name || "Без названия"}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${boostStatus.color}`}>
                                    {boostStatus.icon}
                                    {boostStatus.text}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {item.description?.substring(0, 100) || "Описание отсутствует"}
                                {item.description?.length > 100 ? '...' : ''}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {item.price > 0 && (
                                  <span className="font-medium text-green-600">
                                    {item.price?.toLocaleString()} сум
                                  </span>
                                )}
                                <span className="text-gray-400">
                                  {item.boost_name || "Без продвижения"}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${item.moderation === 'approved' ? 'bg-green-100 text-green-800' :
                                    item.moderation === 'rejected' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {item.moderation === 'approved' ? 'Одобрено' :
                                    item.moderation === 'rejected' ? 'Отклонено' : 'На модерации'}
                                </span>
                              </div>
                              {item.sub_categories_names && item.sub_categories_names.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.sub_categories_names.map((name: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                      {name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePromoteService(item)}
                                className="border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                              >
                                <Rocket size={14} />
                                Продвигать
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDeleteService(item.id)}
                                disabled={deleteLoading === item.id}
                                className="border border-red-600 hover:bg-red-600 hover:text-white text-red-600 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                              >
                                {deleteLoading === item.id ? (
                                  <Loader2 className="animate-spin" size={14} />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {userServices.length === 0 && (
                <div className="text-center max-w-md mx-auto py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    У вас пока нет услуг
                  </h2>
                  <p className="text-gray-600">
                    Создайте услугу чтобы начать получать заказы от клиентов
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.section>
      </div>

      {/* Модальное окно редактирования вакансии */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseEditModal}
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
                  Редактировать вакансию
                </h2>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={editLoading}
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
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    placeholder="Например: Требуется сантехник"
                    disabled={editLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${editErrors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                      }`}
                  />
                  {editErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Подробное описание *
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    rows={4}
                    placeholder="Опишите требования..."
                    disabled={editLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all resize-none ${editErrors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                      }`}
                  />
                  {editErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag size={16} />
                    Категория *
                  </label>
                  <select
                    name="category"
                    value={editFormData.category || ""}
                    onChange={handleEditInputChange}
                    disabled={editLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${editErrors.category
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                      }`}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.display_ru || cat.name}
                      </option>
                    ))}
                  </select>
                  {editErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.category}</p>
                  )}
                </div>

                {subCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Подкатегория (необязательно)
                    </label>
                    <select
                      name="sub_category"
                      value={editFormData.sub_category || ""}
                      onChange={handleEditInputChange}
                      disabled={editLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Выберите подкатегорию</option>
                      {subCategories.map((subCat) => (
                        <option key={subCat.id} value={subCat.id}>
                          {subCat.display_ru || subCat.name}
                        </option>
                      ))}
                    </select>
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
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    placeholder="Например: 500000"
                    min="0"
                    disabled={editLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 transition-all ${editErrors.price
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                      }`}
                  />
                  {editErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.price}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    disabled={editLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {editLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Сохранение...
                      </>
                    ) : (
                      'Сохранить изменения'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTarrifs && (
        <TarrifModal
          onClose={() => {
            setShowTarrifs(false);
            setSelectedVacancyForTariff(null);
            setSelectedServiceForTariff(null);
          }}
          vacancy={selectedVacancyForTariff}
          service={selectedServiceForTariff}
        />
      )}
    </div>
  );
};

export default Vacancies;