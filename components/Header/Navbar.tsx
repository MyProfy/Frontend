"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BsFire } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { initializeAuth } from "../../store/slices/authSlice";

import MyProfiLogo from "../../public/avatar/logo.svg";
import UzFlag from "../../public/🇺🇿.png";
import RusFlag from "../../public/🇷🇺.png";
import RegionModal from "../RegionModal/RegionModal";
import LanguageModal from "../LanguageModalProps/LanguageModalProps";
import AuthModal from "../RegisterModal/RegisterModal";

interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;
  };
}

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

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleLanguageSelect = (language: string) => {
    if (language === t('navbar.russian', "Русский язык")) {
      setLang(t('navbar.russian', "Русский язык"));
      setFlag(RusFlag);
      i18n.changeLanguage('ru');
    } else {
      setLang(t('navbar.uzbek', "Uzbek tilida"));
      setFlag(UzFlag);
      i18n.changeLanguage('uz');
    }
  };

  const handleRegionSelect = (selectedRegion: string) => {
    setRegion(selectedRegion);
    setShowRegionModal(false);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <nav className="flex justify-between items-center px-3 sm:px-6 py-2 bg-gray-50 text-gray-800 fixed top-0 left-0 w-full h-14 sm:h-16 z-50 shadow-sm">
        
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Image
            src={MyProfiLogo}
            alt={t('navbar.logoAlt', "MyProfy Logo")}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg cursor-pointer"
            onClick={() => router.push("/")}
            priority
          />
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800">
          <span className="text-green-600 text-sm sm:text-base flex items-center">
            <BsFire />
          </span>
          <span>{t('navbar.servicesCount', "Более 100 реальных услуг")}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 lg:gap-3">
          <button
            onClick={() => setShowLanguageModal(true)}
            className="bg-white border border-gray-300 rounded-lg px-2 lg:px-4 py-1.5 lg:py-2 text-gray-800 cursor-pointer text-xs lg:text-sm font-medium flex items-center gap-1.5 lg:gap-2 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 whitespace-nowrap"
          >
            <Image
              src={flag}
              alt={t('navbar.flagAlt', "flag")}
              className="w-4 h-4 lg:w-5 lg:h-5 object-cover rounded flex-shrink-0"
            />
            <span className="hidden lg:inline">{lang}</span>
            <span className="lg:hidden">{lang.split(' ')[0]}</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => router.push("/profile")}
              className="bg-gray-800 text-white px-3 lg:px-5 py-1.5 lg:py-2 border-none rounded-lg font-semibold cursor-pointer text-xs lg:text-sm transition-colors duration-200 hover:bg-gray-900 whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis"
            >
              {truncateText(user?.name || t('navbar.profile', "Профиль"), 10)}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-green-600 text-white px-3 lg:px-5 py-1.5 lg:py-2 border-none rounded-lg font-semibold cursor-pointer text-xs lg:text-sm transition-colors duration-200 hover:bg-green-700 whitespace-nowrap"
            >
              {t('navbar.login', "Войти")}
            </button>
          )}
        </div>

        <button
          className="sm:hidden border-none bg-transparent text-xl sm:text-2xl text-gray-800 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
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
          {truncateText(region, isMobile ? 15 : 20)}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
              onClick={() => setMobileOpen(false)}
            />

=            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[280px] xs:w-[320px] z-50 bg-white shadow-2xl flex flex-col sm:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Меню</h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Закрыть меню"
                >
                  <FiX className="text-xl text-gray-800" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <button
                  onClick={() => {
                    setShowRegionModal(true);
                    setMobileOpen(false);
                  }}
                  className="w-full bg-green-50 text-green-700 font-semibold py-3 px-4 rounded-lg border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm">{truncateText(region, 25)}</span>
                </button>

                <button
                  onClick={() => {
                    setShowLanguageModal(true);
                    setMobileOpen(false);
                  }}
                  className="w-full bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm flex items-center gap-2">
                    <Image
                      src={flag}
                      alt="flag"
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

                <div className="pt-2">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setMobileOpen(false);
                      }}
                      className="w-full bg-gray-800 text-white px-5 py-3 border-none rounded-lg font-semibold cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-900"
                    >
                      {user?.name || t('navbar.profile', "Профиль")}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 border-none rounded-lg font-semibold cursor-pointer text-sm transition-all duration-200 hover:shadow-lg"
                    >
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
        )}
      </AnimatePresence>

      <RegionModal
        isOpen={showRegionModal}
        onCloseAction={() => setShowRegionModal(false)}
        onSelectAction={handleRegionSelect}
      />

      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelectLanguage={handleLanguageSelect}
        UzFlag={UzFlag}
        RusFlag={RusFlag}
      />

      <AuthModal
        isOpen={showAuthModal}
        onCloseAction={() => setShowAuthModal(false)}
      />
    </>
  );
}