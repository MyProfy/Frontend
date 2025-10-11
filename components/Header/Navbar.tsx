"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BsFire } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";
import MyProfiLogo from "../../public/MyProfyLogo.png";
import UzFlag from "../../public/🇺🇿.png";
import RusFlag from "../../public/🇷🇺.png";
import RegionModal from "../RegionModal/RegionModal";
import LanguageModal from "../LanguageModalProps/LanguageModalProps";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  background-color: #ffffff;
  color: #333;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 10px 16px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled(Image)`
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
`;

const RegionButton = styled.button`
  background: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #45a049;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;

  @media (max-width: 640px) {
    display: none;
  }
`;

const FireIcon = styled.span`
  color: #3ea240;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const LangButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 16px;
  color: #2d3748;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const LoginButton = styled.button`
  background: #4caf50;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s ease;

  &:hover {
    background: #45a049;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  border: none;
  background: none;
  font-size: 24px;
  color: #2d3748;
  cursor: pointer;

  @media (max-width: 640px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
`;

export default function Navbar() {
  const [lang, setLang] = useState("Uzbek tilida");
  const [region, setRegion] = useState("Выберите свой регион");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLanguageSelect = (language: string) => setLang(language);
  const handleRegionSelect = (selectedRegion: string) => setRegion(selectedRegion);

  return (
    <>
      <Nav>
        <Left>
          <Logo src={MyProfiLogo} alt="MyProfy Logo" />
          <RegionButton onClick={() => setShowRegionModal(true)}>
            {region}
          </RegionButton>
        </Left>

        <Center>
          <FireIcon>
            <BsFire />
          </FireIcon>
          <span>Более 100 реальных услуг</span>
        </Center>

        <Right>
          <LangButton onClick={() => setShowLanguageModal(true)}>{lang}</LangButton>
          <LoginButton>Войти</LoginButton>
        </Right>

        <MobileMenuButton onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </Nav>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              className="text-sm text-green-700 font-semibold py-2"
              onClick={() => setShowRegionModal(true)}
            >
              {region}
            </button>

            <button
              className="text-sm text-gray-700 py-2"
              onClick={() => setShowLanguageModal(true)}
            >
              {lang}
            </button>

            <button className="bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-semibold">
              Войти
            </button>
          </MobileMenu>
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
    </>
  );
}
