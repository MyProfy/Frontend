"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
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

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const HOVER_ANIMATION = {
  scale: 1.03,
  boxShadow: "0 8px 24px rgba(62,162,62,0.15)",
};

const TAP_ANIMATION = {
  scale: 0.97,
};

const LanguageCard = memo(({ 
  title, 
  flag, 
  flagAlt, 
  emoji, 
  onClick 
}: {
  title: string;
  flag?: any;
  flagAlt: string;
  emoji: string;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={HOVER_ANIMATION}
    whileTap={TAP_ANIMATION}
    onClick={onClick}
    className="flex flex-col items-center justify-center bg-[#f2f3f7] hover:border-[#3ea240] border-2 border-transparent rounded-2xl p-8 md:p-10 w-full cursor-pointer transition-all"
  >
    <div 
      className="text-center text-lg md:text-xl font-semibold text-[#1f2937] leading-snug mb-6"
      dangerouslySetInnerHTML={{ __html: title }}
    />
    <div className="w-[120px] h-[120px] md:w-[100px] md:h-[100px] rounded-full bg-[#f9fafb] flex items-center justify-center overflow-hidden">
      {flag ? (
        <Image
          src={flag}
          alt={flagAlt}
          width={80}
          height={80}
          className="object-contain"
          loading="lazy"
        />
      ) : (
        <div className="text-[72px] md:text-[60px]" role="img" aria-label={flagAlt}>
          {emoji}
        </div>
      )}
    </div>
  </motion.div>
));
LanguageCard.displayName = "LanguageCard";

const LanguageModal = ({
  isOpen,
  onClose,
  onSelectLanguage,
  UzFlag,
  RusFlag,
}: LanguageModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  const handleLanguageSelect = useCallback((language: "uz" | "ru") => {
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
    onSelectLanguage(language);
    onClose();
  }, [i18n, onSelectLanguage, onClose]);

  const handleUzbekClick = useCallback(() => {
    handleLanguageSelect("uz");
  }, [handleLanguageSelect]);

  const handleRussianClick = useCallback(() => {
    handleLanguageSelect("ru");
  }, [handleLanguageSelect]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <FocusTrap active={isOpen}>
        <motion.div
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="language-modal-title"
        >
          <motion.div
            ref={modalRef}
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[32px] p-12 md:p-10 w-full max-w-[620px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative"
          >
            <h2 id="language-modal-title" className="sr-only">
              Выберите язык / Tilni tanlang
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <LanguageCard
                title="O&apos;zbek tilida<br />davom etish"
                flag={UzFlag}
                flagAlt="Uzbekistan Flag"
                emoji="🇺🇿"
                onClick={handleUzbekClick}
              />

              <LanguageCard
                title="Продолжить на<br />русском языке"
                flag={RusFlag}
                flagAlt="Russia Flag"
                emoji="🇷🇺"
                onClick={handleRussianClick}
              />
            </div>
          </motion.div>
        </motion.div>
      </FocusTrap>
    </AnimatePresence>
  );
};

export default memo(LanguageModal);