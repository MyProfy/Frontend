"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
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
    <div className="flex flex-col min-h-screen px-[10px] pt-[80px] pb-[10px] gap-4 box-border bg-[#f9fafb] sm:px-5 sm:pt-[100px] sm:gap-5 md:flex-row md:px-6 md:pt-[125px] md:gap-6">
      <div className="grid grid-cols-3 gap-2 w-full p-[10px]_8px bg-transparent sm:p-[10px]_12px md:flex md:flex-col md:gap-0 md:w-full md:max-w-[240px] md:p-0 md:sticky md:top-[125px] md:h-fit">
        <motion.nav
          className="contents md:w-full md:max-w-[240px] md:px-4 md:py-4 md:rounded-[12px] md:bg-white md:shadow-sm md:flex md:flex-col md:gap-1"
          variants={sidebarVariants}
          initial="initial"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <div className="contents md:flex md:flex-col md:gap-[2px]">
            {navLinks.map((link) => (
              <div
                key={link.key}
                className={`flex flex-col items-center justify-center gap-[10px] px-2 py-2 text-xs leading-[2.2] text-center text-[#666] bg-white rounded-[12px] transition-all duration-300 shadow-sm min-h-[80px] md:flex-row md:justify-start md:items-center md:min-h-auto md:px-[11px] md:py-[11px] md:text-sm md:text-left md:font-normal md:text-[#6b7280] md:bg-transparent md:rounded-[8px] md:shadow-none md:cursor-pointer md:hover:bg-[#f9fafb] ${activeLink === link.key ? "text-white bg-[#008000]" : ""} md:${activeLink === link.key ? "bg-[#f3f4f6] md:font-normal" : ""}`}
                onClick={() => {
                  setActiveLink(link.key);
                  setActiveService(null);
                }}
                role="button"
              >
                <motion.span
                  className="inline-flex items-center justify-center w-[20px] h-[20px] md:mr-0.5"
                  variants={iconVariants}
                  initial="visible"
                  animate={activeLink === link.key ? "active" : "visible"}
                  whileHover="hover"
                >
           
                </motion.span>
                <span>{link.name}</span>
              </div>
            ))}
          </div>

          <div className="hidden md:block h-[1px] bg-[#e5e7eb] my-2" />

          <div className="hidden md:flex md:flex-col md:gap-[2px]">
            <div
              className={`flex flex-col items-center justify-center gap-[10px] px-2 py-2 text-xs leading-[2.2] text-center text-[#666] bg-white rounded-[12px] transition-all duration-300 shadow-sm min-h-[80px] md:flex-row md:justify-start md:items-center md:min-h-auto md:px-[11px] md:py-[11px] md:text-sm md:text-left md:font-normal md:text-[#6b7280] md:bg-transparent md:rounded-[8px] md:shadow-none md:cursor-pointer md:hover:bg-[#f9fafb] ${activeLink === "orders" && !activeService ? "text-white bg-[#008000]" : ""} md:${activeLink === "orders" && !activeService ? "bg-[#f3f4f6] md:font-normal" : ""}`}
              onClick={() => {
                setActiveLink("orders");
                setActiveService(null);
              }}
              role="button"
            >
              <motion.span
                className="inline-flex items-center justify-center w-[20px] h-[20px] md:mr-0.5"
                variants={iconVariants}
                initial="visible"
                animate={activeLink === "orders" && !activeService ? "active" : "visible"}
                whileHover="hover"
              >
                {React.cloneElement(<FaUser />, { className: `text-[1.2rem] md:text-[18px] ${activeLink === "orders" && !activeService ? "text-white" : "text-[#666] md:text-[#9ca3af]"}` })}
              </motion.span>
              <span>Мои заказы</span>
            </div>

            <div
              className={`hidden md:flex md:items-center md:justify-start md:px-[11px] md:py-[11px] md:text-sm md:text-[#9ca3af] md:bg-transparent md:rounded-[8px] md:cursor-pointer md:transition-all md:duration-200 md:font-normal ${activeService === "plumbing" ? "md:bg-[#f3f4f6] md:text-[#6b7280]" : "md:hover:bg-[#f9fafb] md:hover:text-[#6b7280]"}`}
              onClick={() => {
                setActiveLink("orders");
                setActiveService("plumbing");
              }}
            >
              Сантехник
            </div>

            <div
              className={`hidden md:flex md:items-center md:justify-start md:px-[11px] md:py-[11px] md:text-sm md:text-[#9ca3af] md:bg-transparent md:rounded-[8px] md:cursor-pointer md:transition-all md:duration-200 md:font-normal ${activeService === "cleaning" ? "md:bg-[#f3f4f6] md:text-[#6b7280]" : "md:hover:bg-[#f9fafb] md:hover:text-[#6b7280]"}`}
              onClick={() => {
                setActiveLink("orders");
                setActiveService("cleaning");
              }}
            >
              Чистка труб
            </div>

            <div
              className="hidden md:flex md:items-center md:justify-start md:gap-2 md:px-[11px] md:py-[11px] md:text-sm md:text-[#9ca3af] md:bg-transparent md:rounded-[8px] md:cursor-pointer md:transition-all md:duration-200 md:font-normal md:hover:bg-[#f9fafb] md:hover:text-[#6b7280]"
              onClick={() => console.log("Add new service")}
            >
              <FaPlus className="w-[14px] h-[14px] text-[#9ca3af] md:hover:text-[#6b7280]" />
              Новая услуга
            </div>
          </div>
        </motion.nav>
      </div>

      <main className="flex-1 flex flex-col gap-4 min-w-0 sm:gap-5 md:gap-6">
        {activeLink === "profile" && <MyProfile />}
        {activeLink === "services" && <Services />}
        {activeLink === "orders" && <History />}
        {activeLink === "settings" && <Security />}
        {activeLink === "support" && <Support />}
        {activeLink === "subscription" && <Vacancies />}
      </main>
    </div>
  );
}