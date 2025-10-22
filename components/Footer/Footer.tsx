"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import img from "../../public/avatar/logo.svg";

const SOCIAL_LINKS = [
  { name: "Telegram", href: "https://t.me/yourpage" },
  { name: "Facebook", href: "https://facebook.com/yourpage" },
  { name: "Instagram", href: "https://instagram.com/yourpage" },
  { name: "YouTube", href: "https://youtube.com/yourchannel" },
  { name: "Twitter", href: "https://twitter.com/yourpage" },
] as const;

const USEFUL_LINKS = [
  { key: "footer.useful.newTask", href: "#", isModal: false },
  { key: "footer.useful.allServices", href: "#", isModal: false },
  { key: "footer.useful.allReviews", href: "#", isModal: false },
  { key: "footer.useful.termsOfUse", href: "#", isModal: false },
  { key: "footer.useful.linkCatalog", href: "#", isModal: false },
  { key: "footer.useful.privacyPolicy", href: "#", isModal: true },
] as const;

const MODAL_BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const MODAL_CONTENT_VARIANTS = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

const SocialLink = memo(({ name, href }: { name: string; href: string }) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-green-600 text-sm transition-colors"
    >
      {name}
    </a>
  </li>
));

SocialLink.displayName = "SocialLink";

const UsefulLink = memo(({
  link,
  t,
  onModalOpen
}: {
  link: typeof USEFUL_LINKS[number];
  t: any;
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
));
UsefulLink.displayName = "UsefulLink";

const PrivacyModal = memo(({
  isOpen,
  onClose,
  t
}: {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}) => (
  <AnimatePresence mode="wait">
    {isOpen && (
      <motion.div
        variants={MODAL_BACKDROP_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-5"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        <motion.div
          variants={MODAL_CONTENT_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="bg-white p-8 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h3
            id="privacy-modal-title"
            className="text-2xl font-semibold mb-4 text-gray-800"
          >
            {t("footer.privacyPolicy.title")}
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {t("footer.privacyPolicy.content")}
          </p>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-gray-100 w-8 h-8 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
            aria-label="Закрыть модальное окно"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));
PrivacyModal.displayName = "PrivacyModal";

const PhoneButton = memo(({ phone, label }: { phone: string; label: string }) => (
  <a
    href={`tel:${phone}`}
    className="bg-green-600 text-white text-sm font-medium rounded-full px-4 py-2 text-center hover:bg-green-700 transition-colors"
  >
    {label}
  </a>
));
PhoneButton.displayName = "PhoneButton";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleModalOpen = useCallback(() => setIsModalOpen(true), []);
  const handleModalClose = useCallback(() => setIsModalOpen(false), []);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <footer className="w-full bg-white shadow-md rounded-t-3xl border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12">

          <div className="flex flex-col items-center md:items-start gap-3">
            <Image
              src={img}
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
              {SOCIAL_LINKS.map((social) => (
                <SocialLink
                  key={social.name}
                  name={social.name}
                  href={social.href}
                />
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

      <PrivacyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        t={t}
      />
    </>
  );
};

export default memo(Footer);