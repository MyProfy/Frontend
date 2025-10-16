"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import img from "../../public/avatar/logo.svg";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const socialLinks = [
    { name: "Telegram", href: "https://t.me/yourpage" },
    { name: "Facebook", href: "https://facebook.com/yourpage" },
    { name: "Instagram", href: "https://instagram.com/yourpage" },
    { name: "YouTube", href: "https://youtube.com/yourchannel" },
    { name: "Twitter", href: "https://twitter.com/yourpage" },
  ];

  const usefulLinks = [
    { key: "footer.useful.newTask", href: "#" },
    { key: "footer.useful.allServices", href: "#" },
    { key: "footer.useful.allReviews", href: "#" },
    { key: "footer.useful.termsOfUse", href: "#" },
    { key: "footer.useful.linkCatalog", href: "#" },
    { key: "footer.useful.privacyPolicy", href: "#", isModal: true },
  ];

  return (
    <>
      <footer className="w-full bg-white shadow-md rounded-t-3xl  border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Image
              src={img}
              alt="MyProfi logo"
              width={120}
              height={120}
              className="rounded-xl object-contain"
            />
          </div>

          {/* Полезно */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {t("footer.useful.title")}
            </h4>
            <ul className="flex flex-col gap-2">
              {usefulLinks.map((link) => (
                <li key={link.key}>
                  {link.isModal ? (
                    <button
                      onClick={() => setIsModalOpen(true)}
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
              ))}
            </ul>
          </div>

          {/* Соцсети */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {t("footer.social.title")}
            </h4>
            <ul className="flex flex-col gap-2">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 text-sm transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {t("footer.contacts.title")}
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+998555115544"
                className="bg-green-600 text-white text-sm font-medium rounded-full px-4 py-2 text-center hover:bg-green-700 transition"
              >
                {t("footer.contacts.phone1")}
              </a>
              <a
                href="tel:+998555115588"
                className="bg-green-600 text-white text-sm font-medium rounded-full px-4 py-2 text-center hover:bg-green-700 transition"
              >
                {t("footer.contacts.phone2")}
              </a>
              <p className="text-xs text-gray-600 whitespace-pre-line mt-2">
                {t("footer.contacts.address")}
              </p>
            </div>
          </div>
        </div>

        {/* Низ */}
        <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </footer>

      {/* Модалка */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-5"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              {t("footer.privacyPolicy.title")}
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {t("footer.privacyPolicy.content")}
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 bg-gray-100 w-8 h-8 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
