"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
        <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100]"
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                ref={contentRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="bg-white rounded-[12px] p-5 w-full max-w-[500px] flex flex-col gap-[15px] shadow-lg md:max-w-[90%] md:p-4"
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
                <h3 id="modal-title" className="text-[1.1rem] font-medium text-black m-0">{title}</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                >
                    {children}
                    <div className="flex gap-[10px] justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-[16px] py-[10px] border-none mt-[20px] rounded-[8px] text-sm cursor-pointer transition-all duration-300 bg-[#e0e0e0] text-[#333] hover:bg-[#d0d0d0] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-[16px] py-[10px] border-none mt-[20px] rounded-[8px] text-sm cursor-pointer transition-all duration-300 bg-[#C8FFC8] text-[#1a1a1a] hover:bg-[#A8EFA8] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}