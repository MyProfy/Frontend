"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import Image from "next/image";
import FocusTrap from "focus-trap-react";
import { useTranslation } from "react-i18next";
import "../../lib/i18n";

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: #FFFFFF;
  border-radius: 32px;
  padding: 48px 32px 32px;
  width: 100%;
  max-width: 620px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  
  @media (max-width: 768px) {
    max-width: 90%;
    padding: 40px 24px 24px;
    border-radius: 24px;
  }
`;

const LanguageContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const LanguageOption = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F2F3F7;
  gap: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  padding: 48px 32px;
  border-radius: 16px;
  border: 2px solid transparent;
  
  &:hover {
    border-color: #3ea240;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(62, 162, 62, 0.15);
  }
    
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 40px 24px;
    gap: 24px;
  }
`;

const LanguageText = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FlagContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  overflow: hidden;
  transition: transform 0.2s ease;
  
  ${LanguageOption}:hover & {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const FlagEmoji = styled.div`
  font-size: 82px;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 60px;
  }
`;

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 } 
  },
};

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
  UzFlag?: any;
  RusFlag?: any;
}

export default function LanguageModal({
  isOpen,
  onClose,
  onSelectLanguage,
  UzFlag,
  RusFlag,
}: LanguageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleLanguageSelect = (language: string) => {
    const lng = language === "Русский" ? "ru" : "uz";
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    onSelectLanguage(language);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap active={isOpen}>
          <ModalBackdrop
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            onClick={onClose}
          >
            <ModalContainer 
              ref={modalRef} 
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <LanguageContainer>
                <LanguageOption
                  onClick={() => handleLanguageSelect("Uzbek tilida")}
                  whileTap={{ scale: 0.98 }}
                >
                  <LanguageText>
                    O'zbek tilida
                    <br />
                    davom etish
                  </LanguageText>
                  <FlagContainer>
                    {UzFlag ? (
                      <Image
                        src={UzFlag}
                        alt="Uzbekistan Flag"
                        width={80}
                        height={80}
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <FlagEmoji>🇺🇿</FlagEmoji>
                    )}
                  </FlagContainer>
                </LanguageOption>

                <LanguageOption
                  onClick={() => handleLanguageSelect("Русский")}
                  whileTap={{ scale: 0.98 }}
                >
                  <LanguageText>
                    Продолжить на
                    <br />
                    русском языке
                  </LanguageText>
                  <FlagContainer>
                    {RusFlag ? (
                      <Image
                        src={RusFlag}
                        alt="Russia Flag"
                        width={80}
                        height={80}
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <FlagEmoji>🇷🇺</FlagEmoji>
                    )}
                  </FlagContainer>
                </LanguageOption>
              </LanguageContainer>
            </ModalContainer>
          </ModalBackdrop>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
}