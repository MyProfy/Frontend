"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FocusTrap from "focus-trap-react";
import { useTranslation } from "react-i18next";
import "../../lib/i18n";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
  UzFlag?: any;
  RusFlag?: any;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export default function LanguageModal({
  isOpen,
  onClose,
  onSelectLanguage,
  UzFlag,
  RusFlag,
}: LanguageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  // Закрытие по клику вне модалки
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Переключение языка
  const handleLanguageSelect = (language: "uz" | "ru") => {
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
    onSelectLanguage(language);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap active={isOpen}>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5"
          >
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] p-12 md:p-10 w-full max-w-[620px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative"
            >
              {/* Контейнер с языками */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Узбекский */}
                <motion.div
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 8px 24px rgba(62,162,62,0.15)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleLanguageSelect("uz")}
                  className="flex flex-col items-center justify-center bg-[#f2f3f7] hover:border-[#3ea240] border-2 border-transparent rounded-2xl p-8 md:p-10 w-full cursor-pointer transition-all"
                >
                  <div className="text-center text-lg md:text-xl font-semibold text-[#1f2937] leading-snug mb-6">
                    O&apos;zbek tilida
                    <br />
                    davom etish
                  </div>
                  <div className="w-[120px] h-[120px] md:w-[100px] md:h-[100px] rounded-full bg-[#f9fafb] flex items-center justify-center overflow-hidden">
                    {UzFlag ? (
                      <Image
                        src={UzFlag}
                        alt="Uzbekistan Flag"
                        width={80}
                        height={80}
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-[72px] md:text-[60px]">🇺🇿</div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 8px 24px rgba(62,162,62,0.15)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleLanguageSelect("ru")}
                  className="flex flex-col items-center justify-center bg-[#f2f3f7] hover:border-[#3ea240] border-2 border-transparent rounded-2xl p-8 md:p-10 w-full cursor-pointer transition-all"
                >
                  <div className="text-center text-lg md:text-xl font-semibold text-[#1f2937] leading-snug mb-6">
                    Продолжить на
                    <br />
                    русском языке
                  </div>
                  <div className="w-[120px] h-[120px] md:w-[100px] md:h-[100px] rounded-full bg-[#f9fafb] flex items-center justify-center overflow-hidden">
                    {RusFlag ? (
                      <Image
                        src={RusFlag}
                        alt="Russia Flag"
                        width={80}
                        height={80}
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-[72px] md:text-[60px]">🇷🇺</div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
}
