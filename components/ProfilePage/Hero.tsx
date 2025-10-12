"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import styled from "@emotion/styled";
import {
  FaUser,
  FaHistory,
  FaLock,
  FaBriefcase,
  FaSignOutAlt,
  FaHeadset,
  FaUsers,
  FaStar,
  FaPlus,
} from "react-icons/fa";
import Security from "components/ProfilePage/sections/Security";
import History from "components/ProfilePage/sections/History";
import Support from "components/ProfilePage/sections/Support";
import Vacancies from "components/ProfilePage/sections/Vacancies";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import MyProfile from "./sections/MyProfile";
import Services from "./sections/Services";

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    color: "#9ca3af",
    transition: { duration: 0.3 },
  },
  hover: { scale: 1.05, color: "#6b7280", transition: { duration: 0.2 } },
  active: { scale: 1, color: "#6b7280", transition: { duration: 0.2 } },
};

// Стили
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 10px;
  padding-top: 80px;
  gap: 16px;
  box-sizing: border-box;
  background: #f9fafb;

  @media (min-width: 600px) {
    padding: 20px;
    padding-top: 100px;
    gap: 20px;
  }

  @media (min-width: 769px) {
    flex-direction: row;
    padding: 24px;
    padding-top: 125px;
    gap: 24px;
  }
`;

const SidebarWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  padding: 10px 8px;
  background: transparent;

  @media (min-width: 600px) and (max-width: 768px) {
    padding: 10px 12px;
  }

  @media (min-width: 769px) {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    max-width: 240px;
    padding: 0;
    position: sticky;
    top: 125px;
    height: fit-content;
  }
`;

const SidebarContainer = styled(motion.nav)`
  display: contents;
  @media (min-width: 769px) {
    width: 100%;
    max-width: 240px;
    padding: 16px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex !important;
    flex-direction: column;
    gap: 4px;
  }
`;

const NavLinksContainer = styled.div`
  display: contents;

  @media (min-width: 769px) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

const SidebarLink = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px;
  font-size: 12px;
  line-height: 2.2;
  text-align: center;
  color: ${({ active }) => (active ? "#fff" : "#666")};
  background: ${({ active }) => (active ? "#008000" : "#fff")};
  border-radius: 12px;
  transition: background 0.3s ease, color 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  min-height: 80px;

  svg {
    font-size: 1.2rem;
    color: ${({ active }) => (active ? "#fff" : "#666")};
  }

  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: auto;
    padding: 11px 14px;
    font-size: 14px;
    color: #6b7280;
    background: transparent;
    border-radius: 8px;
    box-shadow: none;
    text-align: left;
    font-weight: 400;

    ${({ active }) =>
      active &&
      `
      background: #f3f4f6;
      font-weight: 400;
    `}

    ${({ active }) =>
      !active &&
      `
      &:hover {
        background: #f9fafb;
      }
        cursor: pointer;
    `}

    svg {
      font-size: 18px;
      color: #9ca3af;
      margin-right: 2px;
    }
  }
`;

const Divider = styled.div`
  display: none;
  
  @media (min-width: 769px) {
    display: block;
    height: 1px;
    background: #e5e7eb;
    margin: 8px 0;
  }
`;

const ServiceSection = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

const ServiceLink = styled.div<{ active?: boolean }>`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 11px 14px 11px 38px;
    font-size: 14px;
    color: #9ca3af;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400;

    ${({ active }) =>
      active &&
      `
      background: #f3f4f6;
      color: #6b7280;
    `}

    &:hover {
      background: #f9fafb;
      color: #6b7280;
    }
  }
`;

const AddServiceLink = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    padding: 11px 14px 11px 38px;
    font-size: 14px;
    color: #9ca3af;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400;
    
    svg {
      width: 14px;
      height: 14px;
      color: #9ca3af;
    }

    &:hover {
      background: #f9fafb;
      color: #6b7280;
      
      svg {
        color: #6b7280;
      }
    }
  }
`;

const IconContainer = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  @media (min-width: 600px) {
    gap: 20px;
  }

  @media (min-width: 769px) {
    gap: 24px;
  }
`;

const sidebarVariants = {
  initial: { opacity: 0 },
  visible: { opacity: 1 },
};

const navLinks = [
  { name: "Мой профиль", icon: <FaUser />, key: "profile" },
  { name: "Мои объявления", icon: <FaBriefcase />, key: "services" },
  { name: "Поддержка", icon: <FaUsers />, key: "support" },
  { name: "Настройки", icon: <FaLock />, key: "settings" },
  { name: "Моя подписка", icon: <FaStar />, key: "subscription" },
];

export default function Hero() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("profile");
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <PageContainer>
      <SidebarWrapper>
        <SidebarContainer
          variants={sidebarVariants}
          initial="initial"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <NavLinksContainer>
            {navLinks.map((link) => (
              <SidebarLink
                key={link.key}
                active={activeLink === link.key}
                onClick={() => {
                  setActiveLink(link.key);
                  setActiveService(null);
                }}
                role="button"
              >
                <IconContainer
                  variants={iconVariants}
                  initial="visible"
                  animate={activeLink === link.key ? "active" : "visible"}
                  whileHover="hover"
                >
                  {link.icon}
                </IconContainer>
                <span>{link.name}</span>
              </SidebarLink>
            ))}
          </NavLinksContainer>

          <Divider />

          <ServiceSection>
            <SidebarLink
              active={activeLink === "orders" && !activeService}
              onClick={() => {
                setActiveLink("orders");
                setActiveService(null);
              }}
              role="button"
            >
              <IconContainer
                variants={iconVariants}
                initial="visible"
                animate={activeLink === "orders" && !activeService ? "active" : "visible"}
                whileHover="hover"
              >
                <FaUser />
              </IconContainer>
              <span>Мои заказы</span>
            </SidebarLink>

            <ServiceLink
              active={activeService === "plumbing"}
              onClick={() => {
                setActiveLink("orders");
                setActiveService("plumbing");
              }}
            >
              Сантехник
            </ServiceLink>

            <ServiceLink
              active={activeService === "cleaning"}
              onClick={() => {
                setActiveLink("orders");
                setActiveService("cleaning");
              }}
            >
              Чистка труб
            </ServiceLink>

            <AddServiceLink onClick={() => console.log("Add new service")}>
              <FaPlus />
              Новая услуга
            </AddServiceLink>
          </ServiceSection>
        </SidebarContainer>
      </SidebarWrapper>

      <MainContent>
        {activeLink === "profile" && <MyProfile />}
        {activeLink === "services" && <Services />}
        {activeLink === "orders" && <History />}
        {activeLink === "settings" && <Security />}
        {activeLink === "support" && <Support />}
        {activeLink === "subscription" && <Vacancies />}
      </MainContent>
    </PageContainer>
  );
}