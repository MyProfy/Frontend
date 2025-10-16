"use client";

import React, {useEffect, useRef, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useTranslation} from "react-i18next";
import FocusTrap from "focus-trap-react";
import {
  FiRss,
  FiClock,
  FiLayout,
  FiSearch,
  FiSmartphone,
  FiMessageSquare
} from "react-icons/fi";
import {FaSpinner} from "react-icons/fa";

const backdropVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
  exit: {opacity: 0},
};

const containerVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
  exit: {opacity: 0},
};

const itemVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
};

const buttonVariants = {
  hover: {boxShadow: "0 0 12px rgba(168, 239, 168, 0.7)"},
  tap: {scale: 0.95},
};

interface Update {
  id: number;
  title: string;
  description: string;
}

interface NewsProps {
  newAdditions: Update[];
  upcomingFeatures: Update[];
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const News: React.FC<NewsProps> = React.memo(
  ({newAdditions, upcomingFeatures, isLoading = false, isOpen, onClose}) => {
    const {t} = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (isOpen) {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        const preventTouchMove = (e: TouchEvent) => {
          if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            e.preventDefault();
          }
        };
        document.addEventListener("touchmove", preventTouchMove, {passive: false});
        
        return () => {
          const scrollYRestored = parseInt(document.body.style.top || "0") * -1;
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.width = "";
          window.scrollTo(0, scrollYRestored);
          document.removeEventListener("touchmove", preventTouchMove);
        };
      }
    }, [isOpen]);
    
    const [showModal, setShowModal] = useState<boolean>(false);
    
    useEffect(() => {
      const lastShown = localStorage.getItem("modalLastShown");
      const now = Date.now();

      if (!lastShown || now - Number(lastShown) > 60 * 60 * 1000) {
        setShowModal(true);
        localStorage.setItem("modalLastShown", String(now));
      }
    }, []);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
      }
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
        document.removeEventListener("keydown", handleEsc);
      };
    }, [isOpen, onClose]);
    
    const modalContent = {
      title: t("modal.title", "Добро пожаловать на MyProfi!"),
      subtitle: t("modal.subtitle", "Мы рады представить наши последние обновления."),
      welcomeMessage: t(
        "modal.welcomeMessage",
        "Спасибо, что вы с нами! Мы стараемся создать пространство, где вы можете найти лучших специалистов."
      ),
      version: {
        label: t("modal.version.label", "Версия проекта"),
        value: "0.00.01",
        releaseDate: "20.04.2025",
      },
      newAdditions: {
        title: t("modal.newAdditions.title", "Что нового:"),
      },
      upcomingFeatures: {
        title: t("modal.upcomingFeatures.title", "Скоро в релизе:"),
      },
      closeButton: t("modal.closeButton", "Перейти на сайт"),
      feedbackPrompt: t("modal.feedbackPrompt", "Ваши идеи сделают проект лучше! Предложите свои улучшения."),
      feedbackLink: t("modal.feedbackLink", "Отправить идеи"),
    };
    
    const defaultNewAdditions: Update[] = [
      {
        id: 1,
        title: "Новое оформление",
        description: "Обновлённый дизайн интерфейса для удобства пользователей.",
      },
      {
        id: 2,
        title: "Поиск специалистов",
        description: "Улучшенный поиск с фильтрами по региону и категории.",
      },
    ];
    
    const defaultUpcomingFeatures: Update[] = [
      {
        id: 1,
        title: "Мобильное приложение",
        description: "Скоро выйдет приложение для iOS и Android.",
      },
      {
        id: 2,
        title: "Чат с поддержкой",
        description: "Онлайн-чат для быстрой помощи пользователям.",
      },
    ];
    
    const additions = newAdditions.length > 0 ? newAdditions : defaultNewAdditions;
    const features = upcomingFeatures.length > 0 ? upcomingFeatures : defaultUpcomingFeatures;
    
    if (!isOpen) return null;
    
    return (
      <>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-[8px] z-[1000] flex justify-center items-center p-[23px]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            role="dialog"
            aria-labelledby="modal-title"
            data-testid="modal-overlay"
          >
            <FocusTrap focusTrapOptions={{allowOutsideClick: true}}>
              <motion.div
                ref={modalRef}
                className="bg-white rounded-[53.23px] p-7 w-full max-w-[610px] shadow-[0_6px_20px_rgba(0,0,0,0.25)] flex flex-col gap-[10px] font-sans relative max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:p-5 md:mx-2.5 md:max-h-[85vh] sm:p-[15px] sm:mx-[5px] sm:max-h-[80vh]"
                variants={containerVariants}
                data-testid="modal-container"
              >
                <AnimatePresence>
                  <motion.h2
                    className="m-0 mb-6 text-[1.44rem] bg-gradient-to-r from-gray-800 to-green-500 bg-clip-text text-transparent -translate-y-[12px] text-center font-semibold sm:text-[1.2rem]"
                    variants={itemVariants}
                    id="modal-title"
                  >
                    {modalContent.title}
                  </motion.h2>
                  <motion.h3
                    className="m-0 mb-6 text-[1.15rem] text-[#555] text-center -translate-y-[10px] font-normal sm:text-base"
                    variants={itemVariants}
                  >
                    {modalContent.subtitle}
                  </motion.h3>
                  <motion.p
                    className="text-[1.09rem] text-[#555] m-0 -translate-y-[5px] text-center"
                    variants={itemVariants}
                  >
                    {modalContent.welcomeMessage}
                  </motion.p>
                  {isLoading ? (
                    <motion.button
                      disabled
                      className="px-3 py-[12px] border-none rounded-[21.62px] text-[1.09rem] font-medium cursor-pointer bg-[#C8FFC8] text-black flex items-center justify-center gap-[7px] w-full mt-[45px] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed sm:text-sm sm:px-2.5 sm:py-[10px]"
                      variants={buttonVariants}
                    >
                      <FaSpinner className="animate-spin" size={19.8} />
                    </motion.button>
                  ) : (
                    <>
                      <hr className="border-none h-[1px] bg-gradient-to-r from-[#C8FFC8] to-[#A8EFA8] my-[19px] rounded-[21.62px]" />
                      <motion.div
                        className="flex flex-col gap-8 mb-6"
                        variants={itemVariants}
                      >
                        <motion.h3
                          className="text-[1.3915rem] font-medium bg-gradient-to-r from-gray-800 to-green-500 bg-clip-text text-transparent mb-0 flex items-center gap-[7px]"
                          variants={itemVariants}
                        >
                          <span className="inline-flex items-center text-[#34C759] -translate-y-[1px]">
                            <FiRss size={19.8} />
                          </span>{" "}
                          {modalContent.newAdditions.title}
                        </motion.h3>
                        {additions.map((item, index) => (
                          <motion.div
                            key={item.id}
                            className="flex flex-col gap-3"
                            variants={itemVariants}
                            transition={{delay: index * 0.15}}
                          >
                            <h4 className="text-[1.09rem] font-medium text-[#333] m-0 flex items-center gap-2">
                              <span className="inline-flex items-center text-[#34C759] -translate-y-[2px]">
                                {item.title === "Новое оформление" && <FiLayout size={19.8} />}
                                {item.title === "Поиск специалистов" && <FiSearch size={19.8} />}
                              </span>
                              {item.title}
                            </h4>
                            <p className="text-[0.98rem] text-[#555] m-0">{item.description}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                      <hr className="border-none h-[1px] bg-gradient-to-r from-[#C8FFC8] to-[#A8EFA8] my-[19px] rounded-[21.62px]" />
                      <motion.div
                        className="flex flex-col gap-8 mb-6"
                        variants={itemVariants}
                      >
                        <motion.h3
                          className="text-[1.3915rem] font-medium bg-gradient-to-r from-gray-800 to-green-500 bg-clip-text text-transparent mb-0 flex items-center gap-[7px]"
                          variants={itemVariants}
                        >
                          <span className="inline-flex items-center text-[#34C759] -translate-y-[1px]">
                            <FiClock size={19.8} />
                          </span>{" "}
                          {modalContent.upcomingFeatures.title}
                        </motion.h3>
                        {features.map((item, index) => (
                          <motion.div
                            key={item.id}
                            className="flex flex-col gap-3"
                            variants={itemVariants}
                            transition={{delay: index * 0.15}}
                          >
                            <h4 className="text-[1.09rem] font-medium text-[#333] m-0 flex items-center gap-2">
                              <span className="inline-flex items-center text-[#34C759] -translate-y-[2px]">
                                {item.title === "Мобильное приложение" && <FiSmartphone size={19.8} />}
                                {item.title === "Чат с поддержкой" && <FiMessageSquare size={19.8} />}
                              </span>
                              {item.title}
                            </h4>
                            <p className="text-[0.98rem] text-[#555] m-0">{item.description}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                      <motion.button
                        onClick={onClose}
                        className="px-3 py-[12px] border-none rounded-[21.62px] text-[1.09rem] font-medium cursor-pointer bg-[#C8FFC8] text-black flex items-center justify-center gap-[7px] w-full mt-[45px] transition-shadow duration-300 hover:not-disabled:bg-[#A8EFA8] hover:not-disabled:text-black hover:not-disabled:shadow-[0_0_10px_rgba(168,239,168,0.7)] disabled:opacity-60 disabled:cursor-not-allowed sm:text-sm sm:px-2.5 sm:py-[10px]"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        data-testid="modal-close-button"
                      >
                        {modalContent.closeButton}
                      </motion.button>
                      <motion.p
                        className="text-[0.98rem] text-[#777] text-center mt-5"
                        variants={itemVariants}
                      >
                        {modalContent.version.label}: {modalContent.version.value} ({modalContent.version.releaseDate})
                      </motion.p>
                      <motion.p
                        className="text-[0.98rem] text-[#777] text-center mt-5"
                        variants={itemVariants}
                      >
                        {modalContent.feedbackPrompt}{" "}
                        <a
                          href="/feedback"
                          className="text-[#48bb78] no-underline relative cursor-pointer after:content-[''] after:absolute after:w-full after:h-[2px] after:bottom-[-2px] after:left-0 after:bg-gradient-to-r after:from-[#C8FFC8] after:to-[#A8EFA8] after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left hover:text-[#2e7d32]"
                        >
                          {modalContent.feedbackLink}
                        </a>
                      </motion.p>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </FocusTrap>
          </motion.div>
        )}
      </>
    );
  }
);

export default News;