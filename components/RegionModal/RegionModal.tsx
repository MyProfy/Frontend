"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import FocusTrap from "focus-trap-react";
import Image from "next/image";
import LogoMyProfi from "@/public/MyProfyLogo.png";

interface RegionModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSelectAction: (region: string) => void;
}

export default function RegionModal({
  isOpen,
  onCloseAction,
  onSelectAction,
}: RegionModalProps) {
  const { t } = useTranslation();
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const regions = [
    "Ташкент",
    "Андижан",
    "Бухара",
    "Фергана",
    "Джизак",
    "Наманган",
    "Навои",
    "Кашкадарья",
    "Самарканд",
    "Сырдарья",
    "Сурхандарья",
    "Хорезм",
    "Каракалпакстан",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onCloseAction]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseAction();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCloseAction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!region) {
      setError(t("register.errors.emptyRegion"));
      return;
    }
    setIsLoading(true);
    onSelectAction(region);
    setIsLoading(false);
    onCloseAction();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap active={isOpen}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl w-full max-w-md p-6 md:p-8 shadow-xl relative"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={LogoMyProfi}
                  alt="MyProfi Logo"
                  width={46}
                  height={46}
                  className="mb-6"
                />

                <motion.h2
                  className="text-xl font-semibold text-gray-800 mb-5 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {t("regionModal.title")}
                </motion.h2>

                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                    >
                      <option value="">
                        {t("regionModal.regionPlaceholder")}
                      </option>
                      {regions.map((reg) => (
                        <option key={reg} value={reg}>
                          {t(`register.regions.${reg}`)}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {error && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm text-center mt-1"
                    >
                      {error}
                    </motion.span>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 rounded-md py-2 text-white font-medium transition-all ${
                      isLoading
                        ? "bg-green-400 opacity-70 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-400 hover:text-black"
                    }`}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin text-lg" />
                    ) : (
                      <>
                        <FaMapMarkerAlt />
                        {t("regionModal.submit")}
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
}
