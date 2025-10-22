"use client";

import React, { useContext, useEffect, useMemo, useState, useCallback, memo, useRef } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { getAPIClient } from "../../types/apiClient";
import { Category, Service, SubCategory } from "../../types/apiTypes";
import { motion, AnimatePresence } from "framer-motion";
import MyProfiBanner from "../../../public/Banner-MyProfi.png";
import Image from "next/image";
import Navbar from "@/components/Header/Navbar";

const ReviewsBlock = React.lazy(() => import("components/ReviewsBlock/ReviewsBlock"));

interface BannerClientProps {
  initialSlide?: number;
}

const ALLOWED_KEYS = [
  "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "Tab", "Enter", "Escape", "Home", "End", "PageUp", "PageDown"
];

const MAX_TEXT_LENGTH = 250;

const TOP_SPECIALTIES = [
  {
    name: "topSpecialties.tutors",
    image: "/avatar/logologo.png",
    categoryId: "1",
    link: "https://myprofy.uz/search?category=1"
  },
  {
    name: "topSpecialties.repair",
    image: "/avatar/logologo.png",
    categoryId: "67",
    link: "https://myprofy.uz/search?category=67"
  },
  {
    name: "topSpecialties.construction",
    image: "/avatar/logologo.png",
    categoryId: "2",
    link: "https://myprofy.uz/search?category=2"
  },
  {
    name: "topSpecialties.makeup",
    image: "/avatar/logologo.png",
    categoryId: "14",
    link: "https://myprofy.uz/search?category=14"
  },
] as const;

const extractResults = (data: any) => {
  if (Array.isArray(data)) return data;
  if (data && 'results' in data) return data.results || [];
  return [];
};

const SpecialtyCard = memo(({
  specialty,
  onClick
}: {
  specialty: { name: string; image: string };
  onClick: () => void;
}) => (
  <div className="flex flex-col items-center my-2 md:my-4 max-[930px]:my-2 p-4 max-[930px]:p-2 bg-white rounded-[18px] box-border">
    <div
      className="bg-[#f5f5f5] rounded-[10px] w-full aspect-square flex items-center justify-center text-center cursor-pointer box-border transition-transform hover:scale-105"
      onClick={onClick}
    >
      <img
        src={specialty.image}
        alt={specialty.name}
        className="w-full h-full object-cover rounded-[10px]"
        loading="lazy"
      />
    </div>
    <h3 className="text-lg md:text-xl max-md:text-base font-normal text-black mt-2.5 mb-0 text-center break-words p-3 md:p-4">
      {specialty.name}
    </h3>
  </div>
));
SpecialtyCard.displayName = "SpecialtyCard";

