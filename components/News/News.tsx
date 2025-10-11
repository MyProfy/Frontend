"use client";

import React, {useEffect, useRef} from "react";
import styled from "@emotion/styled";
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
import {useState} from "react";

// Styles
const ModalBackdrop = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 23px;
`;

const ModalContainer = styled(motion.div)`
	background: #ffffff;
	border-radius: 53.23px;
	padding: 28px;
	width: 100%;
	max-width: 610px;
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
	display: flex;
	flex-direction: column;
	gap: 10px;
	font-family: -apple-system, BlinkMacSystemFont, sans-serif;
	position: relative;
	max-height: 90vh;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: none; /* Firefox */
	
	&::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Edge */
	}
	
	@media (max-width: 768px) {
		padding: 20px;
		margin: 10px;
		max-height: 85vh;
	}
	
	@media (max-width: 480px) {
		padding: 15px;
		margin: 5px;
		max-height: 80vh;
	}
`;


const ModalTitle = styled(motion.h2)`
	margin: 0 0 24px;
	font-size: 1.44rem;
	background: linear-gradient(to right, #333, #48bb78);
	-webkit-background-clip: text;
	background-clip: text;
	transform: translateY(12px);
	color: transparent;
	text-align: center;
	font-weight: 600;
	
	@media (max-width: 480px) {
		font-size: 1.2rem;
	}
`;

const ModalSubtitle = styled(motion.h3)`
	margin: 0 0 24px;
	font-size: 1.15rem;
	color: #555;
	text-align: center;
	transform: translateY(10px);
	font-weight: 400;
	
	@media (max-width: 480px) {
		font-size: 1rem;
	}
`;

const WelcomeMessage = styled(motion.p)`
	font-size: 1.09rem;
	color: #555;
	margin: 0;
	transform: translateY(5px);
	text-align: center;
`;

const ModalSection = styled(motion.div)`
	display: flex;
	flex-direction: column;
	gap: 32px;
	margin-bottom: 24px;
`;

const ModalSectionTitle = styled(motion.h3)`
	font-size: 1.3915rem;
	font-weight: 500;
	background: linear-gradient(to right, #333, #48bb78);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	margin-bottom: 0px;
	display: flex;
	align-items: center;
	gap: 7px;
`;

const ModalItem = styled(motion.div)`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const ModalItemTitle = styled.h4`
	font-size: 1.09rem;
	font-weight: 500;
	color: #333;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 8px;
`;

const ModalItemDescription = styled.p`
	font-size: 0.98rem;
	color: #555;
	margin: 0;
`;

const Button = styled(motion.button)`
	padding: 12px;
	border: none;
	border-radius: 21.62px;
	font-size: 1.09rem;
	font-weight: 500;
	cursor: pointer;
	background: #C8FFC8;
	color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 7px;
	width: 100%;
	margin-top: 45px;
	transition: box-shadow 0.3s ease;
	
	&:hover:not(:disabled) {
		background: #A8EFA8;
		color: #000;
		box-shadow: 0 0 10px rgba(168, 239, 168, 0.7);
	}
	
	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	@media (max-width: 480px) {
		font-size: 0.9rem;
		padding: 10px;
	}
`;

const VersionFooter = styled(motion.p)`
	font-size: 0.98rem;
	color: #777;
	text-align: center;
	margin: 20px 0 0;
`;

const FeedbackPrompt = styled(motion.p)`
	font-size: 0.98rem;
	color: #777;
	text-align: center;
	margin: 20px 0 0;
`;

const FeedbackLink = styled.a`
	color: #48bb78;
	text-decoration: none;
	position: relative;
	cursor: pointer;
	
	&:after {
		content: "";
		position: absolute;
		width: 100%;
		height: 2px;
		bottom: -2px;
		left: 0;
		background: linear-gradient(to right, #C8FFC8, #A8EFA8);
		transform: scaleX(0);
		transform-origin: bottom right;
		transition: transform 0.3s ease-out;
	}
	
	&:hover:after {
		transform: scaleX(1);
		transform-origin: bottom left;
	}
	
	&:hover {
		color: #2e7d32;
	}
`;

const Divider = styled.hr`
	border: none;
	height: 1px;
	background: linear-gradient(to right, #C8FFC8, #A8EFA8);
	margin: 19px 0;
	border-radius: 21.62px;
`;

const IconWrapper = styled.span`
	display: inline-flex;
	align-items: center;
	color: #34C759FF;
	transform: translateY(-1px);
`;

const ItemIconWrapper = styled.span`
	display: inline-flex;
	align-items: center;
	color: #34C759FF;
	transform: translateY(-2px);
`;

const Spinner = styled(FaSpinner)`
	animation: spin 1s linear infinite;
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

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
      console.log("Modal isOpen:", isOpen);
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          console.log("Clicked outside, closing modal");
          onClose();
        }
      };
      
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          console.log("Escape pressed, closing modal");
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
      <>{showModal && (
        <ModalBackdrop
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          role="dialog"
          aria-labelledby="modal-title"
          data-testid="modal-overlay"
        >
          <FocusTrap focusTrapOptions={{allowOutsideClick: true}}>
            <ModalContainer
              ref={modalRef}
              variants={containerVariants}
              data-testid="modal-container"
            >
              
              <AnimatePresence>
                <ModalTitle variants={itemVariants} id="modal-title">
                  {modalContent.title}
                </ModalTitle>
                <ModalSubtitle variants={itemVariants}>
                  {modalContent.subtitle}
                </ModalSubtitle>
                <WelcomeMessage variants={itemVariants}>
                  {modalContent.welcomeMessage}
                </WelcomeMessage>
                {isLoading ? (
                  <Button disabled variants={buttonVariants}>
                    <Spinner size={19.8}/>
                  </Button>
                ) : (
                  <>
                    <Divider/>
                    <ModalSection variants={itemVariants}>
                      <ModalSectionTitle variants={itemVariants}>
                        <IconWrapper>
                          <FiRss size={19.8}/>
                        </IconWrapper>{" "}
                        {modalContent.newAdditions.title}
                      </ModalSectionTitle>
                      {additions.map((item, index) => (
                        <ModalItem
                          key={item.id}
                          variants={itemVariants}
                          transition={{delay: index * 0.15}}
                        >
                          <ModalItemTitle>
                            <ItemIconWrapper>
                              {item.title === "Новое оформление" &&
																<FiLayout size={19.8}/>}
                              {item.title === "Поиск специалистов" &&
																<FiSearch size={19.8}/>}
                            </ItemIconWrapper>
                            {item.title}
                          </ModalItemTitle>
                          <ModalItemDescription>{item.description}</ModalItemDescription>
                        </ModalItem>
                      ))}
                    </ModalSection>
                    <Divider/>
                    <ModalSection variants={itemVariants}>
                      <ModalSectionTitle variants={itemVariants}>
                        <IconWrapper>
                          <FiClock size={19.8}/>
                        </IconWrapper>{" "}
                        {modalContent.upcomingFeatures.title}
                      </ModalSectionTitle>
                      {features.map((item, index) => (
                        <ModalItem
                          key={item.id}
                          variants={itemVariants}
                          transition={{delay: index * 0.15}}
                        >
                          <ModalItemTitle>
                            <ItemIconWrapper>
                              {item.title === "Мобильное приложение" &&
																<FiSmartphone size={19.8}/>}
                              {item.title === "Чат с поддержкой" &&
																<FiMessageSquare size={19.8}/>}
                            </ItemIconWrapper>
                            {item.title}
                          </ModalItemTitle>
                          <ModalItemDescription>{item.description}</ModalItemDescription>
                        </ModalItem>
                      ))}
                    </ModalSection>
                    <Button
                      onClick={onClose}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      data-testid="modal-close-button"
                    >
                      {modalContent.closeButton}
                    </Button>
                    <VersionFooter variants={itemVariants}>
                      {modalContent.version.label}: {modalContent.version.value} ({modalContent.version.releaseDate})
                    </VersionFooter>
                    <FeedbackPrompt variants={itemVariants}>
                      {modalContent.feedbackPrompt}{" "}
                      <FeedbackLink
                        href="/feedback">{modalContent.feedbackLink}</FeedbackLink>
                    </FeedbackPrompt>
                  </>
                )}
              </AnimatePresence>
            </ModalContainer>
          </FocusTrap>
        </ModalBackdrop>
      )}</>
    );
  }
);

export default News;