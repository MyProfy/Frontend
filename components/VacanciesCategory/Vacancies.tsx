"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Folder, DollarSign, Award, Clock, MapPin } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAPIClient } from "@/components/types/apiClient";
import { Category, SubCategory, Vacancy, Service } from "@/components/types/apiTypes";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";

type ViewMode = 'vacancies' | 'services';
type ListingItem = Vacancy | Service;

const PRICE_RANGES = [
  { label: "10 000 - 30 000", min: 10000, max: 30000 },
  { label: "30 000 - 60 000", min: 30000, max: 60000 },
  { label: "60 000 - 80 000", min: 60000, max: 80000 },
] as const;

const EXPERIENCE_YEARS = ["1 - 2 года", "3 - 4 года", "5 - 6+ лет"] as const;
const WORKING_HOURS = ["0 - 10 часов", "11 - 20 часов", "21 - 40 часов"] as const;

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Веб-разработка", display_ru: "Веб-разработка", service_count: 5 },
  { id: 2, name: "Образование", display_ru: "Образование", service_count: 3 },
  { id: 3, name: "Ремонт", display_ru: "Ремонт", service_count: 4 },
  { id: 4, name: "Здоровье", display_ru: "Здоровье", service_count: 2 },
  { id: 5, name: "Бытовая техника", display_ru: "Бытовая техника", service_count: 6 },
  { id: 6, name: "Уборка", display_ru: "Уборка", service_count: 1 },
];

const MOCK_SUBCATEGORIES: SubCategory[] = [
  { id: 1, name: "Дизайн", display_ru: "Дизайн", category: 1 },
  { id: 2, name: "Frontend", display_ru: "Frontend", category: 1 },
  { id: 3, name: "Английский", display_ru: "Английский", category: 2 },
  { id: 4, name: "Репетитор", display_ru: "Репетитор", category: 2 },
  { id: 5, name: "Электрика", display_ru: "Электрика", category: 3 },
  { id: 6, name: "Массаж", display_ru: "Массаж", category: 4 },
  { id: 7, name: "Холодильники", display_ru: "Холодильники", category: 5 },
  { id: 8, name: "Стиралки", display_ru: "Стиралки", category: 5 },
  { id: 9, name: "Квартиры", display_ru: "Квартиры", category: 6 },
];

const MOCK_VACANCIES: Vacancy[] = [
  {
    id: 1,
    title: "Требуется веб-дизайнер для корпоративного сайта",
    price: 25000,
    description: "Ищем опытного веб-дизайнера для разработки современного корпоративного сайта. Требуется портфолио с похожими проектами.",
    category: 1,
    sub_category: 1,
    client: 101,
    images: [],
    moderation: "approved",
    moderation_display: "Одобрено",
    boost: 0,
  },
  {
    id: 2,
    title: "Нужен электрик для ремонта квартиры",
    price: 50000,
    description: "Требуется опытный электрик для полной замены проводки в 3-комнатной квартире. Работа в районе Юнусабад.",
    category: 3,
    sub_category: 5,
    client: 102,
    images: [],
    moderation: "approved",
    moderation_display: "Одобрено",
    boost: 0,
  },
  {
    id: 3,
    title: "Ищу репетитора английского языка для ребенка",
    price: 15000,
    description: "Нужен репетитор английского для подготовки ребенка 10 лет к международным экзаменам. 3 раза в неделю по 1.5 часа.",
    category: 2,
    sub_category: 3,
    client: 103,
    images: [],
    moderation: "approved",
    moderation_display: "Одобрено",
    boost: 0,
  },
];

const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    name: "Профессиональный массаж на дому",
    price: 20000,
    description: "Предлагаю услуги профессионального массажа с выездом на дом. Опыт работы 8 лет, сертификаты.",
    category: 4,
    sub_categories: [6],
    executor: 201,
    images: [],
    boosts: [],
    reviews: [],
  },
  {
    id: 2,
    name: "Ремонт бытовой техники любой сложности",
    price: 10000,
    description: "Ремонт холодильников, стиральных машин, кондиционеров. Гарантия на все работы 6 месяцев.",
    category: 5,
    sub_categories: [7, 8],
    executor: 202,
    images: [],
    boosts: [],
    reviews: [],
  },
  {
    id: 3,
    name: "Уборка квартир и офисов",
    price: 8000,
    description: "Профессиональная уборка помещений. Используем экологичные средства. Работаем 7 дней в неделю.",
    category: 6,
    sub_categories: [9],
    executor: 203,
    images: [],
    boosts: [],
    reviews: [],
  },
];

