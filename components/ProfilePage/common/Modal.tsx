import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 16px;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  color: #000;
  margin: 0;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ModalButton = styled.button<{ isSave?: boolean }>`
  padding: 10px 16px;
  border: none;
  margin-top: 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.1s ease;

  ${({ isSave }) =>
    isSave
        ? `
        background: #C8FFC8;
        color: #1a1a1a;
        &:hover {
          background: #A8EFA8;
          transform: translateY(-1px);
        }
        &:active {
          transform: translateY(0);
        }
      `
 : `
        background: #e0e0e0;
        color: #333;
        &:hover {
          background: #d0d0d0;
          transform: translateY(-1px);
        }
        &:active {
          transform: translateY(0);
        }
      `}
`;

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave: () => void;
}

export default function Modal({ isOpen, onClose, title, children, onSave }: ModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            const input = contentRef.current.querySelector<HTMLElement>("input, select, textarea");
            input?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = () => onClose();
    const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <ModalOverlay
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <ModalContent
                ref={contentRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                variants={{
                    initial: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.9 },
                }}
                initial="initial"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                onClick={handleContentClick}
            >
                <ModalTitle id="modal-title">{title}</ModalTitle>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                >
                    {children}
                    <ModalButtons>
                        <ModalButton type="button" onClick={onClose}>
                            Отмена
                        </ModalButton>
                        <ModalButton type="submit" isSave>
                            Сохранить
                        </ModalButton>
                    </ModalButtons>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
}