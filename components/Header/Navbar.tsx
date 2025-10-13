"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BsFire } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

import MyProfiLogo from "../../public/avatar/logo.svg";
import UzFlag from "../../public/🇺🇿.png";
import RusFlag from "../../public/🇷🇺.png";
import RegionModal from "../RegionModal/RegionModal";
import LanguageModal from "../LanguageModalProps/LanguageModalProps";
import AuthModal from "../../components/RegisterModal/RegisterModal"

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  background-color: #f8f9fb;
  color: #333;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled(Image)`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 100px;
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
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const LangFlag = styled(Image)`
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 4px;
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

const ProfileButton = styled(LoginButton)`
  background: #2d3748;

  &:hover {
    background: #1a202c;
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
  z-index: 999;
  background: #f8f9fb;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const RegionBar = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  width: 84%;
  margin: 0 8%;
  height: 40px;
  display: flex;
  z-index: 999;
`;

const RegionSelectButton = styled.button`
  background: #4caf50;
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 0px 0px 8px 8px;
  padding: 4px 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #45a049;
  }
`;

export default function Navbar() {
  const router = useRouter();

  const [lang, setLang] = useState("Uzbek tilida");
  const [flag, setFlag] = useState(UzFlag);
  const [region, setRegion] = useState("Выберите свой регион");
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
    if (language === "Русский язык") {
      setLang("Русский язык");
      setFlag(RusFlag);
    } else {
      setLang("Uzbek tilida");
      setFlag(UzFlag);
    }
  };

  const handleRegionSelect = (selectedRegion: string) => setRegion(selectedRegion);

  return (
    <>
      <Nav>
        <Left>
          <Logo src={MyProfiLogo} alt="MyProfy Logo" onClick={() => router.push("/")} />
        </Left>

        <Center>
          <FireIcon><BsFire /></FireIcon>
          <span>Более 100 реальных услуг</span>
        </Center>

        <Right>
          <LangButton onClick={() => setShowLanguageModal(true)}>
            <LangFlag src={flag} alt="flag" />
            {lang}
          </LangButton>

          {isLoggedIn ? (
            <ProfileButton onClick={() => router.push("/profile")}>Профиль</ProfileButton>
          ) : (
            <LoginButton onClick={() => setShowAuthModal(true)}>Войти</LoginButton>
          )}
        </Right>

        <MobileMenuButton onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </Nav>

      <RegionBar>
        <RegionSelectButton onClick={() => setShowRegionModal(true)}>
          {region}
        </RegionSelectButton>
      </RegionBar>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button className="text-sm text-green-700 font-semibold py-2"
              onClick={() => setShowRegionModal(true)}>
              {region}
            </button>

            <button className="text-sm text-gray-700 py-2"
              onClick={() => setShowLanguageModal(true)}>
              {lang}
            </button>

            {isLoggedIn ? (
              <ProfileButton onClick={() => router.push("/profile")}>Профиль</ProfileButton>
            ) : (
              <LoginButton onClick={() => setShowAuthModal(true)}>Войти</LoginButton>
            )}
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

      <AuthModal
        isOpen={showAuthModal}
        onCloseAction={() => setShowAuthModal(false)}
        // onLoginSuccess={() => setIsLoggedIn(true)}
      />
    </>
  );
}
