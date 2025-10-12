"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import FocusTrap from 'focus-trap-react';
import LogoMyProfi from "@/public/MyProfyLogo.png";
import Image from 'next/image';

// Styles
const ModalBackdrop = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const ModalContainer = styled(motion.div)`
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    position: relative;
`;

const ModalTitle = styled(motion.h2)`
    margin: 0 0 23px;
    font-size: 1.25rem;
    color: #333;
    text-align: center;
    font-weight: 600;
`;

const InputContainer = styled(motion.div)`
    position: relative;
    width: 100%;
    margin-bottom: 16px;
`;

const Select = styled(motion.select)`
    padding: 10px 14px 10px 36px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
    outline: none;
    background: #fff;
    cursor: pointer;
    width: 100%;
    height: 40px;

    &:focus {
        border-color: #48bb78;
        box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.2);
    }
`;

const Button = styled(motion.button)`
    padding: 5px;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    background: #3ea23e;
    color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    margin-top: 10px;

    &:hover:not(:disabled) {
        background: #A8EFA8;
        color: #000;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const InputError = styled(motion.span)`
    color: #e53e3e;
    font-size: 0.8rem;
    margin-top: 4px;
    text-align: center;
    display: block;
`;


const Spinner = styled(FaSpinner)`
    animation: spin 1s linear infinite;
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
};

const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.3 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
};

interface RegionModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onSelectAction: (region: string) => void;
}

export default function RegionModal({ isOpen, onCloseAction, onSelectAction }: RegionModalProps) {
    const { t } = useTranslation();
    const [region, setRegion] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const regions = ['Ташкент', 'Андижан', 'Бухара', 'Фергана', 'Джизак', 'Наманган', 'Навои', 'Кашкадарья', 'Самарканд', 'Сырдарья', 'Сурхандарья', 'Хорезм', 'Каракалпакстан'];

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onCloseAction();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onCloseAction]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCloseAction();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onCloseAction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!region) {
            setError(t('register.errors.emptyRegion'));
            return;
        }
        setIsLoading(true);
        onSelectAction(region);
        setIsLoading(false);
        onCloseAction();
    };

    if (!isOpen) return null;

    return (
        <FocusTrap active={isOpen}>
            <ModalBackdrop initial="hidden" animate="visible" exit="exit" variants={backdropVariants}>
                <ModalContainer ref={modalRef} variants={containerVariants}>
                    <AnimatePresence>
                        <Image
                            src={LogoMyProfi}
                            alt="MyProfi logo"
                            width={46}
                            height={46}
                            style={{ display: "block", margin: "0 auto", marginBottom: "32px" }}
                        />                        <form onSubmit={handleSubmit}>
                            <ModalTitle variants={itemVariants}>{t('regionModal.title')}</ModalTitle>
                            <InputContainer variants={itemVariants}>
                                <Select value={region} onChange={e => setRegion(e.target.value)} required>
                                    <option value="">{t('regionModal.regionPlaceholder')}</option>
                                    {regions.map(reg => (
                                        <option key={reg} value={reg}>{t(`register.regions.${reg}`)}</option>
                                    ))}
                                </Select>
                            </InputContainer>
                            {error && <InputError variants={itemVariants}>{error}</InputError>}
                            <Button type="submit" disabled={isLoading} variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <FaMapMarkerAlt /> {isLoading ? <Spinner /> : t('regionModal.submit')}
                            </Button>
                        </form>
                    </AnimatePresence>
                </ModalContainer>
            </ModalBackdrop>
        </FocusTrap>
    );
}