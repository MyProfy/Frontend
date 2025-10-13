"use client";

import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { LanguageContext } from "@/contexts/LanguageContext";
import img from "../../public/avatar/logo.svg";
import Image from "next/image";

const FooterContainer = styled.footer`
  position: relative;
  width: 100%;
  background: #e1e2e5;
  padding: 60px 0 40px;
  margin-top: 60px;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
`;

const FooterLogo = styled(Image)`
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 10px;  
  cursor: pointer;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const SectionTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const FooterLink = styled.a`
  font-size: 15px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
  display: block;

  &:hover {
    color: #3ea240;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: #3ea240;
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  ${SocialLink}:hover & {
    background: #3ea240;
    box-shadow: 0 4px 12px rgba(62, 162, 62, 0.3);
    
    svg {
      fill: #fff;
    }
  }

  svg {
    width: 16px;
    height: 16px;
    fill: #6b7280;
    transition: fill 0.2s ease;
  }
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  background: #3ea240;
  color: #fff;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #3ea240;
  margin-bottom: 8px;

  &:hover {
    background: #2e8b57;
    box-shadow: 0 4px 12px rgba(62, 162, 62, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AddressText = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

const FooterCopyright = styled.div`
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #d1d5db;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  position: relative;

  @media (max-width: 768px) {
    padding: 24px;
    max-height: 90vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ModalCloseButton = styled.button`
  background: #f3f4f6;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ff4d4f;
    color: #fff;
    transform: rotate(90deg);
  }
`;

const A4Container = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

const A4Page = styled.div`
  background: #fff;
  margin: 0 auto 20px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.8;
  color: #374151;
  max-width: 794px;

  h4 {
    color: #1f2937;
    margin-top: 0;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language } = useContext(LanguageContext);

  const generateDummyText = () => {
    const lorem =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n";
    return Array(5).fill(lorem).join("\n");
  };

  return (
    <>
      <FooterContainer>
        <FooterInner>
            <FooterLogo src={img} alt='MyProfi logo' />  

          <FooterSection>
            <SectionTitle>Полезно</SectionTitle>
            <FooterLink href="#">Новая задача</FooterLink>
            <FooterLink href="#">Все услуги</FooterLink>
            <FooterLink href="#">Все отзывы</FooterLink>
            <FooterLink href="#">Условия использования</FooterLink>
            <FooterLink href="#">Каталог ссылок</FooterLink>
            <FooterLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              Политика конфиденциальности
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Наши соц сети</SectionTitle>
            <SocialLinks>
              <SocialLink href="https://t.me/yourpage" target="_blank">
                <SocialIcon>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.098.155.23.171.324.016.094.036.308.02.475z" />
                  </svg>
                </SocialIcon>
                Telegram
              </SocialLink>
              <SocialLink href="https://facebook.com/yourpage" target="_blank">
                <SocialIcon>
                  <svg viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </SocialIcon>
                Facebook
              </SocialLink>
              <SocialLink href="https://instagram.com/yourpage" target="_blank">
                <SocialIcon>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </SocialIcon>
                Instagram
              </SocialLink>
              <SocialLink href="https://youtube.com/yourchannel" target="_blank">
                <SocialIcon>
                  <svg viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </SocialIcon>
                YouTube
              </SocialLink>
              <SocialLink href="https://twitter.com/yourpage" target="_blank">
                <SocialIcon>
                  <svg viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </SocialIcon>
                Twitter
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Контакты</SectionTitle>
            <ContactButton href="tel:+998555115544">
              +998 55 511 5544
            </ContactButton>
            <ContactButton href="tel:+998555115588">
              +998 55 511 5588
            </ContactButton>
            <AddressText>
              Manzil: 100174, Toshkent sh.,
              <br />
              Olmazor tum. 2-Chimboy 96-uy
              <br />
              Pochta indeks: 100095
            </AddressText>
          </FooterSection>
        </FooterInner>

        <FooterCopyright>
          © {new Date().getFullYear()} MyProfy. Все права защищены
        </FooterCopyright>
      </FooterContainer>

      {isModalOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
        >
          <ModalContent
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Политика конфиденциальности</ModalTitle>
              <ModalCloseButton onClick={() => setIsModalOpen(false)}>
                ✕
              </ModalCloseButton>
            </ModalHeader>
            <A4Container>
              {Array.from({ length: 3 }).map((_, index) => (
                <A4Page key={index}>
                  <h4>Раздел {index + 1}</h4>
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