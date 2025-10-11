"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import styled from "@emotion/styled";

const LoaderOverlay = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  transform: translate(-50%, -50%);
  @media (min-width: 769px) {
    gap: 40px;
  }
`;

const LoaderContainer = styled.div<{ width: string; height: string }>`
  position: relative;
  width: ${(props) => props.width || "100px"};
  height: ${(props) => props.height || "100px"};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const AnimationGroup = styled(motion.div) <{ top: string; left: string }>`
  position: absolute;
  top: ${(props) => props.top || "50%"};
  left: ${(props) => props.left || "50%"};
  transform: translate(-50%, -50%);
`;

const PulsingCircle = styled(motion.div) <{ width: string; height: string }>`
  width: ${(props) => props.width || "100px"};
  height: ${(props) => props.height || "100px"};
  background: linear-gradient(45deg, #90ee90, #016936);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(144, 238, 144, 0.5);
  position: absolute;
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%);
`;

const PulseTrail = styled(motion.div) <{ width: string; height: string }>`
  position: absolute;
  width: ${(props) => props.width || "100px"};
  height: ${(props) => props.height || "100px"};
  border: 2px solid #90ee90;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(144, 238, 144, 0.5);
  opacity: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LoaderText = styled(motion.div) <{ fontSize?: string; gap?: string; left?: string }>`
  font-size: ${(props) => props.fontSize || "2.5rem"};
  font-weight: 400;
  color: #016936; 
  padding: 0 100px;
  text-align: center;
  text-shadow: 0 0 12px rgba(144, 238, 144, 0.6);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  letter-spacing: 0.5px;
  margin-top: ${(props) => props.gap || "30px"};
  position: relative;
  left: ${(props) => props.left || "0"};
`;

const trailVariants = (i: number): Variants => ({
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0.9, 1.8, 0.9],
    opacity: [0.6, 0.2, 0],
    transition: {
      duration: 1.6,
      delay: i * 0.25,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
});

const circleVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.45, 1],
    opacity: [1, 0.8, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.4 } },
};

const textVariants: Variants = {
  initial: { y: 24, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const loaderVariants = {
  initial: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.5 } },
};

interface LoaderProps {
  children: React.ReactNode;
  isLoading?: boolean;
  containerSize?: { width: string; height: string };
  circleSize?: { width: string; height: string };
  trailSize?: { width: string; height: string };
  animationPosition?: { top?: string; left?: string };
  textSize?: string;
  textGap?: string;
  textPosition?: { left?: string };
  trailCount?: number;
  duration?: number;
  message?: string;
  onLoadingComplete?: () => void;
}

export default function Loader({
  children,
  isLoading = true,
  containerSize = { width: "100px", height: "100px" },
  circleSize = { width: "100px", height: "100px" },
  trailSize = { width: "100px", height: "100px" },
  animationPosition = { top: "50%", left: "50%" },
  textSize = "2.5rem",
  textGap = "50px",
  textPosition = { left: "0" },
  trailCount = 3,
  duration = 10000000000000,
  message = "Welcome...",
  onLoadingComplete,
}: LoaderProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState(isLoading);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      setLocalLoading(false);
      if (onLoadingComplete) {
        onLoadingComplete(); // Call 
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onLoadingComplete]);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {localLoading && (
          <LoaderOverlay
            variants={loaderVariants}
            initial="initial"
            animate="visible"
            exit="exit"
          >
            <LoaderContainer width={containerSize.width} height={containerSize.height}>
              <AnimationGroup top={animationPosition.top!} left={animationPosition.left!}>
                <PulsingCircle
                  variants={circleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  width={circleSize.width}
                  height={circleSize.height}
                />
                {Array.from({ length: trailCount }, (_, i) => (
                  <PulseTrail
                    key={`trail-${i}`}
                    variants={trailVariants(i)}
                    initial="initial"
                    animate="animate"
                    width={trailSize.width}
                    height={trailSize.height}
                  />
                ))}
              </AnimationGroup>
            </LoaderContainer>
            <LoaderText
              variants={textVariants}
              initial="initial"
              animate="animate"
              fontSize={textSize}
              gap={textGap}
              left={textPosition.left}
            >
              {message}
            </LoaderText>
          </LoaderOverlay>
        )}
      </AnimatePresence>
      {!localLoading && children}
    </>
  );
}