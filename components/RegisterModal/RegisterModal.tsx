"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  Variants,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  login,
  registerUser,
//   requestOTP,
//   resetPassword,
//   verifyOTP,
//   checkUser,
} from "../../components/types/apiClient";

import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaLockOpen,
  FaSpinner,
} from "react-icons/fa";
import FocusTrap from "focus-trap-react";
import Link from "next/link";

// Варианты анимации для иконок
const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    color: "#10b981",
    transition: { duration: 0.3 },
  },
  hover: { scale: 1.2, color: "#10b981", transition: { duration: 0.2 } },
  inactive: {
    opacity: 1,
    scale: 1,
    color: "#000000",
    transition: { duration: 0.3 },
  },
};

const eyeIconVariants: Variants = {
  hover: { scale: 1.15, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
  visible: {
    scale: 1,
    opacity: 1,
    color: "#10b981",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  hidden: {
    scale: 1,
    opacity: 0.7,
    color: "#000000",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

// Стили
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContainer = styled(motion.div) <{ isSmall?: boolean }>`
  background: #fff;
  border-radius: 34.62px;
  padding: 32px;
  width: 100%;
  max-width: 475px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 0;
`;

const ModalTitle = styled(motion.h2)`
  margin: 0 0 8px;
  font-size: 1.75rem;
  color: #2d3748;
  text-align: center;
  font-weight: 700;
`;

const Subtitle = styled(motion.p)`
  font-size: 0.9rem;
  color: #718096;
  text-align: center;
  margin: 0 0 24px;
  line-height: 1.4;
`;

const ErrorMessage = styled(motion.p)`
  font-size: 0.9rem;
  color: #e53e3e;
  text-align: center;
  margin: 0 0 24px;
  line-height: 1.4;
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 14.62px;
  &[data-has-error="true"] {
    border-color: #e53e3e;
  }
`;

const PhoneInput = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  background: transparent;
  transition: all 0.3s ease;
  border: none;
`;

const CountryCodeSelect = styled(motion.select)`
  padding: 12px 8px;
  border: none;
  font-size: 1rem;
  outline: none;
  background: transparent;
  cursor: pointer;
  width: 50px;
  height: 100%;
  line-height: 24px;
  appearance: none;
`;

const CountryCodeDisplay = styled(motion.span)`
  font-size: 1rem;
  color: #2d3748;
  margin-right: 8px;
`;

const Input = styled(motion.input)`
  padding: 12px 16px;
  border: none;
  font-size: 1rem;
  outline: none;
  background: transparent;
  width: 100%;
  height: 100%;
  line-height: 24px;
  &[data-has-icon="true"] {
    padding-left: 40px;
  }
  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }
`;

const PasswordContainer = styled(InputContainer)`
  position: relative;
  overflow: visible;
  background: #fff;
  transition: all 0.3s ease;
`;

const InputIcon = styled(motion.div)`
  position: absolute;
  font-size: 1.1rem;
  z-index: 2;
  left: 13px;
  top: 28%;
`;

const EyeIcon = styled(motion.div)`
  position: absolute;
  right: 9px;
  top: 8px;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 14.52px;
`;

const OTPContainer = styled(motion.div)`
  display: grid;
  gap: 12px 10px;          /* расстояние между ячейками */
  margin: 0 auto 20px;     /* центрируем блок по родителю */
  width: 100%;
  
  /* >500px: все в один ряд и по центру */
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: center; /* центрируем содержимое */
  align-content: center;
  justify-items: center;
  align-items: center;
  
  /* ≤500px: две колонки, тоже по центру */
  @media (max-width: 500px) {
    grid-auto-flow: row;
    grid-template-columns: repeat(6, max-content);
    justify-content: center;
    align-content: center;
    justify-items: center;
  }
`;



const OTPInput = styled(motion.input)`
  width: 53px;
  height: 60px;
  border: none;
  border-radius: 12.62px;
  font-size: 1.5rem;
  text-align: center;
  outline: none;
  background: #f2f3f7;
  transition: all 0.3s ease;
  
  
  @media (max-width: 500px) {
    width: 45px;
    height: 50px;
    font-size: 1.25rem;
  }
`;

const Select = styled(motion.select)`
  padding: 12px 30px 12px 16px;
  border: none;
  border-radius: 21.62px;
  font-size: 1rem;
  outline: none;
  background: transparent
  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath d='M1 1l5 4 5-4' stroke='%23000' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")
  no-repeat right 15px center;
  background-size: 12px;
  cursor: pointer;
  width: 100%;
  height: 48px;
  appearance: none;
  text-align: center;
  &:focus {
    outline: none;
  }
`;

const Button = styled(motion.button)`
  padding: 12px;
  max-width: 100%;
  border: none;
  border-radius: 12.62px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  background: #c9c9c966;
  color: #292c32;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover:not(:disabled) {
    background: #3ea23e;
    color: #fff;
  }
`;

const RegisterLink = styled(motion.a)`
  font-size: 0.9rem;
  color: #10b981;
  cursor: pointer;
  text-decoration: none;
  
  /* ВАЖНО: убрать ломающее layout */
  margin: 0;
  width: auto;
  
  /* Разрешаем перенос длинного слова */
  overflow-wrap: anywhere;
  word-break: break-word;
  
  /* Не даём элементу растягиваться/обрезаться */
  flex: 0 0 auto;
  min-width: 0;
  
  &:hover { color: #0f7a5c; text-decoration: underline; }
  
  /* На очень узких — на отдельной строке и по центру */
  @media (max-width: 480px) {
    flex-basis: 100%;
    text-align: center;
  }
`;

const ForgotPasswordLink = styled(motion.a)`
  font-size: 0.9rem;
  color: #718096;
  text-align: left;
  margin-top: 12px;
  cursor: pointer;
  text-decoration: none;
  
  /* убираем ломающее лэйаут */
  width: auto;
  display: inline;
  flex: 0 0 auto;
  min-width: 0;
  
  &:hover {
    color: #0f7a5c;
    text-decoration: underline;
  }
  
  /* телефон: на своей строке и по центру */
  @media (max-width: 480px) {
    display: block;
    flex-basis: 100%;
    width: 100%;
    text-align: center;
    margin-top: 8px;
  }
`;


const InputError = styled(motion.span)`
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 6px;
  text-align: center;
  font-weight: 500;
`;

const TelegramNote = styled(motion.p)`
  font-size: 0.85rem;
  color: #718096;
  text-align: center;
  margin-top: 8px;
  line-height: 1.4;
`;

const BackContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  gap: 8px;
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;          /* можно переносить на новую строку */
  margin-top: 12px;

  @media (max-width: 480px) {
    justify-content: center; /* по центру на узких экранах */
    gap: 8px 16px;
  }
`;

const BackArrow = styled(motion.div)`
  cursor: pointer;
  color: #10b981;
  font-size: 1rem;
  display: flex;
  align-items: center;
  &:hover {
    color: #0f7a5c;
  }
`;

const InfoText = styled(motion.p)`
  font-size: 0.9rem;
  color: #718096;
  text-align: center;
  margin: 10px 0 8px;
  line-height: 1.4;
`;

const ResendText = styled(motion.button) <{ disabled?: boolean }>`
  font-size: 0.9rem;
  color: ${(props) => (props.disabled ? "#718096" : "#10b981")};
  text-align: center;
  margin-top: 12px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  background: none;
  border: none;
  padding: 0;
  &:hover:not(:disabled) {
    color: #0f7a5c;
    text-decoration: underline;
  }
`;

// Анимации
const backdropVariants: Variants = {
  hidden: { opacity: 0, scale: 1.2, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 1.2,
    filter: "blur(10px)",
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 100, rotateX: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.1, 0.9],
      type: "spring",
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 100,
    rotateX: -10,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const buttonVariants: Variants = {
  hover: {
    background: "#3EA23E",
    color: "#fff",
    transition: { duration: 0.3 },
  },
  tap: { background: "#3EA23E", color: "#fff" },
  initial: { background: "#C9C9C966", color: "#292C32" },
};

interface RegisterModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function RegisterModal({
  isOpen,
  onCloseAction,
}: RegisterModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(5);
  const [countryCode, setCountryCode] = useState("+998");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [telegram, setTelegram] = useState("@");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [telegramMessage, setTelegramMessage] = useState("");
  const [showResendMessage, setShowResendMessage] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isRepeatNewPasswordFocused, setIsRepeatNewPasswordFocused] =
    useState(false);
  const [hasLoginError, setHasLoginError] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const telegramInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const repeatNewPasswordInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const otpRefs = useRef(
    Array(6)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>())
  );
  const router = useRouter();

  const iconControls: { [key: string]: ReturnType<typeof useAnimationControls> } = {
    password: useAnimationControls(),
    newPassword: useAnimationControls(),
    confirmPassword: useAnimationControls(),
    repeatNewPassword: useAnimationControls(),
  };

  // Полный номер телефона
  const phoneNumber = countryCode + phoneDigits;

  // Обработка клика вне модального окна
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCloseAction();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onCloseAction]);

  // Фокус на инпуте при смене шага
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isOpen) {
      if (step === 1 || step === 2 || step === 6)
        phoneInputRef.current?.focus();
      if (step === 3 || step === 7) otpRefs.current[0].current?.focus();
      if (step === 4) telegramInputRef.current?.focus();
      if (step === 8) newPasswordInputRef.current?.focus();
    } else {
      resetForm();
    }
  }, [isOpen, step]);

  // Таймер для повторной отправки OTP
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Показ сообщения о повторной отправке
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (step === 3 || step === 7) {
      const timer = setTimeout(() => setShowResendMessage(true), 60000);
      return () => clearTimeout(timer);
    } else {
      setShowResendMessage(false);
    }
  }, [step]);

  const phoneRegex = /^\+\d{7,14}$/;
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{8,}$/;
  const otpRegex = /^\d{6}$/;
  const telegramRegex = /^@[\w]{5,}$/;
  const nameRegex = /^[a-zA-Zа-яА-Я\s]{2,}$/;

  const validatePhone = () =>
    phoneRegex.test(phoneNumber) ? "" : t("register.errors.invalidPhone");
  const validatePassword = () =>
    passwordRegex.test(password) ? "" : t("register.errors.invalidPassword");
  const validateConfirmPassword = () =>
    password === confirmPassword ? "" : t("register.errors.passwordMismatch");
  const validateNewPassword = () =>
    passwordRegex.test(newPassword) ? "" : t("register.errors.invalidPassword");
  const validateRepeatNewPassword = () =>
    newPassword === repeatNewPassword
      ? ""
      : t("register.errors.passwordMismatch");
  const validateOtp = () =>
    otpRegex.test(otp) ? "" : t("register.errors.invalidOtp");
  const validateTelegram = () =>
    telegramRegex.test(telegram) ? "" : t("register.errors.invalidTelegram");
  const validateName = () =>
    nameRegex.test(name) ? "" : t("register.errors.invalidName");
  const validateGender = () => (gender ? "" : t("register.errors.emptyGender"));
  const validateRegion = () => (region ? "" : t("register.errors.emptyRegion"));

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhoneDigits(value.slice(0, 14 - countryCode.length));
    setHasLoginError(false);
  };

  const handleCountryCodeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
    setPhoneDigits(phoneDigits.slice(0, 14 - e.target.value.length));
    setHasLoginError(false);
  };

  const handleTelegramChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("@")) value = "@" + value.replace(/^@/, "");
    setTelegram(value);
  };

  const handleOtpInput = (index: number, value: string) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.replace(/[^0-9]/g, "").slice(0, 1);
    setOtpValues(newOtpValues);
    setOtp(newOtpValues.join(""));
    if (newOtpValues[index] && index < 5)
      otpRefs.current[index + 1].current?.focus();
    else if (!newOtpValues[index] && index > 0)
      otpRefs.current[index - 1].current?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1].current?.focus();
    }
  };

  const resetForm = () => {
    setStep(1);
    setCountryCode("+998");
    setPhoneDigits("");
    setPassword("");
    setConfirmPassword("");
    setNewPassword("");
    setRepeatNewPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
    setShowRepeatNewPassword(false);
    setOtp("");
    setOtpValues(["", "", "", "", "", ""]);
    setTelegram("@");
    setName("");
    setGender("");
    setRegion("");
    setError("");
    setIsLoading(false);
    setResendTimer(0);
    setTelegramMessage("");
    setShowResendMessage(false);
    setIsPasswordFocused(false);
    setIsConfirmPasswordFocused(false);
    setIsNewPasswordFocused(false);
    setIsRepeatNewPasswordFocused(false);
    setHasLoginError(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneError = validatePhone();
    const passwordError = validatePassword();
    if (phoneError || passwordError) {
      setError(phoneError || passwordError);
      setHasLoginError(true);
      return;
    }

    setIsLoading(true);
    try {
      await login({ phone: phoneNumber, password });
      onCloseAction();
      router.push("/profile");
    } catch (err: unknown) {
      setError(t("register.errors.loginFailed"));
      setHasLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhone()) return setError(validatePhone());

    setIsLoading(true);
    try {
      const userCheck = await checkUser({ phone: phoneNumber });
      if (userCheck.message === "User exists") {
        setError(t("register.errors.phoneAlreadyRegistered"));
        setIsLoading(false);
        return;
      }

      const response = await requestOTP({ phone: phoneNumber });
      setTelegramMessage(
        response.message ||
        t("register.otp.sentMessage", { bot: "https://t.me/MyProfy_OTP_bot" })
      );
      setStep(3);
      setResendTimer(60);
      setError("");
    } catch (err: unknown) {
      const errorMessage =
        (err as any).message || t("register.errors.otpRequestFailed");
      // Если ошибка "User not found", это нормальный случай для регистрации
      if (errorMessage === "User not found") {
        try {
          const response = await requestOTP({ phone: phoneNumber });
          setTelegramMessage(
            response.message ||
            t("register.otp.sentMessage", { bot: "https://t.me/MyProfy_OTP_bot" })
          );
          setStep(3);
          setResendTimer(60);
          setError("");
        } catch (otpErr: unknown) {
          const otpErrorMessage =
            (otpErr as any).response?.data?.error ||
            t("register.errors.otpRequestFailed");
          if (otpErrorMessage.includes("chat_id")) {
            setError(t("register.errors.noTelegramChat"));
          } else {
            setError(otpErrorMessage);
          }
        }
      } else if (errorMessage.includes("chat_id")) {
        setError(t("register.errors.noTelegramChat"));
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validatePhone()) return setError(validatePhone());

  //   setIsLoading(true);
  //   try {
  //     const response = await requestOTP({ phone: phoneNumber });
  //     setTelegramMessage(
  //       response.message ||
  //       t("register.otp.sentMessage", { bot: "https://t.me/MyProfy_OTP_bot" })
  //     );
  //     setStep(7);
  //     setResendTimer(60);
  //     setError("");
  //   } catch (err: unknown) {
  //     const errorMessage =
  //       (err as any).response?.data?.error ||
  //       t("register.errors.otpRequestFailed");
  //     if (errorMessage.includes("chat_id")) {
  //       setError(t("register.errors.noTelegramChat"));
  //     } else {
  //       setError(errorMessage);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleOtpSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateOtp()) return setError(validateOtp());

  //   setIsLoading(true);
  //   try {
  //     await verifyOTP({ phone: phoneNumber, otp });
  //     if (step === 3) setStep(4);
  //     if (step === 7) setStep(8);
  //     setError("");
  //   } catch (err: unknown) {
  //     setError(
  //       (err as any).response?.data?.error || t("register.errors.invalidOtp")
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      const response = await requestOTP({ phone: phoneNumber });
      setTelegramMessage(
        response.message ||
        t("register.otp.sentMessage", { bot: "https://t.me/MyProfy_OTP_bot" })
      );
      setResendTimer(60);
      setError("");
    } catch (err: unknown) {
      const errorMessage =
        (err as any).response?.data?.error || t("register.otpResendFailed");
      if (errorMessage.includes("chat_id")) {
        setError(t("register.errors.noTelegramChat"));
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTelegram()) return setError(validateTelegram());
    setStep(5);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = [
      validateName(),
      validatePassword(),
      validateConfirmPassword(),
      validateGender(),
      validateRegion(),
    ];
    if (errors.some(Boolean)) {
      return setError(errors.find(Boolean) || "");
    } else {
      setStep(9);
    }

    try {
      await registerUser({
        phone: phoneNumber,
        telegram,
        name,
        password,
        gender,
        region,
      });
      await login({ phone: phoneNumber, password });
    } catch (err: unknown) {
      setError(
        (err as any).response?.data?.error ||
        t("register.errors.registrationFailed")
      );
    }
  };

  // const handleNewPasswordSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const newPasswordError = validateNewPassword();
  //   const repeatNewPasswordError = validateRepeatNewPassword();
  //   if (newPasswordError || repeatNewPasswordError)
  //     return setError(newPasswordError || repeatNewPasswordError);

  //   setIsLoading(true);
  //   try {
  //     await resetPassword({ phone: phoneNumber, new_password: newPassword });
  //     await login({ phone: phoneNumber, password: newPassword });
  //     onCloseAction();
  //     router.push("/profile");
  //   } catch (err: unknown) {
  //     setError(
  //       (err as any).message || t("register.errors.passwordResetFailed")
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const countryCodes = [
    { code: "+998", flag: "🇺🇿" },
    { code: "+996", flag: "🇰🇬" },
    { code: "+7", flag: "🇷🇺" },
    { code: "+1", flag: "🇺🇸" },
    { code: "+44", flag: "🇬🇧" },
    { code: "+91", flag: "🇮🇳" },
    { code: "+86", flag: "🇨🇳" },
    { code: "+90", flag: "🇹🇷" },
    { code: "+60", flag: "🇲🇾" },
    { code: "+971", flag: "🇦🇪" },
  ];

  const regions = [
    "Ташкент",
    "Андижан",
    "Бухара",
    "Фергана",
    "Джизак",
    "Наманган",
    "Навои",
    "Кашкадарья",
    "Самарканд",
    "Сырдарья",
    "Сурхандарья",
    "Хорезм",
    "Каракалпакстан",
  ];

  if (!isOpen) return null;

  const logosvg = (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="250 620 1500 760"
      style={{ width: "150px", height: "75px" }}
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="193.35"
          y1="721.45"
          x2="826.38"
          y2="1149.17"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.21" stopColor="#3ea240" />
          <stop offset="0.84" stopColor="#50d253" />
          <stop offset="1" stopColor="#56e059" />
        </linearGradient>
      </defs>
      <path
        fill="url(#linear-gradient)"
        d="M608.5,998.53c39.55-42.8,36.9-109.8-5.91-149.35-19.68-18.19-44.98-28.07-71.62-28.07-1.42,0-2.85.03-4.28.08-28.21,1.11-54.29,13.15-73.45,33.88-19.16,20.74-29.1,47.69-27.98,75.9.65,16.48,5.03,32.23,12.69,46.3,5.45,10.02,12.57,19.19,21.2,27.16l187.04,172.81,126.61,116.99c-33.5,36.26-79.13,54.63-124.89,54.63-41.25,0-82.62-14.93-115.31-45.13l-188.81-174.45c-8.4-7.77-16.27-15.97-23.57-24.59-16.42-19.38-30-40.87-40.54-64.18-14.69-32.49-22.86-67.08-24.27-102.81-1.41-35.74,4-70.86,16.08-104.41,12.52-34.77,31.67-66.25,56.9-93.56,25.23-27.31,55.1-48.88,88.77-64.11,32.48-14.69,67.07-22.86,102.81-24.27,35.74-1.41,70.87,4,104.41,16.08,34.77,12.53,66.25,31.67,93.56,56.9,27.31,25.23,48.88,55.1,64.11,88.77,14.69,32.49,22.86,67.08,24.27,102.81,1.41,35.74-4,70.86-16.08,104.41-12.52,34.77-31.67,66.25-56.9,93.56-16.59,17.96-35.2,33.44-55.57,46.26l-138.56-128.03c25.6-2.01,50.53-13.28,69.29-33.59Z"
      />
      <g fill="#202020">
        <path d="M1134.91,842.98v103h43.91v-114.62c0-19.05-5.09-34.47-15.26-46.25-10.17-11.79-25.21-17.68-45.12-17.68-11.62,0-22.2,2.56-31.72,7.67-8.85,4.75-16.01,11.27-21.51,19.51-4.13-7.48-9.8-13.64-17.07-18.46-8.77-5.81-19.99-8.72-33.66-8.72-11.95,0-22.74,2.64-32.37,7.91-7.37,4.03-13.58,9.18-18.65,15.42v-19.13h-38.75v174.35h44.23v-105.58c0-10.01,2.77-18.16,8.31-24.46,5.54-6.3,12.89-9.44,22.04-9.44s17.09,3.2,22.52,9.6c5.43,6.4,8.15,15.36,8.15,26.88v103h43.91v-105.58c0-6.67,1.26-12.56,3.79-17.68,2.53-5.11,6.05-9.09,10.57-11.95,4.52-2.85,9.85-4.28,15.98-4.28,9.58,0,17.08,3.2,22.52,9.6c5.43,6.4,8.15,15.36,8.15,26.88Z" />
        <polygon points="1277.29,1023.46 1375.77,771.62 1331.86,771.62 1286.32,890.26 1240.49,771.62 1194.96,771.62 1265.29,944.6 1236.61,1023.46 1277.29,1023.46" />
        <path d="M1051.93,1060.49c-12.38-7.96-26.91-11.95-43.59-11.95s-30.51,4.04-41.81,12.11c-1.05.75-2.06,1.56-3.07,2.36v-9.63h-38.75v251.84h44.23v-83.58c11.31,7.28,25.19,10.93,41.65,10.93s30.08-4.03,42.13-12.11c12.05-8.07,21.44-19.05,28.17-32.93,6.72-13.88,10.09-29.54,10.09-46.98s-3.42-33.55-10.25-47.38c-6.84-13.83-16.44-24.72-28.82-32.69ZM1040.14,1167.28c-2.91,8.02-7.37,14.39-13.4,19.13-6.03,4.74-13.78,7.1-23.25,7.1s-17.62-2.21-23.49-6.62c-5.87-4.41-10.09-10.6-12.67-18.56-2.58-7.96-3.87-17.22-3.87-27.77s1.29-19.8,3.87-27.77c2.58-7.96,6.7-14.15,12.35-18.57,5.65-4.41,13.05-6.62,22.2-6.62,9.79,0,17.84,2.4,24.13,7.18,6.3,4.79,10.95,11.19,13.96,19.21,3.01,8.02,4.52,16.87,4.52,26.56s-1.45,18.7-4.36,26.72Z" />
        <path d="M1213.04,1052.98c-5.27.38-10.39,1.29-15.34,2.74-4.95,1.45-9.52,3.47-13.72,6.05-5.49,3.23-10.12,7.32-13.88,12.27-1.79,2.35-3.4,4.83-4.84,7.43v-28.09h-38.74v174.35h44.23v-89.11c0-6.67.91-12.67,2.74-18,1.83-5.33,4.52-9.95,8.07-13.88,3.55-3.93,7.91-7.08,13.08-9.44,5.17-2.47,10.95-3.95,17.35-4.44,6.4-.48,12.03.03,16.87,1.53v-41.01c-5.27-.65-10.55-.78-15.82-.40Z" />
        <path d="M1381.01,1060.32c-13.29-7.86-28.71-11.79-46.25-11.79s-32.45,3.88-45.69,11.62c-13.24,7.75-23.63,18.54-31.16,32.37-7.53,13.83-11.3,29.84-11.3,48.03s3.69,33.88,11.06,47.7c7.37,13.83,17.68,24.67,30.91,32.53,13.24,7.85,28.63,11.78,46.17,11.78s32.8-3.9,46.09-11.7c13.29-7.8,23.68-18.62,31.16-32.45,7.48-13.83,11.22-29.79,11.22-47.87s-3.71-33.87-11.14-47.7c-7.43-13.83-17.79-24.67-31.08-32.53ZM1366.32,1177.29c-6.94,9.52-17.46,14.29-31.56,14.29s-24.03-4.6-31.08-13.8c-7.05-9.2-10.57-21.6-10.57-37.21,0-10.12,1.48-18.99,4.44-26.64,2.96-7.64,7.51-13.61,13.64-17.92,6.13-4.3,13.99-6.46,23.57-6.46,13.88,0,24.35,4.63,31.4,13.88,7.05,9.26,10.57,21.63,10.57,37.13s-3.47,27.2-10.41,36.73Z" />
        <path d="M1520.74,990.66c-5.92.16-12.03,1.35-18.32,3.55-6.3,2.21-12.14,6.32-17.52,12.35-4.2,4.63-7.08,9.79-8.64,15.5-1.56,5.71-2.45,11.36-2.66,16.95-.21,5.33-.31,10.11-.32,14.37h-27.45v33.9h27.44v140.45h43.91v-140.45h40.36v-33.9h-40.36v-9.69c0-4.84,1.67-9.01,5-12.51,3.33-3.5,8.45-5.25,15.34-5.25h20.02v-35.52h-21.63c-4.2,0-9.26.08-15.18.24Z" />
        <polygon points="1700.9,1053.38 1655.35,1172.02 1609.52,1053.38 1564,1053.38 1634.33,1226.36 1605.65,1305.23 1646.33,1305.23 1744.81,1053.38 1700.9,1053.38" />
      </g>
    </svg>
  );

  const handleSubmit = () => {
    setIsLoading(true);
    router.push("/profile");
    onCloseAction();
    setIsLoading(false);
  };

  const OTP_LEN = 6;
  // otpValues: string[];  // ['','','','','','']
  // otpRefs:   React.RefObject<HTMLInputElement>[]

  // Пастим начиная с текущего индекса; если вставили ровно 6 символов — заполняем с нуля
  const handleOtpPaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const raw = (e.clipboardData || (window as any).clipboardData).getData("text");

    // Разреши только цифры/буквы, убери пробелы и лишнее
    const chars = raw.replace(/\s+/g, "").replace(/[^\dA-Za-z]/g, "").split("");
    if (!chars.length) return;

    setOtpValues(prev => {
      const next = [...prev];
      let start = chars.length === OTP_LEN ? 0 : index;   // если вставили полный код — заполняем с начала
      for (let i = 0; i < chars.length && start + i < OTP_LEN; i++) {
        next[start + i] = chars[i];
      }
      return next;
    });

    // Фокус на следующее поле после последнего заполненного
    const filledTo = Math.min((chars.length === OTP_LEN ? 0 : index) + chars.length, OTP_LEN - 1);
    const nextFocus = Math.min(filledTo + 1, OTP_LEN - 1);
    otpRefs.current[nextFocus]?.current?.focus();
  };

  return (
    <FocusTrap active={isOpen}>
      <ModalBackdrop
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ModalContainer
          ref={modalRef}
          variants={containerVariants}
          isSmall={step === 6 || step === 7}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Form
                key="step1"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleLoginSubmit}
              >
                <div style={{ textAlign: "center", padding: "20px" }}>{logosvg}</div>
                <ModalTitle variants={itemVariants}>
                  {t("register.login.title")}
                </ModalTitle>
                {hasLoginError ? (
                  <ErrorMessage variants={itemVariants}>
                    {t("register.errors.invalidCredentials")}
                  </ErrorMessage>
                ) : (
                  <InfoText variants={itemVariants}>
                    {t("register.login.userCount")}
                  </InfoText>
                )}
                <InputContainer
                  variants={itemVariants}
                  data-has-error={hasLoginError}
                >
                  <PhoneInput>
                    <CountryCodeSelect
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      required
                    >
                      {countryCodes.map(({ code, flag }) => (
                        <option key={code} value={code}>
                          {flag}
                        </option>
                      ))}
                    </CountryCodeSelect>
                    <CountryCodeDisplay>{countryCode}</CountryCodeDisplay>
                    <Input
                      data-has-icon="false"
                      type="tel"
                      ref={phoneInputRef}
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      maxLength={14 - countryCode.length}
                      placeholder={t("register.login.phonePlaceholder")}
                      required
                    />
                  </PhoneInput>
                </InputContainer>
                <PasswordContainer
                  variants={itemVariants}
                  data-has-error={hasLoginError}
                >
                  <InputIcon
                    variants={iconVariants}
                    animate={isPasswordFocused ? "hover" : "inactive"}
                  >
                    {isPasswordFocused ? <FaLockOpen /> : <FaLock />}
                  </InputIcon>
                  <Input
                    data-has-icon="true"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    placeholder={t("register.login.passwordPlaceholder")}
                    required
                    onFocus={() => {
                      setIsPasswordFocused(true);
                      iconControls.password.start("hover");
                    }}
                    onBlur={() => {
                      setIsPasswordFocused(false);
                      iconControls.password.start("inactive");
                    }}
                  />
                  <EyeIcon
                    variants={eyeIconVariants}
                    animate={showPassword ? "visible" : "hidden"}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </EyeIcon>
                </PasswordContainer>
                {error && !hasLoginError && (
                  <InputError variants={itemVariants}>{error}</InputError>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? <FaSpinner /> : t("register.login.submit")}
                </Button>
                <ActionsRow>
                  <ForgotPasswordLink variants={itemVariants} onClick={() => setStep(6)}>
                    {t("register.forgotPassword")}
                  </ForgotPasswordLink>

                  <RegisterLink variants={itemVariants} onClick={() => setStep(2)}>
                    {t("register.registerLink")}
                  </RegisterLink>
                </ActionsRow>

              </Form>
            )}

            {step === 2 && (
              <Form
                key="step2"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleRegisterPhoneSubmit}
              >
                <div style={{ textAlign: "center", padding: "20px" }}>{logosvg}</div>
                <ModalTitle variants={itemVariants}>
                  {t("register.register.title")}
                </ModalTitle>
                <InfoText variants={itemVariants}>
                  {t("register.login.userCount")}
                </InfoText>
                <InputContainer variants={itemVariants}>
                  <PhoneInput>
                    <CountryCodeSelect
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      required
                    >
                      {countryCodes.map(({ code, flag }) => (
                        <option key={code} value={code}>
                          {flag}
                        </option>
                      ))}
                    </CountryCodeSelect>
                    <CountryCodeDisplay>{countryCode}</CountryCodeDisplay>
                    <Input
                      data-has-icon="false"
                      type="tel"
                      ref={phoneInputRef}
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      maxLength={14 - countryCode.length}
                      placeholder={t("register.register.phonePlaceholder")}
                      required
                    />
                  </PhoneInput>
                </InputContainer>
                <TelegramNote variants={itemVariants}>
                  {t("register.otp.note")}{" "}
                  <a
                    href="https://t.me/MyProfy_OTP_bot"
                    target="_blank"
                    style={{ color: "#10b981" }}
                  >
                    @MyProfy_OTP_bot
                  </a>
                  .
                </TelegramNote>
                {error && (
                  <InputError variants={itemVariants}>{error}</InputError>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? <FaSpinner /> : t("register.register.submit")}
                </Button>
                <InfoText variants={itemVariants}>
                  {t("register.register.searchSpecialists")}
                </InfoText>
                <BackContainer
                  variants={itemVariants}
                  style={{ justifyContent: "center" }}
                >
                  <motion.a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setStep(1);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      textDecoration: "none",
                    }}
                    whileHover={{ color: "#0f7a5c" }}
                  >
                    <BackArrow>
                      <FaArrowLeft style={{ marginRight: "2px" }} />
                    </BackArrow>
                    <span style={{ fontSize: "0.9rem", color: "#10b981" }}>
                      {t("register.login.title")}
                    </span>
                  </motion.a>
                </BackContainer>
              </Form>
            )}

            {step === 3 && (
              <Form
                key="step3"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleOtpSubmit}
              >
                <div style={{ textAlign: "center", padding: "20px" }}>{logosvg}</div>
                <ModalTitle variants={itemVariants}>
                  {t("register.otp.title")}
                </ModalTitle>
                <TelegramNote variants={itemVariants}>
                  {t("register.otp.sentMessage")}
                  <a
                    style={{ color: "#10b981", marginLeft: "5px" }}
                    href="https://t.me/MyProfy_OTP_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MyProfy_OTP_bot
                  </a>
                </TelegramNote>
                <motion.div variants={itemVariants} style={{ border: "none" }}>
                  <OTPContainer variants={itemVariants}>
                    {otpValues.map((value, index) => (
                      <OTPInput
                        key={index}
                        ref={otpRefs.current[index]}
                        type="text"
                        value={value}
                        maxLength={1}
                        onChange={(e) => handleOtpInput(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={(e) => handleOtpPaste(index, e)}   // <-- добавили
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="\d*"
                      />
                    ))}

                  </OTPContainer>
                </motion.div>
                {error && (
                  <InputError variants={itemVariants}>{error}</InputError>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? <FaSpinner /> : t("register.otp.submit")}
                </Button>
                <ResendText
                  variants={itemVariants}
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0
                    ? t("register.otp.resendTimer", { seconds: resendTimer })
                    : t("register.otp.resend")}
                </ResendText>
                <BackContainer variants={itemVariants}>
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(2)}
                    whileHover={{ color: "#0f7a5c" }}
                  >
                    <BackArrow>
                      <FaArrowLeft />
                    </BackArrow>
                    <span style={{ fontSize: "0.9rem", color: "#10b981" }}>
                      {t("register.register.backToLogin")}
                    </span>
                  </motion.div>
                </BackContainer>
              </Form>
            )}

            {step === 4 && (
              <Form
                key="step4"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleTelegramSubmit}
              >
                <div style={{ textAlign: "center", padding: "20px" }}>{logosvg}</div>
                <ModalTitle variants={itemVariants}>
                  {t("register.telegram.title")}
                </ModalTitle>
                <InputContainer variants={itemVariants}>
                  <Input
                    data-has-icon="false"
                    type="text"
                    ref={telegramInputRef}
                    value={telegram}
                    onChange={handleTelegramChange}
                    placeholder={t("register.telegram.placeholder")}
                    required
                  />
                </InputContainer>
                {error && (
                  <InputError variants={itemVariants}>{error}</InputError>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? <FaSpinner /> : t("register.telegram.submit")}
                </Button>
                <BackContainer variants={itemVariants}>
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(3)}
                    whileHover={{ color: "#0f7a5c" }}
                  >
                    <BackArrow>
                      <FaArrowLeft />
                    </BackArrow>
                    <span style={{ fontSize: "0.9rem", color: "#10b981" }}>
                      {t("register.register.backToLogin")}
                    </span>
                  </motion.div>
                </BackContainer>
              </Form>
            )}

            {step === 5 && (
              <Form
                key="step5"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleProfileSubmit}
              >
                <div style={{ textAlign: "center", marginTop: "20px" }}>{logosvg}</div>
                <ModalTitle variants={itemVariants}>
                  {t("register.profile.welcomeTitle")}
                </ModalTitle>
                <Subtitle variants={itemVariants}>
                  {t("register.profile.welcomeSubtitle")}
                </Subtitle>
                <InputContainer variants={itemVariants}>
                  <Input
                    data-has-icon="false"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("register.profile.namePlaceholder")}
                    required
                  />
                </InputContainer>
                <PasswordContainer variants={itemVariants}>
                  <InputIcon
                    variants={iconVariants}
                    animate={isPasswordFocused ? "hover" : "inactive"}
                  >
                    {isPasswordFocused ? <FaLockOpen /> : <FaLock />}
                  </InputIcon>
                  <Input
                    data-has-icon="true"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    placeholder={t("register.profile.passwordPlaceholder")}
                    required
                    onFocus={() => {
                      setIsPasswordFocused(true);
                      iconControls.password.start("hover");
                    }}
                    onBlur={() => {
                      setIsPasswordFocused(false);
                      iconControls.password.start("inactive");
                    }}
                  />
                  <EyeIcon
                    variants={eyeIconVariants}
                    animate={showPassword ? "visible" : "hidden"}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </EyeIcon>
                </PasswordContainer>
                <PasswordContainer variants={itemVariants}>
                  <InputIcon
                    variants={iconVariants}
                    animate={isConfirmPasswordFocused ? "hover" : "inactive"}
                  >
                    {isConfirmPasswordFocused ? <FaLockOpen /> : <FaLock />}
                  </InputIcon>
                  <Input
                    data-has-icon="true"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder={t(
                      "register.profile.confirmPasswordPlaceholder"
                    )}
                    required
                    onFocus={() => {
                      setIsConfirmPasswordFocused(true);
                      iconControls.confirmPassword.start("hover");
                    }}
                    onBlur={() => {
                      setIsConfirmPasswordFocused(false);
                      iconControls.confirmPassword.start("inactive");
                    }}
                  />
                  <EyeIcon
                    variants={eyeIconVariants}
                    animate={showConfirmPassword ? "visible" : "hidden"}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </EyeIcon>
                </PasswordContainer>
                <InputContainer variants={itemVariants}>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">
                      {t("register.profile.genderPlaceholder")}
                    </option>
                    <option value="male">
                      {t("register.profile.gender.male")}
                    </option>
                    <option value="female">
                      {t("register.profile.gender.female")}
                    </option>
                  </Select>
                </InputContainer>
                <InputContainer variants={itemVariants}>
                  <Select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required
                  >
                    <option value="">
                      {t("register.profile.regionPlaceholder")}
                    </option>
                    {regions.map((reg) => (
                      <option key={reg} value={reg}>
                        {t(`register.regions.${reg}`)}
                      </option>
                    ))}
                  </Select>
                </InputContainer>
                {error && (
                  <InputError variants={itemVariants}>{error}</InputError>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? <FaSpinner /> : t("register.profile.submit")}
                </Button>
                <BackContainer variants={itemVariants}>
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(4)}
                    whileHover={{ color: "#0f7a5c" }}
                  >
                    <BackArrow>
                      <FaArrowLeft />
                    </BackArrow>
                    <span style={{ fontSize: "0.9rem", color: "#10b981" }}>
                      {t("register.register.backToLogin")}
                    </span>
                  </motion.div>
                </BackContainer>
              </Form>
            )}

            {step === 6 && (
              <Form
                key="step6"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleForgotPasswordSubmit}
              >
                <div style={{ textAlign: "center", marginTop: "20px" }}>{logosvg}</div>
                <ModalTitle variants={itemVariants}>
                  {t("register.forgotPasswordForm.title")}
                </ModalTitle>
                <InputContainer variants={itemVariants}>
                  <PhoneInput>
                    <CountryCodeSelect
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      required
                    >
                      {countryCodes.map(({ code, flag }) => (
                        <option key={code} value={code}>
                          {flag}
                        </option>
                      ))}
                    </CountryCodeSelect>
                    <CountryCodeDisplay>{countryCode}</CountryCodeDisplay>
                    <Input
                      data-has-icon="false"
                      type="tel"
                      ref={phoneInputRef}
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      maxLength={14 - countryCode.length}
                      placeholder={t(
                        "register.forgotPasswordForm.phonePlaceholder"
                      )}
                      required
                    />
                  </PhoneInput>
                </InputContainer>
                <TelegramNote variants={itemVariants}>
                  {t("register.otp.note")}{" "}
                  <a
                    href="https://t.me/MyProfy_OTP_bot"
                    target="_blank"
                    style={{ color: "#10b981" }}
                  >
                    @MyProfy_OTP_bot
                  </a>
                  .
                </TelegramNote>
                {error && (
                  <InputError variants={itemVariants}>{error}</InputError>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? (
                    <FaSpinner />
                  ) : (
                    t("register.forgotPasswordForm.submit")
                  )}
                </Button>
                <BackContainer variants={itemVariants}>
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(1)}
                    whileHover={{ color: "#0f7a5c" }}
                  >
                    <BackArrow>
                      <FaArrowLeft />
                    </BackArrow>
                    <span style={{ fontSize: "0.9rem", color: "#10b981" }}>
                      {t("register.register.backToLogin")}
                    </span>
                  </motion.div>
                </BackContainer>
              </Form>
            )}

            {step === 7 && (
              <Form
                key="step7"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleOtpSubmit}
              >
                <div style={{ textAlign: "center", marginTop: "20px" }}>{logosvg}</div>
                <ModalTitle variants={itemVariants}>
                  {t("register.otp.title")}
                </ModalTitle>
                <TelegramNote variants={itemVariants}>
                  {t("register.otp.sentMessage")}{" "}
                  <Link
                    href="https://t.me/MyProfy_OTP_bot"
                    target="_blank"
                    style={{ color: "#10b981" }}
                  >
                    @MyProfy_OTP_bot
                  </Link>
                </TelegramNote>
                <motion.div variants={itemVariants} style={{ border: "none" }}>
                  <OTPContainer variants={itemVariants}>
                    {otpValues.map((value, index) => (
                      <OTPInput
                        key={index}
                        ref={otpRefs.current[index]}
                        type="text"
                        value={value}
                        onChange={(e) => handleOtpInput(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={(e) => handleOtpPaste(index, e)}
                        maxLength={1}
                        required
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="\d*"
                      />
                    ))}
                  </OTPContainer>
                </motion.div>
                {error && (
                  <InputError variants={itemVariants}>{error}</InputError>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? <FaSpinner /> : t("register.otp.submit")}
                </Button>
                <ResendText
                  variants={itemVariants}
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0
                    ? t("register.otp.resendTimer", { seconds: resendTimer })
                    : t("register.otp.resend")}
                </ResendText>
                <BackContainer variants={itemVariants}>
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(6)}
                    whileHover={{ color: "#0f7a5c" }}
                  >
                    <BackArrow>
                      <FaArrowLeft />
                    </BackArrow>
                    <span style={{ fontSize: "0.9rem", color: "#10b981" }}>
                      {t("register.register.backToLogin")}
                    </span>
                  </motion.div>
                </BackContainer>
              </Form>
            )}

            {step === 8 && (
              <Form
                key="step8"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleNewPasswordSubmit}
              >
                <div style={{ textAlign: "center", padding: "20px" }}>{logosvg}</div>
                <ModalTitle variants={itemVariants}>
                  {t("register.newPassword.title")}
                </ModalTitle>
                <PasswordContainer variants={itemVariants}>
                  <InputIcon
                    variants={iconVariants}
                    animate={isNewPasswordFocused ? "hover" : "inactive"}
                  >
                    {isNewPasswordFocused ? <FaLockOpen /> : <FaLock />}
                  </InputIcon>
                  <Input
                    data-has-icon="true"
                    type={showNewPassword ? "text" : "password"}
                    ref={newPasswordInputRef}
                    value={newPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder={t(
                      "register.newPassword.newPasswordPlaceholder"
                    )}
                    required
                    onFocus={() => {
                      setIsNewPasswordFocused(true);
                      iconControls.newPassword.start("hover");
                    }}
                    onBlur={() => {
                      setIsNewPasswordFocused(false);
                      iconControls.newPassword.start("inactive");
                    }}
                  />
                  <EyeIcon
                    variants={eyeIconVariants}
                    animate={showNewPassword ? "visible" : "hidden"}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                  </EyeIcon>
                </PasswordContainer>
                <PasswordContainer variants={itemVariants}>
                  <InputIcon
                    variants={iconVariants}
                    animate={isRepeatNewPasswordFocused ? "hover" : "inactive"}
                  >
                    {isRepeatNewPasswordFocused ? <FaLockOpen /> : <FaLock />}
                  </InputIcon>
                  <Input
                    data-has-icon="true"
                    type={showRepeatNewPassword ? "text" : "password"}
                    ref={repeatNewPasswordInputRef}
                    value={repeatNewPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setRepeatNewPassword(e.target.value)
                    }
                    placeholder={t(
                      "register.newPassword.repeatPasswordPlaceholder"
                    )}
                    required
                    onFocus={() => {
                      setIsRepeatNewPasswordFocused(true);
                      iconControls.repeatNewPassword.start("hover");
                    }}
                    onBlur={() => {
                      setIsRepeatNewPasswordFocused(false);
                      iconControls.repeatNewPassword.start("inactive");
                    }}
                  />
                  <EyeIcon
                    variants={eyeIconVariants}
                    animate={showRepeatNewPassword ? "visible" : "hidden"}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() =>
                      setShowRepeatNewPassword(!showRepeatNewPassword)
                    }
                  >
                    {showRepeatNewPassword ? <FaEye /> : <FaEyeSlash />}
                  </EyeIcon>
                </PasswordContainer>
                {error && (
                  <InputError variants={itemVariants}>{error}</InputError>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? <FaSpinner /> : t("register.newPassword.submit")}
                </Button>
                <BackContainer variants={itemVariants}>
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(7)}
                    whileHover={{ color: "#0f7a5c" }}
                  >
                    <BackArrow>
                      <FaArrowLeft />
                    </BackArrow>
                    <span style={{ fontSize: "0.9rem", color: "#10b981" }}>
                      {t("register.register.backToLogin")}
                    </span>
                  </motion.div>
                </BackContainer>
              </Form>
            )}

            {step === 9 && (
              <Form
                key="step9"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "24px",
                    position: "relative",
                  }}
                >
                  <div style={{ marginBottom: "16px", textAlign: "center" }}>
                    {logosvg}
                  </div>
                  <h1
                    style={{
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#000000",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {t("registerCoolText1.title")}
                  </h1>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666666",
                      margin: "0 0 16px 0",
                      textAlign: "center",
                    }}
                  >
                    {t("registerCoolText1.description")}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: "16px",
                      marginBottom: "16px",
                      height: "161px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        background: "#e6ffe6",
                        borderRadius: "8px",
                        padding: "12px",
                        width: "100%",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#000000",
                          margin: "0",
                        }}
                      >
                        {t("registerCoolText1.subtitle")}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        background: "#e6ffe6",
                        borderRadius: "8px",
                        padding: "12px",
                        width: "100%",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#000000",
                          margin: "0",
                        }}
                      >
                        {t("registerCoolText1.subtitle2")}
                      </p>
                    </div>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "#ffffff",
                      background: "#3ea240",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(10)}
                    type="button"
                  >
                    {t("registerCoolText1.button")}
                  </button>
                </div>
              </Form>
            )}

            {step === 10 && (
              <Form
                key="step10"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleNewPasswordSubmit}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "24px",
                    position: "relative",
                  }}
                >
                  <div style={{ marginBottom: "16px", textAlign: "center" }}>
                    {logosvg}
                  </div>
                  <h1
                    style={{
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#000000",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {t("registerCoolText2.title")}
                  </h1>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666666",
                      margin: "0 0 16px 0",
                      textAlign: "center",
                    }}
                  >
                    {t("registerCoolText2.description")}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: "16px",
                      marginBottom: "16px",
                      height: "161px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        background: "#e6ffe6",
                        borderRadius: "8px",
                        padding: "12px",
                        width: "100%",
                        marginBottom: "16px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#000000",
                          margin: "0",
                        }}
                      >
                        {t("registerCoolText2.boost_description")}
                      </p>
                    </div>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "#ffffff",
                      background: "#3ea240",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleSubmit();
                    }}
                    type="button"
                  >
                    {t("registerCoolText2.button")}
                  </button>
                </div>
              </Form>
            )}
          </AnimatePresence>
        </ModalContainer>
      </ModalBackdrop>
    </FocusTrap>
  );
}