const CategoryItem = memo(({
  category,
  subCategories,
  getDisplayName,
  onCategoryClick,
  onSubCategoryClick,
  onShowAllClick,
  t
}: any) => {
  const subCategoryCount = subCategories.filter((sub: any) => {
    const categoryId = typeof sub.category === "number" ? sub.category : sub.category.id;
    return categoryId === category.id;
  }).length;

  const filteredSubCategories = useMemo(() =>
    subCategories
      .filter((sub: any) => {
        const categoryId = typeof sub.category === "number" ? sub.category : sub.category.id;
        return categoryId === category.id;
      })
      .slice(0, 5),
    [subCategories, category.id]
  );

  return (
    <div className="flex flex-col gap-3 text-left break-words">
      <div className="flex items-center">
        <h3
          onClick={() => onCategoryClick(category.id)}
          className="text-base md:text-lg font-semibold text-[#292c32] cursor-pointer hover:text-[#87e087] transition-colors truncate"
        >
          {getDisplayName(category)}
        </h3>
        <p className="text-sm md:text-lg text-[#858b98] ml-2 hidden md:inline-block">
          {category?.service_count
            ? category.service_count
            : Math.floor(Math.random() * (500 - 50 + 1)) + 50}
        </p>

      </div>

      <ul className="flex flex-col gap-2 text-[#303030] font-normal">
        {filteredSubCategories.map((subCategory: any) => (
          <li
            key={subCategory.id}
            onClick={() => onSubCategoryClick(subCategory.id, category.id)}
            className="text-sm md:text-base text-[#303030] cursor-pointer hover:text-[#87e087] transition-colors truncate"
          >
            {getDisplayName(subCategory)}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onShowAllClick(category.id)}
        className="text-xs md:text-sm text-black underline cursor-pointer hover:text-[#87e087] transition-colors mt-2 w-fit"
      >
        {t("specialists.showAll", "Показать все")} ({subCategoryCount})
      </button>
    </div>
  );
});
CategoryItem.displayName = "CategoryItem";

const SearchBlock = memo(({
  searchQuery,
  onSearchChange,
  onSearch,
  searchResults,
  onResultClick,
  showResults,
  t
}: any) => {
  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-2.5 w-full mb-10 relative" ref={searchRef}>
      <div className="relative flex-1 flex items-center w-full">
        <svg
          className="absolute left-3 md:left-3 max-md:left-2.5 w-5 h-5 max-md:w-[18px] max-md:h-[18px] fill-[#333]"
          viewBox="0 0 22 22"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.48359 10.0833C2.48359 5.88592 5.88623 2.48329 10.0836 2.48329C14.281 2.48329 17.6836 5.88592 17.6836 10.0833C17.6836 12.1741 16.8393 14.0678 15.473 15.4419C15.4676 15.4469 15.4623 15.4521 15.457 15.4573C15.4517 15.4626 15.4466 15.4679 15.4415 15.4733C14.0675 16.8392 12.1741 17.6833 10.0836 17.6833C5.88623 17.6833 2.48359 14.2807 2.48359 10.0833ZM15.9002 16.8198C14.3402 18.1679 12.3071 18.9833 10.0836 18.9833C5.16826 18.9833 1.18359 14.9986 1.18359 10.0833C1.18359 5.16795 5.16826 1.18329 10.0836 1.18329C14.9989 1.18329 18.9836 5.16795 18.9836 10.0833C18.9836 12.3072 18.1679 14.3405 16.8195 15.9006L20.0429 19.124C20.2967 19.3779 20.2967 19.7894 20.0429 20.0433C19.789 20.2971 19.3775 20.2971 19.1237 20.0433L15.9002 16.8198Z"
            fill="#A4A8B2"
          />
        </svg>
        
        <input
          className="py-3 px-3 pl-10 max-md:pl-9 w-full border-none rounded-[13px] text-base md:text-lg bg-white"
          aria-label={t("search.ariaLabel", "Поиск специалистов")}
          placeholder={t("search.placeholder", "Поиск...")}
          value={searchQuery}
          onChange={onSearchChange}
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
        />

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50"
            >
              {searchResults.length > 0 ? (
                searchResults.map((result: any, index: number) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    onClick={() => onResultClick(result)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {result.type === 'category' ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{result.name}</p>
                        <p className="text-xs text-gray-500">
                          {result.type === 'category' ? t("search.category", "Категория") : t("search.subcategory", "Подкатегория")}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {t("search.notFound", "Ничего не найдено")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("search.tryAnother", "Попробуйте изменить поисковый запрос")}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSearch}
        className="bg-[#3ea23e] border-none text-base md:text-[0.98rem] font-normal text-white py-3 px-4 cursor-pointer rounded-lg transition-all hover:bg-[#2e8b57]"
      >
        {t("search.search", "Найти")}
      </motion.button>
    </div>
  );
});
SearchBlock.displayName = "SearchBlock";

const BannerClient = ({ initialSlide = 1 }: BannerClientProps) => {
  const { language } = useContext(LanguageContext);
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const apiClient = useMemo(() => getAPIClient(), []);

  const [mode, setMode] = useState<'client' | 'specialist'>('client');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [totalServices, setTotalServices] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [requestText, setRequestText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const reviews = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        text: t(`reviews.${i + 1}.text`, ""),
        comment: t(`reviews.${i + 1}.comment`, "Отличный сервис!"),
        date: t(`reviews.${i + 1}.date`, new Date().toLocaleDateString()),
        reviewer: t(`reviews.${i + 1}.reviewer`, `Клиент ${i + 1}`),
        rating: Number(t(`reviews.${i + 1}.rating`, "5")),
        tasksCompleted: Number(t(`reviews.${i + 1}.tasksCompleted`, "0")),
        image: t(`reviews.${i + 1}.image`, "/avatar/logologo.png"),
        cost: t(`reviews.${i + 1}.cost`, ""),
        serviceName: t(`reviews.${i + 1}.serviceName`, ""),
        jobName: t(`reviews.${i + 1}.jobName`, ""),
      })),
    [t]
  );

  const topSpecialtiesLinks = useMemo(() =>
    TOP_SPECIALTIES.map(s => ({
      name: t(s.name, ""),
      image: s.image,
      link: mode === 'client'
        ? `/search?category=${s.categoryId}`
        : `/register-specialist?category=${s.categoryId}`
    })),
    [t, mode]
  );

  const texts = useMemo(() => ({
    mainTitle: mode === 'client'
      ? t("hero.title", "Найдите надежного специалиста")
      : t("hero.titleSpecialist", "Станьте специалистом и зарабатывайте"),
    specialistsTitle: mode === 'client'
      ? t("specialists.title", "Специалисты по категориям")
      : t("specialists.titleSpecialist", "Популярные категории для специалистов"),
    specialistsDescFull: `371 ${mode === 'client'
      ? t("specialists.description", "минут на заказ")
      : t("specialists.descriptionSpecialist", "минут на регистрацию")}`,
    requestTitle: mode === 'client'
      ? t("request.title", "Опишите вашу задачу")
      : t("request.titleSpecialist", "Расскажите о своих услугах"),
    requestDesc: mode === 'client'
      ? t("request.description", "Расскажите, что нужно сделать, и получите отклики от специалистов")
      : t("request.descriptionSpecialist", "Опишите, чем вы занимаетесь, и мы поможем найти клиентов"),
    requestPlaceholder: mode === 'client'
      ? t("request.inputPlaceholder", "Например: 'Нужно починить кран на кухне'")
      : t("request.inputPlaceholderSpecialist", "Например: 'Я ремонтирую квартиры в Ташкенте'"),
    requestButton: mode === 'client'
      ? t("request.button", "Найти специалиста")
      : t("request.buttonSpecialist", "Создать профиль"),
    styledDescContent: mode === 'client'
      ? t("request.statsClient", "Из 1 233 333 специалистов обязательно найдется тот кто поможет")
      : t("request.statsSpecialist", "Из 1 233 333 заказов обязательно найдется тот, кто оценит ваши услуги"),
  }), [mode, t]);

  const getDisplayName = useCallback((item: Category | SubCategory) => {
    if (!item) return '';
    if (language === "ru" && item.display_ru) return item.display_ru;
    if (language === "uz" && item.display_uz) return item.display_uz;
    return item.name || '';
  }, [language]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      const queryLower = query.toLowerCase();

      const matchedCategories = categories
        .filter(cat => {
          if (!cat) return false;
          const displayName = getDisplayName(cat)?.toLowerCase() || '';
          const name = cat.name?.toLowerCase() || '';
          return displayName.includes(queryLower) || name.includes(queryLower);
        })
        .map(cat => ({
          id: cat.id,
          name: getDisplayName(cat),
          type: 'category',
          categoryId: cat.id
        }));

      const matchedSubCategories = subCategories
        .filter(sub => {
          if (!sub) return false;
          const displayName = getDisplayName(sub)?.toLowerCase() || '';
          const name = sub.name?.toLowerCase() || '';
          return displayName.includes(queryLower) || name.includes(queryLower);
        })
        .map(sub => {
          const categoryId = typeof sub.category === 'number' ? sub.category : sub.category?.id;
          return {
            id: sub.id,
            name: getDisplayName(sub),
            type: 'subcategory',
            categoryId: categoryId,
            subCategoryId: sub.id
          };
        });

      const results = [...matchedCategories, ...matchedSubCategories].slice(0, 10);
      setSearchResults(results);
      setShowResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [categories, subCategories, getDisplayName]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const matchedCategory = categories.find(cat => {
        if (!cat || !cat.name) return false;
        const displayName = getDisplayName(cat)?.toLowerCase() || '';
        const name = cat.name?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        return displayName === query || name === query;
      });

      if (matchedCategory) {
        router.push(`/vacancies?category=${matchedCategory.id}&mode=vacancies`);
      } else {
        router.push(`/vacancies?q=${encodeURIComponent(searchQuery)}&mode=vacancies`);
      }
      setShowResults(false);
    }
  }, [searchQuery, categories, getDisplayName, router]);

  const handleResultClick = useCallback((result: any) => {
    if (result.type === 'category') {
      router.push(`/vacancies?category=${result.categoryId}&mode=vacancies`);
    } else if (result.type === 'subcategory') {
      router.push(`/vacancies?category=${result.categoryId}&subcategory=${result.subCategoryId}&mode=vacancies`);
    }
    setSearchQuery(result.name);
    setShowResults(false);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (requestText.length >= MAX_TEXT_LENGTH && !ALLOWED_KEYS.includes(e.key)) {
      e.preventDefault();
    }
  }, [requestText.length]);

  const handleSpecialtyClick = useCallback((link: string) => {
    router.push(link);
  }, [router]);

  const handleCategoryClick = useCallback((categoryId: number) => {
    router.push(`/vacancies?category=${categoryId}&mode=vacancies`);
  }, [router]);

  const handleSubCategoryClick = useCallback((subCategoryId: number, categoryId: number) => {
    router.push(`/vacancies?category=${categoryId}&subcategory=${subCategoryId}&mode=vacancies`);
  }, [router]);

  const handleShowAllClick = useCallback((categoryId: number) => {
    router.push(`/vacancies?category=${categoryId}&mode=vacancies`);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [categoriesData, subCategoriesData, totalServicesData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getSubcategories(),
          apiClient.getServices(1, 1),
        ]);

        setCategories(extractResults(categoriesData));
        setSubCategories(extractResults(subCategoriesData));

        if (totalServicesData && typeof totalServicesData === 'object' && 'count' in totalServicesData) {
          setTotalServices(totalServicesData.count || 0);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(t("errors.fetchError", "Ошибка загрузки данных"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiClient, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-base md:text-lg text-black">
        {t("errors.loading", "Загрузка...")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-base md:text-lg text-black text-center px-5">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 mt-[60px]">
      <Navbar />

      <div className="px-5 py-10 md:px-7 lg:px-8 flex flex-col items-center text-center w-full box-border overflow-hidden max-w-[1440px] mx-auto">
        <div className="flex justify-center items-center w-full mb-8">
          <h1 className="text-2xl md:text-3xl font-normal text-black w-full max-w-[600px] text-center p-3">
            {texts.mainTitle}
          </h1>
        </div>

        <SearchBlock
          searchQuery={searchQuery}
          onSearchChange={handleSearchInputChange}
          onSearch={handleSearch}
          searchResults={searchResults}
          onResultClick={handleResultClick}
          showResults={showResults}
          t={t}
        />

        <div
          className="bg-[rgb(228,228,228)] rounded-[23px] w-full max-w-[1400px] mx-auto mb-5 md:mb-7 overflow-hidden relative aspect-[970/250]"
          role="region"
          aria-label={t("carousel.ariaLabel", "Рекламный баннер")}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full h-full relative aspect-[970/250]">
            <Image
              src={MyProfiBanner}
              alt={t("carousel.bannerAlt", "MyProfi Banner")}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-[23px]"
              onError={() => setImageError(true)}
              priority
            />
            {imageError && (
              <div className="text-xl md:text-2xl font-light text-black absolute top-1/2 left-0 -translate-y-1/2 w-full text-center opacity-100 transition-opacity duration-500">
                {t("errors.imageError", "Ошибка загрузки изображения")}
              </div>
            )}
          </div>
        </div>

        {mode === 'specialist' && (
          <div className="bg-gradient-to-br from-[#3ea240] to-[#218838] text-white py-12 md:py-16 px-8 md:px-9 rounded-3xl my-10 max-w-[1400px] w-full text-center">
            <h2 className="text-3xl md:text-4xl mb-2.5 max-md:text-[1.8rem]">
              {t("specialist.registration.title", "Зарегистрируйтесь, чтобы зарабатывать")}
            </h2>
            <p className="text-lg md:text-xl mb-7 opacity-90 max-md:text-base">
              {t("specialist.registration.subtitle", "Создайте профиль специалиста и получайте заказы от клиентов")}
            </p>
            <div className="inline-flex items-center bg-white/20 py-2.5 px-5 rounded-[20px] mb-5 text-lg font-medium">
              {t("specialist.registration.stats", "143 × 19 заказов на платформе")}
            </div>
            <div className="flex justify-center gap-4 mt-5 flex-wrap max-md:flex-col max-md:items-center">
              <input
                placeholder={t("specialist.registration.emailPlaceholder", "Ваш email")}
                type="email"
                className="py-3 px-4 border-none rounded-lg text-base w-[200px] bg-white/90 text-black max-md:w-full max-md:max-w-[250px]"
              />
              <button className="py-3 px-6 bg-white text-[#3ea240] border-none rounded-lg text-base font-medium cursor-pointer transition-colors hover:bg-[#f0f0f0]">
                {t("specialist.registration.button", "Зарегистрироваться")}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 max-[800px]:grid-cols-2 gap-5 md:gap-4 max-md:gap-3 w-full max-w-[1400px] min-w-[320px] my-5 md:my-7 px-2 md:px-2.5 max-md:px-1 box-border overflow-x-hidden max-[800px]:grid-rows-2">
          {topSpecialtiesLinks.map((specialty, index) => (
            <SpecialtyCard
              key={index}
              specialty={specialty}
              onClick={() => handleSpecialtyClick(specialty.link)}
            />
          ))}
        </div>

        <div className="bg-white w-full max-w-[1400px] my-5 p-4 md:p-7 rounded-3xl min-w-[320px] relative overflow-hidden max-md:w-[90%]">
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-black mb-8 md:mb-10 text-left relative z-10 break-words max-w-[50%] max-md:max-w-full p-3 md:p-4 w-full mt-3">
              {texts.specialistsTitle}
            </h2>

            <div className="absolute md:top-14 right-8 md:right-6 max-md:right-7 bg-[#f2f3f7] text-[#676e7e] text-xs md:text-sm py-2 px-3 md:py-2.5 md:px-3.5 rounded-xl w-fit max-w-[35vw] max-md:max-w-[80vw] flex items-center justify-center whitespace-nowrap box-border shadow-sm">
              {texts.specialistsDescFull}
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start px-4 mb-5 justify-center overflow-hidden">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                subCategories={subCategories}
                getDisplayName={getDisplayName}
                onCategoryClick={handleCategoryClick}
                onSubCategoryClick={handleSubCategoryClick}
                onShowAllClick={handleShowAllClick}
                t={t}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto my-5 md:my-6 rounded-3xl bg-white flex justify-between items-start gap-6 md:gap-8 px-6 md:px-9 py-8 md:py-12 max-md:flex-col max-md:w-[90%] min-w-[320px] box-border">
          <div className="flex flex-col gap-3 md:gap-4 items-start text-left w-full max-w-[600px] p-3 md:p-4">
            <h3 className="font-semibold text-3xl md:text-3xl max-md:text-xl max-[480px]:text-lg leading-tight text-[#292c32]">
              {texts.requestTitle}
            </h3>

            <p className="font-medium text-sm md:text-base max-md:text-[0.9rem] max-[480px]:text-xs text-[#292c32] break-words">
              {texts.requestDesc}
            </p>

            <div className="flex items-center justify-center text-[15px] max-md:text-sm max-[480px]:text-[13px] font-medium text-[#676e7e] text-center bg-[#f2f3f7] rounded-lg w-full max-w-[400px] md:max-w-[500px] min-h-[32px] md:h-[34px] px-4 md:px-5 leading-snug whitespace-nowrap max-md:whitespace-normal">
              {texts.styledDescContent}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-[600px] h-auto relative box-border">
            <textarea
              aria-label={t("request.inputAriaLabel", "Опишите вашу задачу")}
              placeholder={texts.requestPlaceholder}
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_TEXT_LENGTH}
              className="w-full h-[120px] md:h-[130px] p-4 md:p-6 rounded-lg border-none text-sm md:text-base text-[#292c32] bg-[#f2f3f7] resize-none outline-none overflow-y-auto placeholder:text-[#a0a0a0]"
            />
            <span
              className={`absolute right-3 bottom-16 md:bottom-20 text-xs md:text-sm ${requestText.length === MAX_TEXT_LENGTH ? "text-red-500" : "text-gray-500"}`}
            >
              {requestText.length}/{MAX_TEXT_LENGTH}
            </span>

            <button className="w-full h-[46px] md:h-[50px] mt-2 md:mt-3 bg-[#3ea240] hover:bg-[#218838] text-white font-medium rounded-lg transition-colors text-sm md:text-base">
              {texts.requestButton}
            </button>
          </div>
        </div>

        <React.Suspense fallback={<div className="text-center py-10">{t("errors.loading", "Загрузка...")}</div>}>
          <ReviewsBlock reviews={reviews} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default memo(BannerClient);