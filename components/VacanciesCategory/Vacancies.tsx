"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Search, MapPin, Clock, User, Folder, DollarSign, Award, Images } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAPIClient } from "@/components/types/apiClient";
import { Category, SubCategory, Vacancy, Service } from "@/components/types/apiTypes";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import { PiTelegramLogoLight } from "react-icons/pi";

type ViewMode = 'vacancies' | 'services';
type ListingItem = Vacancy | Service;

const PRICE_RANGES = [
  { label: "10 000 - 30 000", min: 10000, max: 30000 },
  { label: "30 000 - 60 000", min: 30000, max: 60000 },
  { label: "60 000 - 80 000", min: 60000, max: 80000 },
] as const;

const EXPERIENCE_YEARS = ["1 - 2 года", "3 - 4 года", "5 - 6+ лет"] as const;
const WORKING_HOURS = ["0 - 10 часов", "11 - 20 часов", "21 - 40 часов"] as const;

const MOCK_VACANCIES: Vacancy[] = [
  {
    id: 1,
    title: "Требуется веб-дизайнер для корпоративного сайта",
    price: 2500000,
    description: "Ищем опытного веб-дизайнера для разработки современного корпоративного сайта. Требуется портфолио с похожими проектами.",
    category: 1,
    sub_category: 2,
    client: 101,
    images: [{ url: "https://images.unsplash.com/photo-1581291518835-1a1c91d3f87d" }],
    moderation: "approved",
    moderation_display: "Одобрено",
    boost: 0,
  },
  {
    id: 2,
    title: "Нужен электрик для ремонта квартиры",
    price: 500000,
    description: "Требуется опытный электрик для полной замены проводки в 3-комнатной квартире. Работа в районе Юнусабад.",
    category: 3,
    sub_category: 5,
    client: 102,
    images: [{ url: "https://images.unsplash.com/photo-1581094651181-3592e61b7b07" }],
    moderation: "approved",
    moderation_display: "Одобрено",
    boost: 0,
  },
  {
    id: 3,
    title: "Ищу репетитора английского языка для ребенка",
    price: 150000,
    description: "Нужен репетитор английского для подготовки ребенка 10 лет к международным экзаменам. 3 раза в неделю по 1.5 часа.",
    category: 2,
    sub_category: 4,
    client: 103,
    images: [{ url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df" }],
    moderation: "approved",
    moderation_display: "Одобрено",
    boost: 0,
  },
];


const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    name: "Профессиональный массаж на дому",
    price: 200000,
    description: "Предлагаю услуги профессионального массажа с выездом на дом. Опыт работы 8 лет, сертификаты.",
    category: 4,
    sub_categories: [6],
    executor: 201,
    images: [],
  },
  {
    id: 2,
    name: "Ремонт бытовой техники любой сложности",
    price: 100000,
    description: "Ремонт холодильников, стиральных машин, кондиционеров. Гарантия на все работы 6 месяцев.",
    category: 5,
    sub_categories: [7, 8],
    executor: 202,
    images: [],
  },
  {
    id: 3,
    name: "Уборка квартир и офисов",
    price: 80000,
    description: "Профессиональная уборка помещений. Используем экологичные средства. Работаем 7 дней в неделю.",
    category: 6,
    sub_categories: [9],
    executor: 203,
    images: [],
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
  onSpecialistClick,
  onVacancyClick
}: {
  item: ListingItem;
  index: number;
  viewMode: ViewMode;
  onSpecialistClick: () => void;
  onVacancyClick: () => void;
}) => {
  const router = useRouter();
  const isVacancy = viewMode === 'vacancies';
  const title = 'title' in item ? item.title : item.name;
  const price = item.price;

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
      className="border border-gray-200 rounded-2xl hover:shadow-lg transition-all cursor-pointer bg-white overflow-hidden p-6 flex gap-6"
    >
      <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
        {/* <Image
          src={item.images?.[0]?.url || "/no-image.jpg"}
          alt={item.title}
          width={120}
          height={120}
          className="object-cover w-full h-full"
        /> */}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <ChevronRight className="text-gray-400" size={22} />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
            </svg>
            Паспорт проверен
          </span>

          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center gap-1.5">
            ⭐ <span className="font-semibold">4.98</span> · <span>1775 отзывов</span>
          </span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <PiTelegramLogoLight size={18} />
            Написать специалисту
          </button>

          <div className="text-right">
            <p className="text-xs text-gray-500">Выезд к клиенту</p>
            <p className="text-sm font-medium">Ташкент, Ташкент область</p>
          </div>
        </div>
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
  <div className="space-y-1 mb-4">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => onCategoryClick(category.id)}
        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === category.id
          ? "bg-green-50 text-green-700 font-semibold"
          : "text-gray-600 hover:bg-gray-50"
          }`}
      >
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedCategory === category.id
            ? "border-green-600"
            : "border-gray-300"
            }`}
        >
          {selectedCategory === category.id && (
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
          )}
        </div>
        {getDisplayName(category)}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        console.log("🔄 Загрузка данных с API...");

        const [categoriesData, subCategoriesData, vacanciesData, servicesData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getSubcategories(),
          apiClient.getVacancies(1, 50),
          apiClient.getServices(1, 50),
        ]);

        const extractedCategories = extractResults(categoriesData);
        const extractedSubCategories = extractResults(subCategoriesData);
        const extractedVacancies = extractResults(vacanciesData);
        const extractedServices = extractResults(servicesData);

        setCategories(extractedCategories);
        setSubCategories(extractedSubCategories);

        if (!extractedVacancies || extractedVacancies.length === 0) {
          console.log("⚠️ API вернул пустой список вакансий, используем MOCK_VACANCIES");
          setVacancies(MOCK_VACANCIES);
          setUsingMockData(true);
        } else {
          console.log(`✅ Загружено ${extractedVacancies.length} вакансий с API`);
          setVacancies(extractedVacancies);
        }

        if (!extractedServices || extractedServices.length === 0) {
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
      setViewMode(modeParam);
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
            const scId = typeof sc === 'number' ? sc : sc.id;
            return selectedSubCategories.includes(scId);
          });
        }

        const scId = typeof itemSubCat === 'number' ? itemSubCat : itemSubCat.id;
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

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const title = 'title' in item ? item.title : item.name;
        const description = item.description || '';
        return title?.toLowerCase().includes(query) ||
          description?.toLowerCase().includes(query);
      });
    }

    return filtered;
  }, [viewMode, vacancies, services, selectedCategory, selectedSubCategories, selectedPriceRanges, searchQuery]);

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
      <div className="min-h-screen bg-gray-100 mt-[60px]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {usingMockData && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Отображаются тестовые данные (API недоступен или вернул пустой список)
              </p>
            </div>
          )}

          <div className="flex gap-6">
            <aside className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6">
                <div className="p-4">
                  <div className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3 pb-3 border-b border-dotted border-blue-300">
                    <span>Все категории</span>
                    <ChevronRight size={18} className="text-blue-500" />
                  </div>

                  <div className="mb-4 pb-3 border-b border-dotted border-blue-300">
                    <div className="flex items-center gap-2 mb-3 text-gray-700">
                      <Folder size={18} />
                      <span className="text-sm font-medium">Под категории</span>
                    </div>

                    <CategoryFilter
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategoryClick={handleCategoryClick}
                    />

                    {selectedCategory !== null && filteredSubCategories.length > 0 && (
                      <div className="space-y-1">
                        {filteredSubCategories.map((subCategory) => (
                          <label
                            key={subCategory.id}
                            onClick={() => handleSubCategoryToggle(subCategory.id)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                          >
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                              {selectedSubCategories.includes(subCategory.id) && (
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-gray-700">{getDisplayName(subCategory)}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 pb-3 border-b border-dotted border-blue-300">
                    <div className="flex items-center gap-2 mb-3 text-gray-700">
                      <DollarSign size={18} />
                      <span className="text-sm font-medium">Стоимость</span>
                    </div>
                    <div className="space-y-1">
                      {PRICE_RANGES.map((range) => (
                        <label
                          key={range.label}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPriceRanges.includes(range.label)}
                            onChange={() =>
                              toggleSelection(selectedPriceRanges, setSelectedPriceRanges, range.label)
                            }
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 pb-3 border-b border-dotted border-blue-300">
                    <div className="flex items-center gap-2 mb-3 text-gray-700">
                      <Award size={18} />
                      <span className="text-sm font-medium">Стаж лет</span>
                    </div>
                    <div className="space-y-1">
                      {EXPERIENCE_YEARS.map((range) => (
                        <label
                          key={range}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExperience.includes(range)}
                            onChange={() =>
                              toggleSelection(selectedExperience, setSelectedExperience, range)
                            }
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-gray-700">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-0">
                    <div className="flex items-center gap-2 mb-3 text-gray-700">
                      <Clock size={18} />
                      <span className="text-sm font-medium">Часы работы</span>
                    </div>
                    <div className="space-y-1">
                      {WORKING_HOURS.map((hours) => (
                        <label
                          key={hours}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedHours.includes(hours)}
                            onChange={() =>
                              toggleSelection(selectedHours, setSelectedHours, hours)
                            }
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-gray-700">{hours}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1 bg-white rounded-xl">
              <div className="p-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {viewMode === 'vacancies'
                    ? 'Зарабатывайте на том, что умеете'
                    : 'Найдите надежного специалиста'}
                </h1>
                <div className="flex items-center gap-3 mt-4 p">
                  <div className="relative flex-1 max-w-md">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Поиск"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-220 pl-10 pr-10 py-2 px-10 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-16 rounded-xl">
                  <p className="text-gray-600 text-lg font-semibold mb-2">
                    {viewMode === 'vacancies' ? 'Вакансии не найдены' : 'Услуги не найдены'}
                  </p>
                  <p className="text-gray-500 text-sm">Попробуйте изменить фильтры поиска</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredItems.map((item, index) => (
                    <ListingCard
                      key={item.id}
                      item={item}
                      index={index}
                      viewMode={viewMode}
                      onSpecialistClick={() => handleViewModeSwitch('services')}
                      onVacancyClick={() => handleViewModeSwitch('vacancies')}
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