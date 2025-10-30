"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BsFire } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { initializeAuth, logout } from "../../store/slices/authSlice";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

import MyProfiLogo from "../../public/avatar/logo.svg";
import UzFlag from "../../public/🇺🇿.png";
import RusFlag from "../../public/🇷🇺.png";

const RegionModal = React.lazy(() => import("../RegionModal/RegionModal"));
const LanguageModal = React.lazy(() => import("../LanguageModalProps/LanguageModalProps"));
const AuthModal = React.lazy(() => import("../RegisterModal/RegisterModal"));

interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;
  };
}

const LanguageButton = memo(({ onClick, flag, lang }: any) => (
  <button
    onClick={onClick}
    className="bg-white border border-gray-300 rounded-lg px-2 lg:px-4 py-1.5 lg:py-2 text-gray-800 cursor-pointer text-xs lg:text-sm font-medium flex items-center gap-1.5 lg:gap-2 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 whitespace-nowrap"
  >
    <Image
      src={flag}
      alt="flag"
      width={20}
      height={20}
      className="w-4 h-4 lg:w-5 lg:h-5 object-cover rounded flex-shrink-0"
    />
    <span className="hidden lg:inline">{lang}</span>
    <span className="lg:hidden">{lang.split(' ')[0]}</span>
  </button>
));
LanguageButton.displayName = "LanguageButton";

const ProfileButton = memo(({ isAuthenticated, onProfileClick, onLoginClick, onLogoutClick, t }: any) => (
  isAuthenticated ? (
    <div className="relative group">
      <button
        onClick={onProfileClick}
        className="bg-green-600 text-white px-3 py-2 lg:py-2 border-none rounded-lg font-semibold cursor-pointer text-xs lg:text-sm transition-colors duration-200 hover:bg-green-700 whitespace-nowrap flex items-center justify-center"
      >
        <FaUser className="size-5" />
      </button>
      
      <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={onLogoutClick}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="text-red-500" />
          {t('navbar.logout', "Выйти")}
        </button>
      </div>
    </div>
  ) : (
    <button
      onClick={onLoginClick}
      className="bg-green-600 text-white px-3 lg:px-5 py-1.5 lg:py-2 border-none rounded-lg font-semibold cursor-pointer text-xs lg:text-sm transition-colors duration-200 hover:bg-green-700 whitespace-nowrap"
    >
      {t('navbar.login', "Войти")}
    </button>
  )
));
ProfileButton.displayName = "ProfileButton";

const MobileMenu = memo(({
  onClose,
  region,
  flag,
  lang,
  isAuthenticated,
  userName,
  onRegionClick,
  onLanguageClick,
  onProfileClick,
  onLoginClick,
  onLogoutClick,
  t
}: any) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
      onClick={onClose}
    />

    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed top-0 right-0 h-full w-[280px] xs:w-[320px] z-50 bg-white shadow-2xl flex flex-col sm:hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">Меню</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Закрыть меню"
        >
          <FiX className="text-xl text-gray-800" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <button
          onClick={onRegionClick}
          className="w-full bg-green-50 text-green-700 font-semibold py-3 px-4 rounded-lg border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-between"
        >
          <span className="text-sm">{region}</span>
        </button>

        <button
          onClick={onLanguageClick}
          className="w-full bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <span className="text-sm flex items-center gap-2">
            <Image
              src={flag}
              alt="flag"
              width={20}
              height={20}
              className="w-5 h-5 object-cover rounded"
            />
            {lang}
          </span>
        </button>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-700">
            <BsFire className="text-lg" />
            <span className="text-sm font-semibold">
              {t('navbar.servicesCount', "Более 100 реальных услуг")}
            </span>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={onProfileClick}
                className="w-full bg-gray-800 text-white px-5 py-3 border-none rounded-lg font-semibold cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-900 flex items-center justify-center gap-2"
              >
                <FaUser className="text-white" />
                {userName || t('navbar.profile', "Профиль")}
              </button>
              <button
                onClick={onLogoutClick}
                className="w-full bg-red-600 text-white px-5 py-3 border-none rounded-lg font-semibold cursor-pointer text-sm transition-colors duration-200 hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <FaSignOutAlt />
                {t('navbar.logout', "Выйти")}
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 border-none rounded-lg font-semibold cursor-pointer text-sm transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FaUser className="text-white" />
              {t('navbar.login', "Войти")} →
            </button>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          MyProfy © 2025
        </p>
      </div>
    </motion.div>
  </>
));
MobileMenu.displayName = "MobileMenu";

