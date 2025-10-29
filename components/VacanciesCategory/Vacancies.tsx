"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Folder, DollarSign, Award, Clock, MapPin, Star, ChevronDown, MessageCircle, User as UserIcon, Info } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAPIClient } from "@/components/types/apiClient";
import { Category, SubCategory, Vacancy, Service, User } from "@/components/types/apiTypes";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";

type ViewMode = 'vacancies' | 'services';
type ListingItem = Vacancy | Service;

const PRICE_RANGES = [
  { label: "10 000 - 30 000", min: 10000, max: 30000 },
  { label: "30 000 - 60 000", min: 30000, max: 60000 },
  { label: "60 000 - 80 000", min: 60000, max: 80000 },
] as const;

const EXPERIENCE_YEARS = [
  { label: "1 - 2 года", min: 1, max: 2 },
  { label: "3 - 4 года", min: 3, max: 4 },
  { label: "5 - 6+ лет", min: 5, max: 10 }
] as const;

const WORKING_HOURS = [
  { label: "0 - 10 часов", min: 0, max: 10 },
  { label: "11 - 20 часов", min: 11, max: 20 },
  { label: "21 - 40 часов", min: 21, max: 40 }
] as const;

const extractResults = (data: any) => {
  if (Array.isArray(data)) return data;
  if (data && 'results' in data) return data.results || [];
  return [];
};

const getDisplayName = (item: Category | SubCategory) => {
  return item.display_ru || item.name;
};

