"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import styled from "@emotion/styled";
import  {
  FaUser,
  FaHistory,
  FaLock,
  FaBriefcase,
  FaSignOutAlt,
  FaHeadset,
} from "react-icons/fa";
// } from "react-icons/fa";
// import { MyProfile } from "../../components/ProfilePage/common/Modal";
// import Security from "components/ProfilePage/sections/Security";
// import History from "components/ProfilePage/sections/History";
// import Support from "components/ProfilePage/sections/SupportModal";
// import Vacancies from "components/ProfilePage/sections/Vacancies";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
// import { logoutUser } from "../../components/types/apiClient";
// import Services from "@/components/ProfilePage/sections/Services";

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    color: "#666",
    transition: { duration: 0.3 },
  },
  hover: { scale: 1.2, color: "#10b981", transition: { duration: 0.2 } },
  active: { scale: 1.2, color: "#10b981", transition: { duration: 0.2 } },
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
    gap: 8px;
    width: 100%;
    max-width: 220px;
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
    max-width: 220px;
    padding: 15px;
    border-radius: 12px;
    display: flex !important;
    flex-direction: column;
    gap: 15px;
  }
`;

const LogoutContainer = styled(motion.div)`
  display: contents;

  @media (min-width: 769px) {
    width: 100%;
    max-width: 220px;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    display: flex !important;
    flex-direction: column;
    gap: 15px;
    margin-top: 5vh;
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
    min-height: auto;
    padding: 12px 16px;
    font-size: 1rem;
    color: ${({ active }) => "#676E7E"};
    background: ${({ active }) => (active ? "#fff" : "transparent")};
    border-radius: 8px;
    box-shadow: none;
    text-align: left;

    ${({ active }) =>
      !active &&
      `
      &:hover {
        background: #e4e6ea;
      }
        cursor: pointer;
    `}

    svg {
      font-size: 1.2rem;
      color: #676e7e;
    }
  }
`;

const LogoutButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  font-size: 12px;
  line-height: 1.2;
  text-align: center;
  color: #666;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  min-height: 80px;

  &:hover {
    background: rgba(255, 77, 79, 0.3);
    color: #000;
  }

  &:active {
    svg {
      color: #fff;
    }
  }

  svg {
    font-size: 1.2rem;
    color: #666;
  }

  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: flex-start;
    min-height: auto;
    padding: 12px 16px;
    font-size: 1rem;
    color: #666;
    background: transparent;
    border-radius: 8px;
    box-shadow: none;
    text-align: left;

    &:hover {
      background: rgba(255, 77, 79, 0.3);
      color: #000;
    }

    &:active {
      svg {
        color: #10b981;
      }
    }

    svg {
      font-size: 1.2rem;
      color: #666;
    }
  }
`;

const IconContainer = styled(motion.span)`
  display: inline-flex;
  align-items: center;
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

const NavLinksContainer = styled.div`
  display: contents;

  @media (min-width: 769px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const sidebarVariants = {
  initial: { opacity: 0 },
  visible: { opacity: 1 },
};

const navLinks = [
  { name: "profile.sidebar.profile", icon: <FaUser />, active: true },
  { name: "profile.sidebar.services", icon: <FaBriefcase />, active: false },
  { name: "profile.sidebar.vacancies", icon: <FaBriefcase />, active: false },
  { name: "profile.sidebar.orderHistory", icon: <FaHistory />, active: false },
  { name: "profile.sidebar.security", icon: <FaLock />, active: false },
  { name: "profile.sidebar.support", icon: <FaHeadset />, active: false },
];

export default function Hero() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("profile.sidebar.profile");

  // const handleLogout = async () => {
  //   try {
  //     await logoutUser();
  //     window.dispatchEvent(new Event("logout"));
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Ошибка выхода:", error);
  //     window.dispatchEvent(new Event("logout"));
  //     router.push("/");
  //   }
  // };

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
                key={link.name}
                active={activeLink === link.name}
                onClick={() => setActiveLink(link.name)}
                role="button"
                aria-label={t(link.name)}
              >
                <IconContainer
                  variants={iconVariants}
                  initial="visible"
                  animate={activeLink === link.name ? "active" : "visible"}
                  whileHover="hover"
                >
                  {link.icon}
                </IconContainer>
                <span>{t(link.name)}</span>
              </SidebarLink>
            ))}
          </NavLinksContainer>
        </SidebarContainer>

        <LogoutContainer
          variants={sidebarVariants}
          initial="initial"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LogoutButton
            // onClick={handleLogout}
            role="button"
            aria-label={t("profile.sidebar.logout")}
          >
            <IconContainer
              variants={iconVariants}
              initial="visible"
              animate="visible"
              whileHover="hover"
            >
              <FaSignOutAlt />
            </IconContainer>
            <span>{t("profile.sidebar.logout")}</span>
          </LogoutButton>
        </LogoutContainer>
      </SidebarWrapper>

      {/* <MainContent>
        {activeLink === "profile.sidebar.profile" && <MyProfile />}
        {activeLink === "profile.sidebar.services" && <Services />}
        {activeLink === "profile.sidebar.vacancies" && <Vacancies />}
        {activeLink === "profile.sidebar.orderHistory" && <History />}
        {activeLink === "profile.sidebar.security" && <Security />}
        {activeLink === "profile.sidebar.support" && <Support />}
      </MainContent> */}
    </PageContainer>
  );
}