export default function Navbar() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [lang, setLang] = useState(t('navbar.uzbek', "Uzbek tilida"));
  const [flag, setFlag] = useState(UzFlag);
  const [region, setRegion] = useState(t('navbar.selectRegion', "Выберите регион"));
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getCurrentLanguageData = useCallback(() => {
    const currentLanguage = i18n.language || 'uz';

    if (currentLanguage === 'ru') {
      return {
        lang: "Русский язык",
        flag: RusFlag
      };
    } else {
      return {
        lang: "Uzbek tilida",
        flag: UzFlag
      };
    }
  }, [i18n.language]);

  useEffect(() => {
    const languageData = getCurrentLanguageData();
    setLang(languageData.lang);
    setFlag(languageData.flag);
  }, [i18n.language, getCurrentLanguageData]);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 150);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleLanguageSelect = useCallback((language: string) => {
    if (language === "ru") {
      i18n.changeLanguage("ru");
    } else {
      i18n.changeLanguage("uz");
    }
    setShowLanguageModal(false);
  }, [i18n]);

  const handleRegionSelect = useCallback((selectedRegion: string) => {
    setRegion(selectedRegion);
    setShowRegionModal(false);
  }, []);

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
    setMobileOpen(false);
  }, [router]);

  const handleLoginClick = useCallback(() => {
    setShowAuthModal(true);
    setMobileOpen(false);
  }, []);

  const handleRegionClick = useCallback(() => {
    setShowRegionModal(true);
    setMobileOpen(false);
  }, []);

  const handleLanguageClick = useCallback(() => {
    setShowLanguageModal(true);
    setMobileOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    
    if (!window.confirm(t('navbar.logoutConfirm', "Вы уверены, что хотите выйти?"))) {
      return;
    }

    try {
      setIsLoggingOut(true);
      console.log("🚪 Выход из системы...");

      // Диспатчим действие логаута в Redux
      dispatch(logout());

      // Закрываем мобильное меню если открыто
      setMobileOpen(false);

      // Перенаправляем на главную страницу
      router.push("/");
      
      console.log("✅ Успешный выход из системы");
    } catch (error) {
      console.error("❌ Ошибка при выходе из системы:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, router, isLoggingOut, t]);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const truncatedUserName = useMemo(() => {
    if (!user?.name) return t('navbar.profile', "Профиль");
    return user.name.length <= 10 ? user.name : user.name.substring(0, 10) + '...';
  }, [user?.name, t]);

  const truncatedRegion = useMemo(() => {
    const maxLength = isMobile ? 15 : 20;
    return region.length <= maxLength ? region : region.substring(0, maxLength) + '...';
  }, [region, isMobile]);

  return (
    <>
      <nav className="flex justify-between items-center px-3 sm:px-6 py-2 bg-gray-50 text-gray-800 fixed top-0 left-0 w-full h-14 sm:h-16 z-50 shadow-sm">

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Image
            src={MyProfiLogo}
            alt={t('navbar.logoAlt', "MyProfy Logo")}
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg cursor-pointer"
            onClick={() => router.push("/")}
            priority
          />
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800">
          <BsFire className="text-green-600 text-sm sm:text-base" />
          <span>{t('navbar.servicesCount', "Более 100 реальных услуг")}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 lg:gap-3">
          <LanguageButton
            onClick={() => setShowLanguageModal(true)}
            flag={flag}
            lang={lang}
          />

          <ProfileButton
            isAuthenticated={isAuthenticated}
            onProfileClick={handleProfileClick}
            onLoginClick={() => setShowAuthModal(true)}
            onLogoutClick={handleLogout}
            t={t}
          />
        </div>

        <button
          className="sm:hidden border-none bg-transparent text-xl sm:text-2xl text-gray-800 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={toggleMobileMenu}
          aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      <div className="hidden sm:block fixed top-14 sm:top-16 left-4 sm:left-8 lg:left-32 w-auto z-40">
        <button
          onClick={() => setShowRegionModal(true)}
          className="bg-[#3EA240] text-white font-semibold text-xs sm:text-sm border-none rounded-b-lg px-3 py-1.5 cursor-pointer transition-all duration-200 hover:bg-green-700 whitespace-nowrap shadow-md"
        >
          {truncatedRegion}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            onClose={() => setMobileOpen(false)}
            region={truncatedRegion}
            flag={flag}
            lang={lang}
            isAuthenticated={isAuthenticated}
            userName={user?.name}
            onRegionClick={handleRegionClick}
            onLanguageClick={handleLanguageClick}
            onProfileClick={handleProfileClick}
            onLoginClick={handleLoginClick}
            onLogoutClick={handleLogout}
            t={t}
          />
        )}
      </AnimatePresence>

      <React.Suspense fallback={null}>
        {showRegionModal && (
          <RegionModal
            isOpen={showRegionModal}
            onCloseAction={() => setShowRegionModal(false)}
            onSelectAction={handleRegionSelect}
          />
        )}

        {showLanguageModal && (
          <LanguageModal
            isOpen={showLanguageModal}
            onClose={() => setShowLanguageModal(false)}
            onSelectLanguage={handleLanguageSelect}
            UzFlag={UzFlag}
            RusFlag={RusFlag}
          />
        )}

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onCloseAction={() => setShowAuthModal(false)}
          />
        )}
      </React.Suspense>
    </>
  );
}