const extractResults = (data: any) => {
  if (Array.isArray(data)) return data;
  if (data && 'results' in data) return data.results || [];
  return [];
};

const getDisplayName = (item: Category | SubCategory) => {
  return item.display_ru || item.display_uz || item.name;
};

const ListingCard = memo(({
  item,
  index,
  viewMode,
}: {
  item: ListingItem;
  index: number;
  viewMode: ViewMode;
}) => {
  const router = useRouter();
  const isVacancy = viewMode === 'vacancies';
  const title = 'title' in item ? item.title : item.name;

  const handleCardClick = () => {
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
      onClick={handleCardClick}
      className="bg-white rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className="text-lg font-semibold text-gray-900 whitespace-nowrap ml-4">
          {item.price.toLocaleString('ru-RU')} сум
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          <span className="font-medium text-gray-700">Олег Фёдоров</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>Часы работы: 11 - 20</span>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin size={14} />
          <span>Мирзо Улугбек туман, Аранчи куча</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="px-5 py-2.5 bg-white border border-gray-800 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
          </svg>
          {isVacancy ? "Найти специалиста" : "Заказать услугу"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {isVacancy ? "Подробнее о вакансии" : "Подробнее об услуге"}
        </button>
      </div>
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
        className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
          selectedCategory === category.id
            ? "bg-gray-50 text-gray-900 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            selectedCategory === category.id
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

export default function VacanciesPage() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setUsingMockData(false);

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

        setCategories(extractedCategories.length > 0 ? extractedCategories : MOCK_CATEGORIES);
        setSubCategories(extractedSubCategories.length > 0 ? extractedSubCategories : MOCK_SUBCATEGORIES);

        if (extractedVacancies.length === 0) {
          setVacancies(MOCK_VACANCIES);
          setUsingMockData(true);
        } else {
          console.log(`✅ Загружено ${extractedVacancies.length} вакансий с API`);
          setVacancies(extractedVacancies);
        }

        if (extractedServices.length === 0) {
          console.log("⚠️ API вернул пустой список услуг, используем MOCK_SERVICES");
          setServices(MOCK_SERVICES);
          setUsingMockData(true);
        } else {
          console.log(`✅ Загружено ${extractedServices.length} услуг с API`);
          setServices(extractedServices);
        }

      } catch (err) {
        console.error("❌ Ошибка загрузки с API:", err);
        console.log("🔄 Переключение на MOCK данные из-за ошибки API");
        setCategories(MOCK_CATEGORIES);
        setSubCategories(MOCK_SUBCATEGORIES);
        setVacancies(MOCK_VACANCIES);
        setServices(MOCK_SERVICES);
        setUsingMockData(true);
        setError("Используются тестовые данные (API недоступен)");
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
        const itemSubCat = 'sub_category' in item ? item.sub_category :
          ('sub_categories' in item ? item.sub_categories : null);

        if (!itemSubCat) return false;

        if (Array.isArray(itemSubCat)) {
          return itemSubCat.some(sc => {
            const scId = typeof sc === 'number' ? sc : sc?.id;
            return selectedSubCategories.includes(scId);
          });
        }

        const scId = typeof itemSubCat === 'number' ? itemSubCat : itemSubCat;
        return selectedSubCategories.includes(scId);
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
        return selectedPriceRanges.some(range => {
          const priceRange = PRICE_RANGES.find(pr => pr.label === range);
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
    categories,
    subCategories
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-[60px]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {usingMockData && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Отображаются тестовые данные (API недоступен или вернул пустой список)
              </p>
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

                  <div className="mb-5 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                      <Folder size={18} />
                      <span className="text-sm font-medium">Подкатегории</span>
                    </div>

                    <CategoryFilter
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategoryClick={handleCategoryClick}
                    />

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
                          key={range}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExperience.includes(range)}
                            onChange={() =>
                              toggleSelection(selectedExperience, setSelectedExperience, range)
                            }
                            className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                          />
                          <span className="text-gray-700">{range}</span>
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
                          key={hours}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedHours.includes(hours)}
                            onChange={() =>
                              toggleSelection(selectedHours, setSelectedHours, hours)
                            }
                            className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                          />
                          <span className="text-gray-700">{hours}</span>
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
                <div className="space-y-3">
                  {filteredItems.map((item, index) => (
                    <ListingCard
                      key={item.id}
                      item={item}
                      index={index}
                      viewMode={viewMode}
                    />
                  ))}
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