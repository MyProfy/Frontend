"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  children: React.ReactNode;
  duration?: number;
  onLoadingComplete?: () => void;
}

export default function Loader({
  children,
  duration = 6000,
  onLoadingComplete,
}: LoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Найди проверенного специалиста за минуты!",

    "Реши любую задачу — от дизайна до ремонта.",

    "Сотни исполнителей готовы начать уже сегодня!",

    "Заявка бесплатно — результат быстро.",

    "Найми лучших — просто опиши, что тебе нужно."
  ];

  useEffect(() => {
    setMounted(true);

    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    const timer = setTimeout(() => {
      setLocalLoading(false);
      clearInterval(msgInterval);
      if (onLoadingComplete) onLoadingComplete();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(msgInterval);
    };
  }, [duration, onLoadingComplete]);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {localLoading && (
          <motion.div
            className="fixed top-1/2 left-1/2 w-screen h-screen bg-white z-[1000] flex justify-center items-center flex-col gap-5 md:gap-10 overflow-hidden -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px] flex justify-center items-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-[0_0_15px_rgba(144,238,144,0.5)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    scale: [1, 1.45, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-[120px] h-[120px] md:w-[140px] md:h-[140px] border-2 border-green-400 rounded-full shadow-[0_0_10px_rgba(144,238,144,0.5)] opacity-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0.9, 1.8, 0.9],
                      opacity: [0.6, 0.2, 0],
                    }}
                    transition={{
                      duration: 1.6,
                      delay: i * 0.25,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                className="text-2xl md:text-4xl font-medium text-green-700 px-6 md:px-24 text-center tracking-wide mt-6 md:mt-8"
                style={{ textShadow: "0 0 12px rgba(144, 238, 144, 0.6)" }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                {messages[messageIndex]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!localLoading && children}
    </>
  );
}