const getInitials = (name: string) => {
  if (!name) return '??';
  const names = name.split(' ');
  if (names.length === 1) return name.substring(0, 2).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const getRatingAndReviews = (item: ListingItem, user: User | null) => {
  const userId = 'client' in item ? item.client : item.executor;

  if (user && user.id === userId) {
    if ('client' in item) {
      return {
        rating: user.client_rating?.toFixed(2) || "0.00",
        reviewCount: user.orders_count || 0,
        isTrusted: user.is_trusted || false
      };
    } else {
      return {
        rating: user.executor_rating?.toFixed(2) || "0.00",
        reviewCount: user.orders_count || 0,
        isTrusted: user.is_trusted || false
      };
    }
  }

  return {
    rating: "0.00",
    reviewCount: 0,
    isTrusted: false
  };
};

const ListingCard = memo(({
  item,
  index,
  viewMode,
  userData,
}: {
  item: ListingItem;
  index: number;
  viewMode: ViewMode;
  userData: User | null;
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const isVacancy = viewMode === 'vacancies';

  const title = 'title' in item ? item.title : item.name;
  const description = item.description;

  const userId = 'client' in item ? item.client : item.executor;
  const isCorrectUser = userData && userData.id === userId;

  const { rating, reviewCount, isTrusted } = getRatingAndReviews(item, isCorrectUser ? userData : null);
  const userName = isCorrectUser ? (userData?.name || 'Неизвестный пользователь') : 'Неизвестный пользователь';
  const userRegion = isCorrectUser ? (userData?.region || 'Местоположение не указано') : 'Местоположение не указано';
  const userAbout = isCorrectUser ? (userData?.about_user || null) : null;
  const userExperience = isCorrectUser ? (userData?.work_experience || null) : null;

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVacancy) {
      router.push(`/vacancies/${item.id}`);
    } else {
      router.push(`/services/${item.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg p-5 hover:shadow-md transition-all cursor-pointer border border-gray-200"
    >
      <div onClick={handleCardClick} className="cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">{rating}</span>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">{reviewCount} отзывов</span>
              {isTrusted && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  Проверенный
                </span>
              )}
            </div>
          </div>

          <span className="text-lg font-semibold text-gray-900 whitespace-nowrap ml-4">
            {item.price?.toLocaleString('ru-RU') || 0} сум
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {getInitials(userName)}
            </div>
            <span className="font-medium text-gray-700">{userName}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{userRegion}</span>
          </div>

          {userExperience && userExperience > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1.5">
                <Award size={14} />
                <span>Опыт: {userExperience} лет</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleActionClick}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Написать специалисту
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-200 space-y-6"
          >
            {/* Описание вакансии/услуги */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info size={18} />
                {isVacancy ? "О вакансии" : "Об услуге"}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
              </div>
            </div>

            {/* О пользователе */}
            {userAbout && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UserIcon size={18} />
                  {isVacancy ? "О клиенте" : "О специалисте"}
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 leading-relaxed">{userAbout}</p>
                </div>
              </div>
            )}

            {isCorrectUser && userData && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Дополнительная информация
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {userData.about_user && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">{userData.about_user}</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
ListingCard.displayName = "ListingCard";

const CategoryFilter = memo(({
  categories,
  selectedCategory,
  onCategoryClick
}: {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (id: number) => void;
}) => (
  <div className="space-y-0.5">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => onCategoryClick(category.id)}
        className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedCategory === category.id
          ? "bg-gray-50 text-gray-900 font-medium"
          : "text-gray-600 hover:bg-gray-50"
          }`}
      >
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedCategory === category.id
            ? "border-gray-800"
            : "border-gray-300"
            }`}
        >
          {selectedCategory === category.id && (
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
          )}
        </div>
        <span>{getDisplayName(category)}</span>
      </button>
    ))}
  </div>
));
CategoryFilter.displayName = "CategoryFilter";

const ViewModeToggle = memo(({
  viewMode,
  onViewModeChange
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) => (
  <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
    <button
      onClick={() => onViewModeChange('vacancies')}
      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'vacancies'
        ? 'bg-white text-gray-900 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
        }`}
    >
      Вакансии
    </button>
    <button
      onClick={() => onViewModeChange('services')}
      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'services'
        ? 'bg-white text-gray-900 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
        }`}
    >
      Услуги
    </button>
  </div>
));
ViewModeToggle.displayName = "ViewModeToggle";

export default function ListingsPage() {
  const apiClient = useMemo(() => getAPIClient(), []);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('vacancies');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [usersData, setUsersData] = useState<Map<number, User>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: number): Promise<User | null> => {
    try {
      const user = await apiClient.getUserById(userId);
      return user;
    } catch (err) {
      console.error(`❌ Ошибка загрузки данных пользователя ${userId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [categoriesData, subCategoriesData, vacanciesData, servicesData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getSubcategories(),
          apiClient.getVacancies({ page: 1, limit: 50 }),
          apiClient.getServices(1, 50),
        ]);

        const extractedCategories = extractResults(categoriesData);
        const extractedSubCategories = extractResults(subCategoriesData);
        const extractedVacancies = extractResults(vacanciesData);
        const extractedServices = extractResults(servicesData);

        setCategories(extractedCategories);
        setSubCategories(extractedSubCategories);
        setVacancies(extractedVacancies);
        setServices(extractedServices);

        console.log(`✅ Загружено с API:`);
        console.log(`- Категории: ${extractedCategories.length}`);
        console.log(`- Подкатегории: ${extractedSubCategories.length}`);
        console.log(`- Вакансии: ${extractedVacancies.length}`);
        console.log(`- Услуги: ${extractedServices.length}`);

        const allUserIds = new Set<number>();

        extractedVacancies.forEach(vacancy => {
          allUserIds.add(vacancy.client);
        });

        extractedServices.forEach(service => {
          allUserIds.add(service.executor);
        });

        console.log(`👥 Загружаем данные для ${allUserIds.size} пользователей`);

        const userPromises = Array.from(allUserIds).map(userId =>
          fetchUserData(userId)
        );

        const users = await Promise.all(userPromises);

        const usersMap = new Map<number, User>();
        users.forEach(user => {
          if (user) {
            usersMap.set(user.id, user);
          }
        });

        setUsersData(usersMap);
        console.log(`✅ Загружено данных пользователей: ${usersMap.size}`);

      } catch (err) {
        console.error("❌ Ошибка загрузки с API:", err);
        setError("Ошибка загрузки данных. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiClient]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');
    const modeParam = searchParams.get('mode');

    if (modeParam === 'services' || modeParam === 'vacancies') {
      setViewMode(modeParam as ViewMode);
    }

    if (categoryParam) {
      const categoryId = parseInt(categoryParam);
      if (!isNaN(categoryId)) {
        setSelectedCategory(categoryId);
      }
    }

    if (subcategoryParam) {
      const subcategoryIds = subcategoryParam.split(',')
        .map(id => parseInt(id))
        .filter(id => !isNaN(id));
      setSelectedSubCategories(subcategoryIds);
    }
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    const sourceData = viewMode === 'vacancies' ? vacancies : services;
    let filtered = [...sourceData];

    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter(item => {
        if (viewMode === 'vacancies') {
          const vacancy = item as Vacancy;
          const subCategoryId = vacancy.sub_category;
          return selectedSubCategories.includes(subCategoryId);
        } else {
          const service = item as Service;
          const subCategoryIds = service.sub_categories || [];
          return subCategoryIds.some(scId => selectedSubCategories.includes(scId));
        }
      });
    }
    else if (selectedCategory !== null) {
      filtered = filtered.filter(item => {
        const categoryId = typeof item.category === 'number'
          ? item.category
          : item.category?.id;
        return categoryId === selectedCategory;
      });
    }

    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(item => {
        return selectedPriceRanges.some(rangeLabel => {
          const priceRange = PRICE_RANGES.find(pr => pr.label === rangeLabel);
          if (!priceRange) return false;
          return item.price >= priceRange.min && item.price <= priceRange.max;
        });
      });
    }

    return filtered;
  }, [
    viewMode,
    vacancies,
    services,
    selectedCategory,
    selectedSubCategories,
    selectedPriceRanges,
  ]);

  const filteredSubCategories = useMemo(() => {
    if (selectedCategory === null) return [];

    return subCategories.filter(sub => {
      const categoryId = typeof sub.category === 'number'
        ? sub.category
        : sub.category?.id;
      return categoryId === selectedCategory;
    });
  }, [subCategories, selectedCategory]);

  const handleCategoryClick = useCallback((categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubCategories([]);
      router.push(`/${viewMode}`);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubCategories([]);
      router.push(`/${viewMode}?category=${categoryId}&mode=${viewMode}`);
    }
  }, [selectedCategory, viewMode, router]);

  const handleSubCategoryToggle = useCallback((subCategoryId: number) => {
    const newSubCategories = selectedSubCategories.includes(subCategoryId)
      ? selectedSubCategories.filter(id => id !== subCategoryId)
      : [...selectedSubCategories, subCategoryId];

    setSelectedSubCategories(newSubCategories);

    const params = new URLSearchParams();
    params.set('mode', viewMode);
    if (selectedCategory) {
      params.set('category', selectedCategory.toString());
    }
    if (newSubCategories.length > 0) {
      params.set('subcategory', newSubCategories.join(','));
    }

    router.push(`/${viewMode}?${params.toString()}`);
  }, [selectedSubCategories, viewMode, selectedCategory, router]);

  const toggleSelection = useCallback((
    array: any[],
    setArray: (arr: any[]) => void,
    item: any
  ) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  }, []);

  const handleViewModeSwitch = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    const params = new URLSearchParams();
    params.set('mode', mode);
    if (selectedCategory) params.set('category', selectedCategory.toString());
    router.push(`/${mode}?${params.toString()}`);
  }, [selectedCategory, router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-[60px]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-8">
            <aside className="w-56 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm sticky top-6">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-semibold text-gray-800">Все категории</span>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>

                  <ViewModeToggle
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeSwitch}
                  />

                  <div className="mb-5 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                      <Folder size={18} />
                      <span className="text-sm font-medium">Категории</span>
                    </div>

                    {categories.length > 0 ? (
                      <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryClick={handleCategoryClick}
                      />
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Категории не найдены
                      </p>
                    )}

                    {selectedCategory !== null && filteredSubCategories.length > 0 && (
                      <div className="mt-3 space-y-0.5">
                        <span className="text-xs text-gray-500 block mb-2 pl-3">Подкатегории:</span>
                        {filteredSubCategories.map((subCategory) => (
                          <label
                            key={subCategory.id}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSubCategoryToggle(subCategory.id)}
                          >
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                              {selectedSubCategories.includes(subCategory.id) && (
                                <div className="w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-gray-700">{getDisplayName(subCategory)}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-5 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                      <DollarSign size={18} />
                      <span className="text-sm font-medium">Стоимость</span>
                    </div>
                    <div className="space-y-1">
                      {PRICE_RANGES.map((range) => (
                        <label
                          key={range.label}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPriceRanges.includes(range.label)}
                            onChange={() =>
                              toggleSelection(selectedPriceRanges, setSelectedPriceRanges, range.label)
                            }
                            className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                          />
                          <span className="text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                      <Award size={18} />
                      <span className="text-sm font-medium">Стаж лет</span>
                    </div>
                    <div className="space-y-1">
                      {EXPERIENCE_YEARS.map((range) => (
                        <label
                          key={range.label}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExperience.includes(range.label)}
                            onChange={() =>
                              toggleSelection(selectedExperience, setSelectedExperience, range.label)
                            }
                            className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                          />
                          <span className="text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                      <Clock size={18} />
                      <span className="text-sm font-medium">Часы работы</span>
                    </div>
                    <div className="space-y-1">
                      {WORKING_HOURS.map((hours) => (
                        <label
                          key={hours.label}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedHours.includes(hours.label)}
                            onChange={() =>
                              toggleSelection(selectedHours, setSelectedHours, hours.label)
                            }
                            className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                          />
                          <span className="text-gray-700">{hours.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {viewMode === 'vacancies' ? 'Вакансии' : 'Услуги'}
                </h1>
                <p className="text-gray-600 mt-2">
                  Найдите {viewMode === 'vacancies' ? 'работу своей мечты' : 'идеального исполнителя'}
                </p>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600 text-lg font-semibold mb-2">
                    {viewMode === 'vacancies' ? 'Вакансии не найдены' : 'Услуги не найдены'}
                  </p>
                  <p className="text-gray-500 text-sm">Попробуйте изменить фильтры поиска</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item, index) => {
                    const userId = 'client' in item ? item.client : item.executor;
                    const userData = usersData.get(userId) || null;

                    return (
                      <ListingCard
                        key={item.id}
                        item={item}
                        index={index}
                        viewMode={viewMode}
                        userData={userData}
                      />
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}