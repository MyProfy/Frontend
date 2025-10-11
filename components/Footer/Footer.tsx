"use client";

import React, {useContext, useState} from "react";
import styled from "@emotion/styled";
import {motion} from "framer-motion";
import {LanguageContext} from "@/contexts/LanguageContext";
import img from "../../public/avatar/my_profy_logo-10.png";
import Image from "next/image";


const glowAnimation = `
  @keyframes glowEffect {
    0% {
      box-shadow: 0px 0px 8px 2px rgba(152, 251, 152, 0.3),
                  0px 0px 20px 8px rgba(144, 238, 144, 0.25),
                  0px 0px 40px 15px rgba(144, 238, 144, 0.15);
    }
    50% {
      box-shadow: 0px 0px 12px 4px rgba(152, 251, 152, 0.4),
                  0px 0px 30px 12px rgba(144, 238, 144, 0.3),
                  0px 0px 50px 25px rgba(144, 238, 144, 0.2);
    }
    100% {
      box-shadow: 0px 0px 8px 2px rgba(152, 251, 152, 0.3),
                  0px 0px 20px 8px rgba(144, 238, 144, 0.25),
                  0px 0px 40px 15px rgba(144, 238, 144, 0.15);
    }
  }
`;


const FooterContainer = styled.footer`
  position: relative;
  width: 100%;
  background: rgb(225, 226, 229);
  backdrop-filter: blur(10px);
  padding: 40px 0;
  margin-top: 40px;
`;

// Внутренний контейнер для центровки и ограничения ширины
const FooterInner = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

// Логотип футера
const FooterLogo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #676E7E;
  margin-bottom: 20px;
`;

// Контейнер для навигационных ссылок
const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Ссылка в футере
const FooterLink = styled.a`
  font-size: 1rem;
  color: #676E7E;
  text-decoration: none;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #676E7E;
  }
`;

// Контейнер для контактной информации
const FooterContacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Текст контактов
const ContactText = styled.p`
  display: flex; /* Flow: Horizontal */
  align-items: center;
  justify-content: center;


  width: fit-content; /* Hug width */
  height: fit-content; /* Hug height */

  border-radius: 30px;
  border: 1px solid #3ea240;

  background-color: #3ea240;

  padding: 4px 16.16px 5.8px 15px; /* top right bottom left */

  font-size: 1rem;
  color: #FFF;
  margin: 0;
`;

// Копирайт
const FooterCopyright = styled.div`
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  color: #676E7E;
  margin-top: 20px;
  padding-top: 20px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 3px 17px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 90vh;
    padding: 20px;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #676E7E;
  margin: 0 0 20px;
  text-align: center;
`;

const ModalCloseButton = styled.button`
  background: none;
  margin-top: -14px;
  border: none;
  font-size: 1.7rem;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
  z-index: 10;

  &:hover {
    color: #ff4d4f;
  }
`;

// Контейнер для страниц A4
const A4Container = styled.div`
  overflow-y: auto;
  max-height: 65vh;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 5px;
`;

// Страница A4
const A4Page = styled.div`
  width: 794px;
  height: 1123px;
  background: #fff;
  margin: 0 auto 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.6;
  color: #676E7E;

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
  }
`;

const ContactTextTitle = styled.h4`
  /* Layout */
  width: 91px;
  height: 24px;

  /* Content */
  content: "Контакты";

  /* Typography */
  font-family: "Font 1", sans-serif; /* Replace with actual font family */
  font-weight: 600;
  font-style: semi-bold;
  font-size: 18.75px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;

  /* Colors */
  color: #676E7E;

  /* Additional styling */
  margin: 0; /* Reset default h4 margins */
  padding: 0; /* Reset default h4 padding */
