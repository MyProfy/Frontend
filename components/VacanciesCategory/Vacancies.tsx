"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Search, MapPin, Clock, User } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAPIClient } from ".././types/apiClient";
import { Category, SubCategory, Vacancy } from ".././types/apiTypes";

export default function Vacancies() {
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
        if (!vacancy.sub_categories || vacancy.sub_categories.length === 0) return false;

        return vacancy.sub_categories.some(subCat => {
          const subCatId = typeof subCat === 'number' ? subCat : subCat.id;
          return selectedSubCategories.includes(subCatId);
        });
      });
    }

    else if (selectedCategory !== null) {
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
        vacancy.name?.toLowerCase().includes(query) ||
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
      <div className="flex justify-center items-center h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Зарабатывайте на том, что умеете
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium">
              {filteredVacancies.length} × {vacancies.length}
            </div>
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
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <aside className="w-56 flex-shrink-0">
            <div className="bg-white rounded-lg border border-blue-400 shadow-sm sticky top-6">
              <div className="p-4">
                <button className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200">
                  <span>Все категории</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>

                <div className="space-y-1 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${selectedCategory === category.id
                          ? "text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedCategory === category.id
                          ? "border-blue-500"
                          : "border-gray-300"
                        }`}>
                        {selectedCategory === category.id && (
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      {getDisplayName(category)}
                    </button>
                  ))}
                </div>

                {selectedCategory !== null && getFilteredSubCategories().length > 0 && (
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <button className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-2">
                      <span>Подкатегории</span>
                    </button>
                    <div className="space-y-1">
                      {getFilteredSubCategories().map((subCategory) => (
                        <label
                          key={subCategory.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubCategories.includes(subCategory.id)}
                            onChange={() => handleSubCategoryToggle(subCategory.id)}
                            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-600">{getDisplayName(subCategory)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4 pb-3 border-b border-gray-200">
                  <button className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-2">
                    <span>Стоимость</span>
                  </button>
                  <div className="space-y-1">
                    {priceRanges.map((range) => (
                      <label
                        key={range.label}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(range.label)}
                          onChange={() => toggleSelection(selectedPriceRanges, setSelectedPriceRanges, range.label)}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-600">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4 pb-3 border-b border-gray-200">
                  <button className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-2">
                    <span>Стаж лет</span>
                  </button>
                  <div className="space-y-1">
                    {experienceYears.map((exp) => (
                      <label
                        key={exp}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExperience.includes(exp)}
                          onChange={() => toggleSelection(selectedExperience, setSelectedExperience, exp)}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-600">{exp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Часы работы */}
                <div>
                  <button className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-2">
                    <span>Часы работы</span>
                  </button>
                  <div className="space-y-1">
                    {workingHours.map((hours) => (
                      <label
                        key={hours}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedHours.includes(hours)}
                          onChange={() => toggleSelection(selectedHours, setSelectedHours, hours)}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-600">{hours}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredVacancies.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">Вакансии не найдены</p>
                <p className="text-gray-500 text-sm mt-2">Попробуйте изменить фильтры</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVacancies.map((vacancy, index) => (
                  <motion.div
                    key={vacancy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {vacancy.name}
                          </h3>
                          {vacancy.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {vacancy.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <User size={14} className="text-gray-400" />
                              <span>Клиент</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-gray-400" />
                              <span>Часы работы: 11 - 20</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-gray-400" />
                              <span>Мирзо Улуғбек туман, Аранчи куча</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-xl font-bold text-gray-900">
                            {vacancy.price.toLocaleString()} сум
                          </div>
                        </div>
                      </div>

                      {index === 0 && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                          <button className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                            <span>🔥</span>
                            Откликнуться
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                            <span>⚡</span>
                            Подробнее
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
  );
}