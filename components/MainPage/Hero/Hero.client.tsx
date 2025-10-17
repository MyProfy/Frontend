"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { getAPIClient } from "../../types/apiClient";
import { Category, Reklama, Service, SubCategory } from "../../types/apiTypes";
import ReviewsBlock from "components/ReviewsBlock/ReviewsBlock";
import { motion } from "framer-motion";
import MyProfiBanner from "../../../public/Banner-MyProfi.png";
import Image from "next/image";
import Navbar from "@/components/Header/Navbar";
import { FaFireFlameCurved } from "react-icons/fa6";
import { BsFillLightningFill } from "react-icons/bs";
import Link from "next/link";

interface BannerClientProps {
  initialSlide?: number;
}

export default function BannerClient({ initialSlide = 1 }: BannerClientProps) {
  const { language } = useContext(LanguageContext);
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const apiClient = useMemo(() => getAPIClient(), []);

  const [mode, setMode] = useState<'client' | 'specialist'>('client');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [totalServices, setTotalServices] = useState<number>(0);
  const [reklamaData, setReklamaData] = useState<Reklama[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(initialSlide);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [requestText, setRequestText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);
  const [errorTimerExpired, setErrorTimerExpired] = useState<boolean>(false);

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

  const validReklama = useMemo(() => {
    const today = new Date();
    return reklamaData.filter((rek) => {
      const startDate = new Date(rek.start_date);
      const endDate = new Date(rek.end_date);
      return startDate <= today && today <= endDate;
    });
  }, [reklamaData]);

  const topSpecialties = useMemo(
    () => [
      {
        name: t("topSpecialties.tutors", "Образование"),
        image: "/avatar/logologo.png",
        link: "https://myprofy.uz/search?category=1"

      },
      {
        name: t("topSpecialties.repair", "Ремонт бытовой техники"),
        image: "/avatar/logologo.png",
        link: "https://myprofy.uz/search?category=67"
      },
      {
        name: t("topSpecialties.construction", "Строительство"),
        image: "/avatar/logologo.png",
        link: "https://myprofy.uz/search?category=2"

      },
      {
        name: t("topSpecialties.makeup", "Красота"),
        image: "/avatar/logologo.png",
        link: "https://myprofy.uz/search?category=14"
      },
    ],
    [t]
  );

  const topSpecialtiesLinks = useMemo(() =>
    topSpecialties.map(s => ({
      ...s,
      link: mode === 'client'
        ? `/search?category=${s.link}`
        : `/register-specialist?category=${s.link}`
    })),
    [topSpecialties, mode]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => document.removeEventListener("touchmove", handleTouchMove);
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

        setReklamaData([]);

        const extractResults = (data: any) => {
          if (Array.isArray(data)) return data;
          if (data && 'results' in data) return data.results || [];
          return [];
        };

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
  }, [apiClient, t, i18n]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const allowedKeys = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
      "Tab", "Enter", "Escape", "Home", "End", "PageUp", "PageDown"
    ];

    if (requestText.length >= 250 && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSpecialtyClick = (link: string) => {
    router.push(link);
  };

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/vacancies?category=${categoryId}`);
  };

  const handleSubCategoryClick = (subCategoryId: number, categoryId: number) => {
    router.push(`/vacancies?category=${categoryId}&subcategory=${subCategoryId}`);
  };

  const handleShowAllClick = (categoryId: number) => {
    router.push(`/vacancies?category=${categoryId}`);
  };

  const getDisplayName = (item: Category | SubCategory) => {
    if (language === "ru" && item.display_ru) return item.display_ru;
    if (language === "uz" && item.display_uz) return item.display_uz;
    return item.name;
  };


  const mainTitle = mode === 'client'
    ? t("hero.title", "Найдите надежного специалиста")
    : t("hero.titleSpecialist", "Станьте специалистом и зарабатывайте");

  const specialistsTitle = mode === 'client'
    ? t("specialists.title", "Специалисты по категориям")
    : t("specialists. ", "Популярные категории для специалистов");

  const specialistsDescFull = `5 ${mode === 'client'
    ? t("specialists.description", "минут на заказ")
    : t("specialists.descriptionSpecialist", "минут на регистрацию")}`;

  const requestTitle = mode === 'client'
    ? t("request.title", "Опишите вашу задачу")
    : t("request.titleSpecialist", "Расскажите о своих услугах");

  const requestDesc = mode === 'client'
    ? t("request.description", "Расскажите, что нужно сделать, и получите отклики от специалистов")
    : t("request.descriptionSpecialist", "Опишите, чем вы занимаетесь, и мы поможем найти клиентов");

  const requestPlaceholder = mode === 'client'
    ? t("request.inputPlaceholder", "Например: 'Нужно починить кран на кухне'")
    : t("request.inputPlaceholderSpecialist", "Например: 'Я ремонтирую квартиры в Ташкенте'");

  const requestButton = mode === 'client'
    ? t("request.button", "Найти специалиста")
    : t("request.buttonSpecialist", "Создать профиль");

  const styledDescContent = mode === 'client'
    ? t("request.statsClient", "Из 1 233 333 специалистов обязательно найдется тот кто поможет")
    : t("request.statsSpecialist", "Из 1 233 333 заказов обязательно найдется тот, кто оценит ваши услуги");

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
    <div className="bg-gray-100 mt-[60px] ">
      <Navbar />

      <div className="px-5 py-10 m d:px-7 lg:px-8 flex flex-col items-center text-center w-full box-border overflow-hidden max-w-[1440px] mx-auto">
        <div className="flex justify-center items-center w-full mb-8">
          <h1 className="text-2xl md:text-3xl font-normal text-black w-full max-w-[600px] text-center p-3">
            {mainTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 w-full mb-10">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="bg-[#3ea23e] border-none text-base md:text-[0.98rem] font-normal text-white py-3 px-4 cursor-pointer rounded-lg transition-all hover:bg-[#2e8b57]"
          >
            {t("search.search", "Найти")}
          </motion.button>
        </div>

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
            />
            {imageError && errorTimerExpired && (
              <div className="text-xl md:text-2xl font-light text-black absolute top-1/2 left-0 -translate-y-1/2 w-full text-center opacity-100 transition-opacity duration-500">
                {t("errors.imageError", "Ошибка загрузки изображения")}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center mt-50 fixed  bg-[#C9C9C966] py-2 px-4 rounded-xl z-50">
          <button className="flex items-center gap-2 bg-black text-white text-base md:text-[0.98rem] font-normal py-3 px-4 rounded-l-xl transition-all hover:bg-[#222] cursor-pointer">
            <FaFireFlameCurved className="text-lg" />
            Найти специалиста
          </button>

          <Link href="/VacanciesCategory/Vacancies">
            <button className="flex gap-2 bg-[#292B2FBF] text-white text-base md:text-[0.98rem] font-normal py-3 px-4 rounded-r-xl transition-all hover:bg-[#333539bf] cursor-pointer">
              <BsFillLightningFill className="text-lg mt-0.5" />
              Найти клиентов
            </button>
          </Link>

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
            <div key={index} className="flex flex-col items-center my-2 md:my-4 max-[930px]:my-2 p-4 max-[930px]:p-2 bg-white rounded-[18px] box-border">
              <div
                className="bg-[#f5f5f5] rounded-[10px] w-full aspect-square flex items-center justify-center text-center cursor-pointer box-border transition-transform hover:scale-105"
                onClick={() => handleSpecialtyClick(specialty.link)}
              >
                <img
                  src={specialty.image}
                  alt={specialty.name}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <h3 className="text-lg md:text-xl max-md:text-base font-normal text-black mt-2.5 mb-0 text-center break-words p-3 md:p-4">
                {specialty.name}
              </h3>
            </div>
          ))}
        </div>

        <div className="bg-white w-full max-w-[1400px] my-5 p-4 md:p-7 rounded-3xl min-w-[320px] relative overflow-hidden max-md:w-[90%]">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-8 md:mb-32 text-left relative z-10 break-words max-w-[50%] max-md:max-w-full p-3 md:p-4 w-full mt-3">
            {specialistsTitle}
          </h2>

          <div className="absolute md:top-14 right-8 md:right-6 max-md:right-7 bg-[#f2f3f7] text-[#676e7e] text-xs md:text-sm py-2 px-3 md:py-2.5 md:px-3.5 rounded-xl w-fit max-w-[35vw] max-md:max-w-[80vw] flex items-center justify-center whitespace-nowrap box-border shadow-sm">
            {specialistsDescFull}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start px-4 mb-5 justify-center overflow-hidden">
            {categories.map((category) => {
              const subCategoryCount = subCategories.filter((sub) => {
                const categoryId = typeof sub.category === "number" ? sub.category : sub.category.id;
                return categoryId === category.id;
              }).length;

              return (
                <div
                  key={category.id}
                  className="flex flex-col gap-3 text-left break-words"
                >
                  <div className="flex items-center">
                    <h3
                      onClick={() => handleCategoryClick(category.id)}
                      className="text-base md:text-lg font-semibold text-[#292c32] cursor-pointer hover:text-[#87e087] transition-colors truncate"
                    >
                      {getDisplayName(category)}
                    </h3>
                    <p className="text-sm md:text-lg text-[#858b98] ml-2 hidden md:inline-block">
                      {(category.service_count ?? 0) < 50 ? 50 : category.service_count ?? 0}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-2 text-[#303030] font-normal">
                    {subCategories
                      .filter((sub) => {
                        const categoryId = typeof sub.category === "number" ? sub.category : sub.category.id;
                        return categoryId === category.id;
                      })
                      .slice(0, 5)
                      .map((subCategory) => (
                        // <Link href="../../specialists/[id]" as={`../specialists/${subCategory.>
                          <li
                            key={subCategory.id}
                            className="text-sm md:text-base text-[#303030] cursor-pointer hover:text-[#87e087] transition-colors truncate"
                          >
                            {getDisplayName(subCategory)}
                          </li>
                        // </Link>
                      ))}
                  </ul>

                  <button
                    onClick={() => handleShowAllClick(category.id)}
                    className="text-xs md:text-sm text-black underline cursor-pointer hover:text-[#87e087] transition-colors mt-2 w-fit"
                  >
                    {t("specialists.showAll", "Показать все")} ({subCategoryCount})
                  </button>
                </div>
              );
            })}
          </div>
        </div>


        <div className="w-full max-w-[1400px] mx-auto my-5 md:my-6 rounded-3xl bg-white flex justify-between items-start gap-6 md:gap-8 px-6 md:px-9 py-8 md:py-12 max-md:flex-col max-md:w-[90%] min-w-[320px] box-border">
          <div className="flex flex-col gap-3 md:gap-4 items-start text-left w-full max-w-[600px] p-3 md:p-4">
            <h3 className="font-semibold text-3xl md:text-3xl max-md:text-xl max-[480px]:text-lg leading-tight text-[#292c32]">
              {requestTitle}
            </h3>

            <p className="font-medium text-sm md:text-base max-md:text-[0.9rem] max-[480px]:text-xs text-[#292c32] break-words">
              {requestDesc}
            </p>

            <div
              className="
        flex items-center justify-center
        text-[15px] max-md:text-sm max-[480px]:text-[13px]
        font-medium text-[#676e7e] text-center
        bg-[#f2f3f7] rounded-lg
        w-full max-w-[400px] md:max-w-[500px]
        min-h-[32px] md:h-[34px]
        px-4 md:px-5
        leading-snug
        whitespace-nowrap max-md:whitespace-normal
      "
            >
              {styledDescContent}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-[600px] h-auto relative box-border">
            <textarea
              aria-label={t("request.inputAriaLabel", "Опишите вашу задачу")}
              placeholder={requestPlaceholder}
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={250}
              className="
        w-full h-[120px] md:h-[130px]
        p-4 md:p-6
        rounded-lg border-none
        text-sm md:text-base text-[#292c32]
        bg-[#f2f3f7] resize-none outline-none
        overflow-y-auto placeholder:text-[#a0a0a0]
      "
            />
            <span
              className={` absolute right-3 bottom-16 md:bottom-20 text-xs md:text-sm ${requestText.length === 250 ? "text-red-500" : "text-gray-500"}`}
            >
              {requestText.length}/250
            </span>

            <button
              className="
        w-full h-[46px] md:h-[50px]
        mt-2 md:mt-3
        bg-[#3ea240] hover:bg-[#218838]
        text-white font-medium
        rounded-lg transition-colors
        text-sm md:text-base
      "
            >
              {requestButton}
            </button>
          </div>
        </div>


        <ReviewsBlock reviews={reviews} />
      </div>
    </div>
  );
}