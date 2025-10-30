"use client";

import React, { useState, useMemo, useCallback, lazy, Suspense, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import {
  FaTelegramPlane,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaPhoneAlt,
} from "react-icons/fa";
import logo from "../../public/avatar/logo.svg";

const SOCIAL_LINKS = [
  { name: "Telegram", href: " https://t.me/myprofy", icon: FaTelegramPlane },
  { name: "Facebook", href: "https://www.facebook.com/myprofy.uz", icon: FaFacebookF },
  { name: "Instagram", href: "https://instagram.com/myprofy.uz", icon: FaInstagram },
  { name: "YouTube", href: "https://youtube.com/yourchannel", icon: FaYoutube },
  { name: "Twitter", href: "https://twitter.com/yourpage", icon: FaTwitter },
] as const;

const USEFUL_LINKS = [
  { key: "footer.useful.newTask", href: "#", isModal: false },
  { key: "footer.useful.allServices", href: "#", isModal: false },
  { key: "footer.useful.allReviews", href: "#", isModal: false },
  { key: "footer.useful.termsOfUse", href: "#", isModal: false },
  { key: "footer.useful.linkCatalog", href: "#", isModal: false },
  { key: "footer.useful.privacyPolicy", href: "#", isModal: true },
] as const;


const SocialLink = memo(({ name, href, Icon }: { name: string; href: string; Icon: React.ElementType }) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-600 hover:text-green-600 text-sm transition-colors"
    >
      <Icon className="text-lg " /> {name}
    </a>
  </li>
));
SocialLink.displayName = "SocialLink";

const UsefulLink = memo(
  ({
    link,
    t,
    onModalOpen,
  }: {
    link: typeof USEFUL_LINKS[number];
    t: (key: string) => string;
    onModalOpen: () => void;
  }) => (
    <li>
      {link.isModal ? (
        <button
          onClick={onModalOpen}
          className="text-gray-600 hover:text-green-600 text-sm transition-colors"
        >
          {t(link.key)}
        </button>
      ) : (
        <Link
          href={link.href}
          className="text-gray-600 hover:text-green-600 text-sm transition-colors"
        >
          {t(link.key)}
        </Link>
      )}
    </li>
  )
);
UsefulLink.displayName = "UsefulLink";

const PhoneButton = memo(
  ({ phone, label }: { phone: string; label: string }) => (
    <a
      href={`tel:${phone}`}
      className="flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-medium rounded-full px-4 py-2 text-center hover:bg-green-700 transition-colors"
    >
      <FaPhoneAlt className="text-xs" /> {label}
    </a>
  )
);
PhoneButton.displayName = "PhoneButton";

const Footer = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = useCallback(() => setIsModalOpen(true), []);
  const handleModalClose = useCallback(() => setIsModalOpen(false), []);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <footer className="w-full bg-white shadow-md rounded-t-3xl border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Image
              src={logo}
              alt="MyProfi logo"
              width={120}
              height={120}
              className="rounded-xl object-contain"
              priority
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {t("footer.useful.title")}
            </h4>
            <ul className="flex flex-col gap-2">
              {USEFUL_LINKS.map((link) => (
                <UsefulLink
                  key={link.key}
                  link={link}
                  t={t}
                  onModalOpen={handleModalOpen}
                />
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {t("footer.social.title")}
            </h4>
            <ul className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((s) => (
                <SocialLink key={s.name} name={s.name} href={s.href} Icon={s.icon} />
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {t("footer.contacts.title")}
            </h4>
            <div className="flex flex-col gap-2">
              <PhoneButton
                phone="+998956272727"
                label={t("footer.contacts.phone1")}
              />
              <PhoneButton
                phone="+998956272727"
                label={t("footer.contacts.phone2")}
              />
              <p className="text-xs text-gray-600 whitespace-pre-line mt-2">
                {t("footer.contacts.address")}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          {t("footer.copyright", { year: currentYear })}
        </div>
      </footer>

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-5"
              onClick={handleModalClose}
            >
              <motion.div
                layoutId="privacy-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white p-8 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  {t("footer.privacyPolicy.title")}
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {t("footer.privacyPolicy.content")}
                </p>
                <button
                  onClick={handleModalClose}
                  className="absolute top-3 right-3 bg-gray-100 w-8 h-8 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                  aria-label="Закрыть модальное окно"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
};

export default memo(Footer);