`;



const logo = (
  <svg
    width="46"
    height="46"
    viewBox="0 0 46 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_317_19050)">
      <path d="M46 0H0V46H46V0Z" fill="#3EA240" />
      <path
        d="M13.9955 22.9662C14.9051 21.9818 14.8442 20.4408 13.8596 19.5312C13.4069 19.1128 12.825 18.8856 12.2123 18.8856C12.1796 18.8856 12.1467 18.8863 12.1139 18.8874C11.465 18.913 10.8652 19.1899 10.4245 19.6667C9.98383 20.1437 9.75521 20.7635 9.78097 21.4124C9.79592 21.7914 9.89666 22.1537 10.0728 22.4773C10.1982 22.7077 10.3619 22.9186 10.5604 23.1019L14.8624 27.0766L17.7744 29.7673C17.0039 30.6013 15.9544 31.0238 14.9019 31.0238C13.9532 31.0238 13.0017 30.6804 12.2498 29.9858L7.90716 25.9735C7.71396 25.7948 7.53295 25.6062 7.36505 25.4079C6.98739 24.9622 6.67505 24.4679 6.43263 23.9318C6.09476 23.1845 5.90685 22.3889 5.87442 21.5672C5.84199 20.7451 5.96642 19.9374 6.24426 19.1657C6.53222 18.366 6.97267 17.642 7.55296 17.0138C8.13325 16.3857 8.82026 15.8896 9.59467 15.5393C10.3417 15.2014 11.1373 15.0135 11.9593 14.9811C12.7813 14.9487 13.5893 15.0731 14.3607 15.3509C15.1604 15.6391 15.8845 16.0794 16.5126 16.6596C17.1407 17.2399 17.6368 17.9269 17.9871 18.7014C18.325 19.4486 18.5129 20.2442 18.5453 21.066C18.5778 21.888 18.4533 22.6958 18.1755 23.4674C17.8875 24.2671 17.4471 24.9912 16.8668 25.6193C16.4852 26.0324 16.0572 26.3884 15.5887 26.6833L12.4018 23.7386C12.9906 23.6924 13.564 23.4331 13.9955 22.966V22.9662Z"
        fill="white"
      />
      <path
        d="M26.1029 19.3885V21.7575H27.1128V19.1213C27.1128 18.6831 26.9958 18.3285 26.7619 18.0575C26.528 17.7863 26.182 17.6509 25.7241 17.6509C25.4568 17.6509 25.2135 17.7098 24.9945 17.8273C24.791 17.9365 24.6263 18.0865 24.4998 18.276C24.4048 18.104 24.2744 17.9623 24.1072 17.8514C23.9055 17.7178 23.6474 17.6509 23.333 17.6509C23.0582 17.6509 22.81 17.7116 22.5885 17.8328C22.419 17.9255 22.2762 18.0439 22.1596 18.1875V17.7475H21.2683V21.7575H22.2856V19.3292C22.2856 19.099 22.3493 18.9115 22.4767 18.7666C22.6042 18.6217 22.7732 18.5495 22.9836 18.5495C23.1941 18.5495 23.3767 18.6231 23.5016 18.7703C23.6265 18.9175 23.6891 19.1236 23.6891 19.3885V21.7575H24.699V19.3292C24.699 19.1758 24.728 19.0403 24.7862 18.9225C24.8444 18.805 24.9253 18.7135 25.0293 18.6477C25.1332 18.5821 25.2558 18.5493 25.3968 18.5493C25.6171 18.5493 25.7896 18.6229 25.9148 18.7701C26.0397 18.9173 26.1022 19.1233 26.1022 19.3883L26.1029 19.3885Z"
        fill="white"
      />
      <path
        d="M29.3777 23.5396L31.6427 17.7473H30.6328L29.5853 20.476L28.5313 17.7473H27.4841L29.1017 21.7259L28.442 23.5396H29.3777Z"
        fill="white"
      />
      <path
        d="M24.1944 24.3913C23.9096 24.2082 23.5754 24.1165 23.1918 24.1165C22.8082 24.1165 22.4901 24.2094 22.2302 24.395C22.206 24.4122 22.1828 24.4309 22.1596 24.4493V24.2278H21.2683V30.0201H22.2856V28.0978C22.5457 28.2652 22.865 28.3491 23.2436 28.3491C23.6221 28.3491 23.9354 28.2565 24.2125 28.0706C24.4897 27.885 24.7057 27.6325 24.8605 27.3132C25.015 26.994 25.0925 26.6338 25.0925 26.2327C25.0925 25.8316 25.0139 25.461 24.8568 25.1429C24.6994 24.8249 24.4787 24.5744 24.1939 24.3911L24.1944 24.3913ZM23.9232 26.8475C23.8563 27.0319 23.7537 27.1784 23.615 27.2875C23.4763 27.3965 23.2981 27.4508 23.0802 27.4508C22.8624 27.4508 22.675 27.3999 22.54 27.2985C22.405 27.1971 22.3079 27.0547 22.2486 26.8716C22.1892 26.6885 22.1596 26.4756 22.1596 26.2329C22.1596 25.9903 22.1892 25.7775 22.2486 25.5942C22.3079 25.4111 22.4027 25.2688 22.5326 25.1671C22.6626 25.0657 22.8328 25.0148 23.0432 25.0148C23.2684 25.0148 23.4535 25.07 23.5982 25.18C23.7431 25.2901 23.8501 25.4373 23.9193 25.6218C23.9885 25.8063 24.0232 26.0098 24.0232 26.2327C24.0232 26.4556 23.9899 26.6628 23.923 26.8472L23.9232 26.8475Z"
        fill="white"
      />
      <path
        d="M27.8999 24.2185C27.7787 24.2272 27.661 24.2482 27.5471 24.2815C27.4333 24.3149 27.3282 24.3613 27.2316 24.4207C27.1053 24.495 26.9988 24.589 26.9123 24.7029C26.8711 24.7569 26.8341 24.814 26.801 24.8738V24.2277H25.91V28.2377H26.9273V26.1882C26.9273 26.0348 26.9482 25.8968 26.9903 25.7742C27.0324 25.6516 27.0942 25.5454 27.1759 25.455C27.2575 25.3646 27.3578 25.2921 27.4767 25.2379C27.5956 25.181 27.7286 25.147 27.8758 25.1357C28.023 25.1247 28.1525 25.1364 28.2638 25.1709V24.2277C28.1426 24.2127 28.0211 24.2098 27.8999 24.2185Z"
        fill="white"
      />
      <path
        d="M31.7632 24.3874C31.4575 24.2066 31.1029 24.1162 30.6994 24.1162C30.296 24.1162 29.9531 24.2055 29.6486 24.3835C29.3441 24.5617 29.1051 24.8099 28.9319 25.128C28.7587 25.4461 28.672 25.8143 28.672 26.2327C28.672 26.651 28.7569 27.0119 28.9264 27.3298C29.0959 27.6479 29.333 27.8972 29.6373 28.078C29.9418 28.2585 30.2958 28.3489 30.6992 28.3489C31.1026 28.3489 31.4536 28.2592 31.7593 28.0798C32.065 27.9004 32.3039 27.6515 32.476 27.3335C32.648 27.0154 32.734 26.6483 32.734 26.2324C32.734 25.8166 32.6487 25.4534 32.4778 25.1353C32.3069 24.8172 32.0686 24.5679 31.763 24.3872L31.7632 24.3874ZM31.4253 27.0777C31.2657 27.2967 31.0237 27.4064 30.6994 27.4064C30.3751 27.4064 30.1468 27.3006 29.9846 27.089C29.8225 26.8774 29.7415 26.5922 29.7415 26.2331C29.7415 26.0004 29.7755 25.7964 29.8436 25.6204C29.9117 25.4447 30.0163 25.3074 30.1573 25.2083C30.2983 25.1094 30.4791 25.0597 30.6994 25.0597C31.0187 25.0597 31.2595 25.1662 31.4216 25.3789C31.5838 25.5919 31.6648 25.8764 31.6648 26.2329C31.6648 26.5894 31.5849 26.8585 31.4253 27.0777Z"
        fill="white"
      />
      <path
        d="M34.977 22.785C34.8409 22.7887 34.7003 22.8161 34.5557 22.8667C34.4108 22.9175 34.2764 23.0121 34.1527 23.1507C34.0561 23.2572 33.9899 23.3759 33.954 23.5072C33.9181 23.6386 33.8976 23.7685 33.8928 23.8971C33.888 24.0197 33.8857 24.1296 33.8854 24.2276H33.2541V25.0073H33.8852V28.2377H34.8951V25.0073H35.8234V24.2276H34.8951V24.0047C34.8951 23.8934 34.9336 23.7975 35.0101 23.717C35.0867 23.6365 35.2045 23.5963 35.363 23.5963H35.8234V22.7793H35.3259C35.2293 22.7793 35.1129 22.7811 34.9768 22.7848L34.977 22.785Z"
        fill="white"
      />
      <path
        d="M39.1207 24.2278L38.073 26.9565L37.0189 24.2278H35.972L37.5896 28.2063L36.9299 30.0203H37.8656L40.1306 24.2278H39.1207Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_317_19050">
        <rect width="46" height="46" rx="10" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language } = useContext(LanguageContext);

  const generateDummyText = () => {
    const lorem =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n";
    return Array(30).fill(lorem.repeat(10)).join("\n");
  };

  return (
    <>
      <FooterContainer>
        <FooterInner>
          {/* Логотип */}
          <div>
            <FooterLogo>
              <Image src={img} alt="Logo" width={160} height={80} />
            </FooterLogo>
          </div>

          {/* Навигационные ссылки */}
          <FooterLinks>
            <FooterLink href="#">О нас</FooterLink>
            <FooterLink href="#">Услуги</FooterLink>
            <FooterLink href="#">Контакты</FooterLink>
            <FooterLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              Политика конфиденциальности
            </FooterLink>
          </FooterLinks>

          {/* Контактная информация */}
          <FooterContacts>
            <ContactTextTitle>Контакты</ContactTextTitle>
            <ContactText>Телефон: +998 12 345 67 89</ContactText>
            <ContactText>Email: info@example.com</ContactText>
            <ContactText>Адрес: Ташкент, ул. Примерная, 123</ContactText>
          </FooterContacts>
        </FooterInner>

        {/* Копирайт */}
        <FooterCopyright>
          © {new Date().getFullYear()} Все права защищены
        </FooterCopyright>
      </FooterContainer>

      {/* Модальное окно */}
      {isModalOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsModalOpen(false)}
        >
          <ModalContent
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10,
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
            >
              <ModalCloseButton
                onClick={() => setIsModalOpen(false)}
                aria-label="Закрыть модальное окно"
              >
                ✕
              </ModalCloseButton>
            </motion.div>
            <ModalTitle>Политика конфиденциальности</ModalTitle>
            <A4Container>
              {Array.from({ length: 30 }).map((_, index) => (
                <A4Page key={index}>
                  <h4>Страница {index + 1}</h4>
                  <p>{generateDummyText()}</p>
                </A4Page>
              ))}
            </A4Container>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
