"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Search, MapPin, Clock, User } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAPIClient } from "@/components/types/apiClient";
import { Category, SubCategory, Vacancy } from "@/components/types/apiTypes";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";

export default function VacanciesPage() {
  const apiClient = useMemo(() => getAPIClient(), []);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const priceRanges = [
    { label: "10 000 - 30 000", min: 10000, max: 30000 },
    { label: "30 000 - 60 000", min: 30000, max: 60000 },
    { label: "60 000 - 80 000", min: 60000, max: 80000 },
  ];

  const experienceYears = ["1 - 2 года", "3 - 4 года", "5 - 6+ лет"];
  const workingHours = ["0 - 10 часов", "11 - 20 часов", "21 - 40 часов"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [categoriesData, subCategoriesData, vacanciesData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getSubcategories(),
          apiClient.getVacancies(1, 100),
        ]);

        const extractResults = (data: any) => {
          if (Array.isArray(data)) return data;
          if (data && 'results' in data) return data.results || [];
          return [];
        };

        setCategories(extractResults(categoriesData));
        setSubCategories(extractResults(subCategoriesData));
        setVacancies(extractResults(vacanciesData));
        setFilteredVacancies(extractResults(vacanciesData));
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiClient]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    if (categoryParam) {
      const categoryId = parseInt(categoryParam);
      if (!isNaN(categoryId)) {
        setSelectedCategory(categoryId);
      }
    }

    if (subcategoryParam) {
      const subcategoryIds = subcategoryParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (subcategoryIds.length > 0) {
        setSelectedSubCategories(subcategoryIds);

        if (!categoryParam && subcategoryIds.length > 0) {
          const subCat = subCategories.find(sc => sc.id === subcategoryIds[0]);
          if (subCat) {
            const catId = typeof subCat.category === 'number' ? subCat.category : subCat.category?.id;
            if (catId) {
              setSelectedCategory(catId);
            }
          }
        }
      }
    }
  }, [searchParams, subCategories]);

  useEffect(() => {
    let filtered = [...vacancies];

    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter(vacancy => {
        if (!vacancy.sub_category) return false;
        const subCatId = typeof vacancy.sub_category === 'number' ? vacancy.sub_category : vacancy.sub_category.id;
        return selectedSubCategories.includes(subCatId);
      });
    } else if (selectedCategory !== null) {
      filtered = filtered.filter(vacancy => {
        const categoryId = typeof vacancy.category === 'number'
          ? vacancy.category
          : vacancy.category?.id;
        return categoryId === selectedCategory;
      });
    }

    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(vacancy => {
        return selectedPriceRanges.some(range => {
          const priceRange = priceRanges.find(pr => pr.label === range);
          if (!priceRange) return false;
          return vacancy.price >= priceRange.min && vacancy.price <= priceRange.max;
        });
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vacancy =>
        vacancy.title?.toLowerCase().includes(query) ||
        vacancy.description?.toLowerCase().includes(query)
      );
    }

    setFilteredVacancies(filtered);
  }, [vacancies, selectedCategory, selectedSubCategories, selectedPriceRanges, searchQuery]);

  const toggleSelection = (array: any[], setArray: (arr: any[]) => void, item: any) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubCategories([]);
      router.push('/vacancies');
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubCategories([]);
      router.push(`/vacancies?category=${categoryId}`);
    }
  };

  const handleSubCategoryToggle = (subCategoryId: number) => {
    const newSubCategories = selectedSubCategories.includes(subCategoryId)
      ? selectedSubCategories.filter(id => id !== subCategoryId)
      : [...selectedSubCategories, subCategoryId];

    setSelectedSubCategories(newSubCategories);

    const params = new URLSearchParams();
    if (selectedCategory) {
      params.set('category', selectedCategory.toString());
    }
    if (newSubCategories.length > 0) {
      params.set('subcategory', newSubCategories.join(','));
    }

    router.push(`/vacancies?${params.toString()}`);
  };

  const getDisplayName = (item: Category | SubCategory) => {
    return item.display_ru || item.display_uz || item.name;
  };

  const getFilteredSubCategories = () => {
    if (selectedCategory === null) return [];

    return subCategories.filter(sub => {
      const categoryId = typeof sub.category === 'number'
        ? sub.category
        : sub.category?.id;
      return categoryId === selectedCategory;
    });
  };

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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-red-600">
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 mt-[60px]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-6">
            <aside className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6">
                <div className="p-4">
                  <div className="flex items-center justify-between w-full text-left font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                    <span>Все категории</span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-400 rounded"></div>
                      <input
                        type="text"
                        placeholder="Под категории"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === category.id
                            ? "bg-green-50 text-green-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedCategory === category.id
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

                  {selectedCategory !== null && getFilteredSubCategories().length > 0 && (
                    <div className="mb-4 pb-3 border-b border-gray-200">
                      <div className="font-bold text-gray-900 mb-2">Подкатегории</div>
                      <div className="space-y-1">
                        {getFilteredSubCategories().map((subCategory) => (
                          <label
                            key={subCategory.id}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubCategories.includes(subCategory.id)}
                              onChange={() => handleSubCategoryToggle(subCategory.id)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-gray-700">{getDisplayName(subCategory)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <div className="font-bold text-gray-900 mb-2">Стоимость</div>
                    <div className="space-y-1">
                      {priceRanges.map((range) => (
                        <label
                          key={range.label}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
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

                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <div className="font-bold text-gray-900 mb-2">Стаж лет</div>
                    <div className="space-y-1">
                      {experienceYears.map((exp) => (
                        <label
                          key={exp}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExperience.includes(exp)}
                            onChange={() =>
                              toggleSelection(selectedExperience, setSelectedExperience, exp)
                            }
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-gray-700">{exp}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-gray-900 mb-2">Часы работы</div>
                    <div className="space-y-1">
                      {workingHours.map((hours) => (
                        <label
                          key={hours}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedHours.includes(hours)}
                            onChange={() => toggleSelection(selectedHours, setSelectedHours, hours)}
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
              <div className="p-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Зарабатывайте на том, что умеете
                </h1>
                <div className="flex items-center gap-3 mt-4">
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
                      className="w-230 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* СПИСОК ВАКАНСИЙ */}
              {filteredVacancies.length === 0 ? (
                <div className="text-center py-16 rounded-xl">
                  <p className="text-gray-600 text-lg font-semibold mb-2">Вакансии не найдены</p>
                  <p className="text-gray-500 text-sm">Попробуйте изменить фильтры поиска</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredVacancies.map((vacancy, index) => (
                    <motion.div
                      key={vacancy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors relative"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {vacancy.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User size={14} className="text-gray-500" />
                                </div>
                                <span>Олег Фёдоров</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <span>Часы работы: 11 - 20</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                <span>Мирзо Улугбек туман, Аранчи куча</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-gray-900">
                              {vacancy.price.toLocaleString()} руб
                            </div>
                          </div>
                        </div>

                        {/* OVERLAY С КНОПКАМИ НА 3-Й КАРТОЧКЕ */}
                        {index === 2 && (
                          <div className="absolute inset-0 bg-white/98 flex items-center justify-center gap-3 z-10">
                            <button
                              onClick={() => router.push('/services')}
                              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <span>🔥</span>
                              Найти специалиста
                            </button>
                            <button
                              onClick={() => router.push('/vacancies')}
                              className="flex items-center gap-2 px-6 py-3 bg-black rounded-lg text-white font-semibold hover:bg-gray-800 transition-colors shadow-sm"
                            >
                              <span>⚡</span>
                              Найти заказы
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
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