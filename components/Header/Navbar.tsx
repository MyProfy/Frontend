"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BsFire } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import MyProfiLogo from "../../public/avatar/logo.svg";
import UzFlag from "../../public/🇺🇿.png";
import RusFlag from "../../public/🇷🇺.png";
import RegionModal from "../RegionModal/RegionModal";
import LanguageModal from "../LanguageModalProps/LanguageModalProps";
import AuthModal from "../../components/RegisterModal/RegisterModal";

export default function Navbar() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [lang, setLang] = useState(t('navbar.uzbek', "Uzbek tilida"));
  const [flag, setFlag] = useState(UzFlag);
  const [region, setRegion] = useState(t('navbar.selectRegion', "Выберите свой регион"));
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setIsLoggedIn(true);
  }, []);

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

  const handleRegionSelect = (selectedRegion: string) => setRegion(selectedRegion);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-2.5 bg-gray-50 text-gray-800 fixed top-0 left-0 w-full h-16 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Image
            src={MyProfiLogo}
            alt={t('navbar.logoAlt', "MyProfy Logo")}
            className="w-20 h-20 object-contain rounded-lg cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>

        <div className="hidden sm:flex items-center gap-1.5 pl-25 text-sm font-semibold text-gray-800">
          <span className="text-green-600 text-base flex items-center">
            <BsFire />
          </span>
          <span>{t('navbar.servicesCount', "Более 100 реальных услуг")}</span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setShowLanguageModal(true)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 cursor-pointer text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400"
          >
            <Image
              src={flag}
              alt={t('navbar.flagAlt', "flag")}
              className="w-5 h-5 object-cover rounded"
            />
            {lang}
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => router.push("/profile")}
              className="bg-gray-800 text-white px-5 py-2 border-none rounded-lg font-semibold cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-900"
            >
              {t('navbar.profile', "Профиль")}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-green-600 text-white px-5 py-2 border-none rounded-lg font-semibold cursor-pointer text-sm transition-colors duration-200 hover:bg-green-700"
            >
              {t('navbar.login', "Войти")}
            </button>
          )}
        </div>

        <button
          className="sm:hidden border-none bg-transparent text-2xl text-gray-800 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      <div className="fixed top-16 left-32 w-full z-40">
        <div className="w-48 h-[29px] flex">
          <button
            onClick={() => setShowRegionModal(true)}
            className="bg-[#3EA240] text-white font-semibold text-sm border-none rounded-b-lg px-3 py-1 cursor-pointer transition-all duration-200 hover:bg-green-700 w-full"
          >
            {region}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 w-full z-40 bg-gray-50 py-4 flex flex-col items-center gap-3 shadow-md"
          >
            <button
              className="text-sm text-green-700 font-semibold py-2"
              onClick={() => {
                setShowRegionModal(true);
                setMobileOpen(false);
              }}
            >
              {region}
            </button>

         <button
              className="text-sm text-gray-700 py-2"
              onClick={() => {
                setShowLanguageModal(true);
                setMobileOpen(false);
              }}
            >
              {lang}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  router.push("/profile");
                  setMobileOpen(false);
                }}
                className="bg-gray-800 text-white px-5 py-2 border-none rounded-lg font-semibold cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-900"
              >
                {t('navbar.profile', "Профиль")}
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setMobileOpen(false);
                }}
                className="bg-[#3EA240] text-white px-5 py-2 border-none rounded-lg font-semibold cursor-pointer text-sm transition-colors duration-200 hover:bg-green-700"
              >
                {t('navbar.login', "Войти")}
              </button>
            )}
          </motion.div>
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
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}