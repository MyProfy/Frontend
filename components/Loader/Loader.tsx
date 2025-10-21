"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  children: React.ReactNode;
  duration?: number;
  message?: string;
  onLoadingComplete?: () => void;
}

export default function Loader({
  children,
  duration = 3000,
  message = "Welcome...",
  onLoadingComplete,
}: LoaderProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      setLocalLoading(false);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
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
                  initial={{ scale: 1, opacity: 1 }}
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
            <motion.div
              className="text-3xl md:text-4xl font-normal text-green-700 px-8 md:px-24 text-center tracking-wide mt-6 md:mt-8"
              style={{ textShadow: '0 0 12px rgba(144, 238, 144, 0.6)' }}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {message}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {!localLoading && children}
    </>
  );
}