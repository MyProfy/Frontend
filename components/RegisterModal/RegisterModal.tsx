"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  Variants,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiClient } from "../types/apiClient";
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
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
  registerStepComplete,
} from "../../store/slices/authSlice";
import {
  closeModal,
  setModalStep,
  resetModal,
} from "../../store/slices/uiSlice";

interface RootState {
  auth: {
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    token: string | null;
    user: any | null;
  };
  ui: {
    modal: {
      isOpen: boolean;
      currentStep: number;
    };
  };
}

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
  const dispatch = useDispatch();
  const { isLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const { modal } = useSelector((state: RootState) => state.ui);

  const step = modal.currentStep;

  const [countryCode, setCountryCode] = useState("+998");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [telegram, setTelegram] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [hasLoginError, setHasLoginError] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const telegramInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const otpRefs = useRef<React.RefObject<HTMLInputElement>[]>(
    Array(4)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>())
  );
  const router = useRouter();

  const iconControls: { [key: string]: ReturnType<typeof useAnimationControls> } = {
    password: useAnimationControls(),
    confirmPassword: useAnimationControls(),
  };

  const phoneNumber = countryCode + phoneDigits;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isOpen) {
      if (step === 1 || step === 2) phoneInputRef.current?.focus();
      if (step === 3) otpRefs.current[0].current?.focus();
      if (step === 4) telegramInputRef.current?.focus();
    } else {
      resetForm();
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const phoneRegex = /^\+\d{7,14}$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*-]{6,}$/;
  const otpRegex = /^\d{4}$/;
  const telegramRegex = /^@[\w]{3,}$/;
  const nameRegex = /^[a-zA-Zа-яА-Я\s]{2,}$/;

  const validatePhone = () => phoneRegex.test(phoneNumber) ? "" : t("register.errors.invalidPhone");
  const validatePassword = () => passwordRegex.test(password) ? "" : t("register.errors.invalidPassword");
  const validateConfirmPassword = () => password === confirmPassword ? "" : t("register.errors.passwordMismatch");
  const validateOtp = () => otpRegex.test(otp) ? "" : t("register.errors.invalidOtp");
  const validateTelegram = () => telegramRegex.test(telegram) ? "" : t("register.errors.invalidTelegram");
  const validateName = () => nameRegex.test(name) ? "" : t("register.errors.invalidName");
  const validateGender = () => gender ? "" : t("register.errors.emptyGender");
  const validateRegion = () => region ? "" : t("register.errors.emptyRegion");

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("input register: ", e.target.value)
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhoneDigits(value.slice(0, 14 - countryCode.length));
    setHasLoginError(false);
    console.log("phoneDigits: ", hasLoginError)
    dispatch(clearError());
  };

  const handleCountryCodeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
    setPhoneDigits(phoneDigits.slice(0, 14 - e.target.value.length));
    setHasLoginError(false);
    dispatch(clearError());
  };

  const handleTelegramChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("@")) value = "@" + value.replace(/^@/, "");
    setTelegram(value);
    dispatch(clearError());
  };


  const handleOtpAutoSubmit = async (otpCode: string) => {
    console.log("🚀 Auto-submitting OTP:", otpCode);
    dispatch(clearError());

    const otpError = otpRegex.test(otpCode) ? "" : t("register.errors.invalidOtp");
    if (otpError) {
      console.error("❌ OTP validation failed:", otpError);
      dispatch(registerFailure(otpError));
      return;
    }

    dispatch(registerStart());
    try {
      console.log("📤 Verifying OTP with phone:", phoneNumber, "code:", otpCode);
      const result = await apiClient.verifyOTP({ phone: phoneNumber, code: otpCode });
      console.log("✅ OTP verified successfully!", result);
      dispatch(registerStepComplete());
      handleSetStep(4);
    } catch (err: any) {
      console.error("❌ OTP verification failed:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.detail ||
        (Array.isArray(err.response?.data) ? err.response.data[0] : null) ||
        t("register.errors.invalidOtp") ||
        "Неверный код";
      dispatch(registerFailure(errorMessage));
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.replace(/[^0-9]/g, "").slice(0, 1);
    setOtpValues(newOtpValues);
    const newOtp = newOtpValues.join("");
    setOtp(newOtp);
    dispatch(clearError());

    if (newOtpValues[index] && index < 3) {
      otpRefs.current[index + 1].current?.focus();
    } else if (!newOtpValues[index] && index > 0) {
      otpRefs.current[index - 1].current?.focus();
    }

    if (newOtp.length === 4 && newOtpValues.every(v => v !== "")) {
      console.log("🔢 All 4 digits entered, auto-submitting OTP:", newOtp);
      setTimeout(() => {
        handleOtpAutoSubmit(newOtp);
      }, 300);
    }
  };

  const handleOtpPaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const raw = (e.clipboardData || (window as any).clipboardData).getData("text");
    const chars = raw.replace(/\s+/g, "").replace(/[^\d]/g, "").split("");

    if (!chars.length) return;

    const newOtpValues = [...otpValues];
    let start = chars.length === 4 ? 0 : index;

    for (let i = 0; i < chars.length && start + i < 4; i++) {
      newOtpValues[start + i] = chars[i];
    }

    setOtpValues(newOtpValues);
    const newOtp = newOtpValues.join("");
    setOtp(newOtp);
    dispatch(clearError());

    const filledTo = Math.min((chars.length === 4 ? 0 : index) + chars.length, 3);
    const nextFocus = Math.min(filledTo, 3);
    otpRefs.current[nextFocus]?.current?.focus();

    if (newOtp.length === 4 && newOtpValues.every(v => v !== "")) {
      console.log("🔢 Full OTP pasted, auto-submitting:", newOtp);
      setTimeout(() => {
        handleOtpAutoSubmit(newOtp);
      }, 300);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1].current?.focus();
    }
  };


  const resetForm = () => {
    dispatch(resetModal());
    setCountryCode("+998");
    setPhoneDigits("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOtp("");
    setOtpValues(["", "", "", ""]);
    setTelegram("");
    setName("");
    setGender("");
    setRegion("");
    setResendTimer(0);
    setIsPasswordFocused(false);
    setIsConfirmPasswordFocused(false);
    setHasLoginError(false);
    dispatch(clearError());
  };

  const handleClose = () => {
    resetForm();
    onCloseAction();
    dispatch(closeModal());
  };

  const handleSetStep = (newStep: number) => {
    dispatch(setModalStep(newStep));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const phoneError = validatePhone();
    // const passwordError = validatePassword();

    console.log("📞 Login - Phone:", phoneNumber);
    console.log("🔐 Login - Password length:", password.length);

    if (phoneError) {
      console.error("❌ Phone validation failed:", phoneError);
      dispatch(loginFailure(phoneError));
      setHasLoginError(true);
      return;
    }

    if (!password || password.length < 1) {
      console.error("❌ Password is empty");
      dispatch(loginFailure(t("register.errors.emptyPassword") || "Введите пароль"));
      setHasLoginError(true);
      return;
    }

    dispatch(loginStart());
    try {
      console.log("🔄 Attempting login with:", { phone: phoneNumber, password: "***" });
      const response = await apiClient.login({ phone: phoneNumber, password: password });
      console.log("✅ Login successful:", response);

      localStorage.setItem("token", response.token);
      dispatch(loginSuccess({ token: response.token, user: response.user }));
      handleClose();
    } catch (err: any) {
      console.error("❌ Login failed:", err.response?.data || err.message);

      let errorMessage = t("register.errors.loginFailed") || "Ошибка входа";

      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.non_field_errors) {
          errorMessage = Array.isArray(err.response.data.non_field_errors)
            ? err.response.data.non_field_errors[0]
            : err.response.data.non_field_errors;
        }
      }

      if (err.response?.status === 401) {
        errorMessage = t("register.errors.invalidCredentials") || "Неверный телефон или пароль";
      }

      dispatch(loginFailure(errorMessage));
      setHasLoginError(true);
    }
  };

  const handleRegisterPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const phoneError = validatePhone();
    if (phoneError) {
      dispatch(registerFailure(phoneError));
      return;
    }

    dispatch(registerStart());
    try {
      await apiClient.requestOTP(phoneNumber);
      dispatch(registerStepComplete());
      handleSetStep(3);
      setResendTimer(60);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || t("register.errors.otpRequestFailed");

      if (errorMessage.includes("User exists")) {
        dispatch(registerFailure(t("register.errors.phoneAlreadyRegistered") || "Номер уже зарегистрирован"));
      } else if (errorMessage.includes("chat_id")) {
        dispatch(registerFailure(t("register.errors.noTelegramChat") || "Сначала напишите боту"));
      } else {
        dispatch(registerFailure(errorMessage));
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const otpError = validateOtp();
    if (otpError) {
      dispatch(registerFailure(otpError));
      return;
    }

    dispatch(registerStart());
    try {
      await apiClient.verifyOTP({ phone: phoneNumber, code: otp });
      dispatch(registerStepComplete()); // Используем новое действие
      handleSetStep(4);
    } catch (err: any) {
      dispatch(registerFailure(err.response?.data?.error || t("register.errors.invalidOtp") || "Неверный код"));
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    dispatch(registerStart());
    try {
      await apiClient.requestOTP(phoneNumber);
      dispatch(registerStepComplete());
      setResendTimer(60);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || t("register.otpResendFailed") || "Ошибка отправки";
      if (errorMessage.includes("chat_id")) {
        dispatch(registerFailure(t("register.errors.noTelegramChat") || "Сначала напишите боту"));
      } else {
        dispatch(registerFailure(errorMessage));
      }
    }
  };



  const handleTelegramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const telegramError = validateTelegram();
    if (telegramError) {
      dispatch(registerFailure(telegramError));
      return;
    }

    dispatch(registerStart());
    try {
      // const result = await apiClient.getTelegramId(telegram);
      // setTelegramId(result.telegram_id);

      // setTelegramId(0);

      dispatch(registerStepComplete());
      handleSetStep(5);
    } catch (err: any) {
      dispatch(registerFailure(
        err.response?.data?.error ||
        t("register.errors.telegramNotFound") ||
        "Telegram не найден"
      ));
    }
  };
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    console.log("🔍 Валидация полей:", {
      name: name, validateName: validateName(),
      password: password ? '***' : 'empty', validatePassword: validatePassword(),
      confirmPassword: confirmPassword ? '***' : 'empty', validateConfirmPassword: validateConfirmPassword(),
      gender: gender, validateGender: validateGender(),
      region: region, validateRegion: validateRegion(),
    });

    const errors = [
      validateName(),
      validatePassword(),
      validateConfirmPassword(),
      validateGender(),
      validateRegion(),
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error("❌ Валидация провалилась:", errors[0]);
      dispatch(registerFailure(errors[0]));
      return;
    }
    console.log("✅ Валидация прошла, отправляем API...");
    console.log("📤 Отправка данных:", {
      phone: phoneNumber,
      name: name,
      gender: gender,
      region: region,
      telegram_username: telegram,
      role: "client"
    });

    dispatch(registerStart());
    try {
      const response = await apiClient.register({
        phone: phoneNumber,
        password: password,
        name: name,
        role: "client",
        region: region,
        gender: gender as "male" | "female",
        telegram_id: 0,
        telegram_username: telegram,
      });

      console.log("✅ Регистрация успешна:", response);
      localStorage.setItem("token", response.token);
      dispatch(registerSuccess({ token: response.token, user: response.user }));
      handleSetStep(9);
    } catch (err: any) {
      console.error("❌ Ошибка регистрации:", err.response?.data || err.message);
      let errorMessage = t("register.errors.registrationFailed") || "Ошибка регистрации";

      if (err.response?.data) {
        if (Array.isArray(err.response.data)) {
          errorMessage = err.response.data[0];
        } else if (typeof err.response.data === 'object') {
          const firstError = Object.values(err.response.data)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError as string;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }

      dispatch(registerFailure(errorMessage));
    }
  };

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

  const error = authError;

  const logosvg = (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="250 620 1500 760"
      className="w-[150px] h-[75px]"
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
        <path d="M1134.91,842.98v103h43.91v-114.62c0-19.05-5.09-34.47-15.26-46.25-10.17-11.79-25.21-17.68-45.12-17.68-11.62,0-22.2,2.56-31.72,7.67-8.85,4.75-16.01,11.27-21.51,19.51-4.13-7.48-9.8-13.64-17.07-18.46-8.77-5.81-19.99-8.72-33.66-8.72-11.95,0-22.74,2.64-32.37,7.91-7.37,4.03-13.58,9.18-18.65,15.42v-19.13h-38.75v174.35h44.23v-105.58c0-10.01,2.77-18.16,8.31-24.46c5.54-6.3,12.89-9.44,22.04-9.44s17.09,3.2,22.52,9.6c5.43,6.4,8.15,15.36,8.15,26.88v103h43.91v-105.58c0-6.67,1.26-12.56,3.79-17.68c2.53-5.11,6.05-9.09,10.57-11.95c4.52-2.85,9.85-4.28,15.98-4.28,9.58,0,17.08,3.2,22.52,9.6c5.43,6.4,8.15,15.36,8.15,26.88Z" />
        <polygon points="1277.29,1023.46 1375.77,771.62 1331.86,771.62 1286.32,890.26 1240.49,771.62 1194.96,771.62 1265.29,944.6 1236.61,1023.46 1277.29,1023.46" />
        <path d="M1051.93,1060.49c-12.38-7.96-26.91-11.95-43.59-11.95s-30.51,4.04-41.81,12.11c-1.05.75-2.06,1.56-3.07,2.36v-9.63h-38.75v251.84h44.23v-83.58c11.31,7.28,25.19,10.93,41.65,10.93s30.08-4.03,42.13-12.11c12.05-8.07,21.44-19.05,28.17-32.93c6.72-13.88,10.09-29.54,10.09-46.98s-3.42-33.55-10.25-47.38c-6.84-13.83-16.44-24.72-28.82-32.69ZM1040.14,1167.28c-2.91,8.02-7.37,14.39-13.4,19.13-6.03,4.74-13.78,7.1-23.25,7.1s-17.62-2.21-23.49-6.62c-5.87-4.41-10.09-10.6-12.67-18.56-2.58-7.96-3.87-17.22-3.87-27.77s1.29-19.8,3.87-27.77c2.58-7.96,6.7-14.15,12.35-18.57c5.65-4.41,13.05-6.62,22.2-6.62,9.79,0,17.84,2.4,24.13,7.18c6.3,4.79,10.95,11.19,13.96,19.21c3.01,8.02,4.52,16.87,4.52,26.56s-1.45,18.7-4.36,26.72Z" />
        <path d="M1213.04,1052.98c-5.27.38-10.39,1.29-15.34,2.74-4.95,1.45-9.52,3.47-13.72,6.05-5.49,3.23-10.12,7.32-13.88,12.27-1.79,2.35-3.4,4.83-4.84,7.43v-28.09h-38.74v174.35h44.23v-89.11c0-6.67.91-12.67,2.74-18c1.83-5.33,4.52-9.95,8.07-13.88c3.55-3.93,7.91-7.08,13.08-9.44c5.17-2.47,10.95-3.95,17.35-4.44c6.4-.48,12.03.03,16.87,1.53v-41.01c-5.27-.65-10.55-.78-15.82-.4Z" />
        <path d="M1381.01,1060.32c-13.29-7.86-28.71-11.79-46.25-11.79s-32.45,3.88-45.69,11.62c-13.24,7.75-23.63,18.54-31.16,32.37-7.53,13.83-11.3,29.84-11.3,48.03s3.69,33.88,11.06,47.7c7.37,13.83,17.68,24.67,30.91,32.53c13.24,7.85,28.63,11.78,46.17,11.78s32.8-3.9,46.09-11.7c13.29-7.8,23.68-18.62,31.16-32.45c7.48-13.83,11.22-29.79,11.22-47.87s-3.71-33.87-11.14-47.7c-7.43-13.83-17.79-24.67-31.08-32.53ZM1366.32,1177.29c-6.94,9.52-17.46,14.29-31.56,14.29s-24.03-4.6-31.08-13.8c-7.05-9.2-10.57-21.6-10.57-37.21,0-10.12,1.48-18.99,4.44-26.64c2.96-7.64,7.51-13.61,13.64-17.92c6.13-4.3,13.99-6.46,23.57-6.46,13.88,0,24.35,4.63,31.4,13.88c7.05,9.26,10.57,21.63,10.57,37.13s-3.47,27.2-10.41,36.73Z" />
        <path d="M1520.74,990.66c-5.92.16-12.03,1.35-18.32,3.55-6.3,2.21-12.14,6.32-17.52,12.35-4.2,4.63-7.08,9.79-8.64,15.5-1.56,5.71-2.45,11.36-2.66,16.95-.21,5.33-.31,10.11-.32,14.37h-27.45v33.9h27.44v140.45h43.91v-140.45h40.36v-33.9h-40.36v-9.69c0-4.84,1.67-9.01,5-12.51c3.33-3.5,8.45-5.25,15.34-5.25h20.02v-35.52h-21.63c-4.2,0-9.26.08-15.18.24Z" />
        <polygon points="1700.9,1053.38 1655.35,1172.02 1609.52,1053.38 1564,1053.38 1634.33,1226.36 1605.65,1305.23 1646.33,1305.23 1744.81,1053.38 1700.9,1053.38" />
      </g>
    </svg>
  );

  return (
    <FocusTrap active={isOpen}>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[1000] flex justify-center items-center p-5"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          ref={modalRef}
          className="bg-white rounded-[34.62px] p-8 w-full max-w-[475px] relative overflow-hidden flex flex-col justify-center pt-0 shadow-2xl"
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                className="flex flex-col gap-6"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleLoginSubmit}
              >
                <div className="text-center p-5">{logosvg}</div>
                <motion.h2
                  className="m-0 mb-2 text-[1.75rem] text-[#2d3748] text-center font-bold"
                  variants={itemVariants}
                >
                  {t("register.login.title") || "Вход в аккаунт"}
                </motion.h2>
                {hasLoginError ? (
                  <motion.p
                    className="text-[0.9rem] text-[#e53e3e] text-center m-0 mb-6 leading-[1.4]"
                    variants={itemVariants}
                  >
                    {t("register.errors.invalidCredentials") || "Неверный телефон или пароль"}
                  </motion.p>
                ) : (
                  <motion.p
                    className="text-[0.9rem] text-[#718096] text-center m-0 mb-6 leading-[1.4]"
                    variants={itemVariants}
                  >
                    {t("register.login.userCount") || "Войдите в свой аккаунт"}
                  </motion.p>
                )}

                <motion.div
                  className={`relative w-full min-h-[56px] border-2 ${hasLoginError ? "border-[#e53e3e]" : "border-[#e2e8f0] hover:border-[#3ea23e]"} rounded-[16px] transition-all duration-300`}
                  variants={itemVariants}
                >
                  <div className="flex items-center w-full h-[56px] bg-transparent">
                    <select
                      className="p-4 border-none text-base outline-none bg-transparent cursor-pointer w-[60px] h-full leading-[24px] appearance-none"
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      required
                    >
                      {countryCodes.map(({ code, flag }) => (
                        <option key={code} value={code}>
                          {flag}
                        </option>
                      ))}
                    </select>
                    <span className="text-base text-[#2d3748] mr-2 font-medium">{countryCode}</span>
                    <input
                      className="p-4 border-none text-base outline-none bg-transparent w-full h-full leading-[24px] placeholder:text-[#a0aec0] placeholder:italic font-medium"
                      type="tel"
                      ref={phoneInputRef}
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      maxLength={14 - countryCode.length}
                      placeholder={t("register.login.phonePlaceholder") || "Номер телефона"}
                      required
                    />
                  </div>
                </motion.div>

                <div
                  className={`relative overflow-visible bg-white transition-all duration-300 min-h-[56px] border-2 ${hasLoginError ? "border-[#e53e3e]" : "border-[#e2e8f0] hover:border-[#3ea23e]"} rounded-[16px]`}
                >
                  <motion.div
                    className="absolute text-[1.1rem] z-2 left-4 top-1/2 -translate-y-1/2"
                    variants={iconVariants}
                    animate={isPasswordFocused ? "hover" : "inactive"}
                  >
                    {isPasswordFocused ? <FaLockOpen /> : <FaLock />}
                  </motion.div>
                  <input
                    className="p-4 border-none text-base outline-none bg-transparent w-full h-full leading-[24px] pl-12 placeholder:text-[#a0aec0] placeholder:italic font-medium rounded-xl"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    placeholder={t("register.login.passwordPlaceholder") || "Пароль"}
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
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[1.2rem] flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                    variants={eyeIconVariants}
                    animate={showPassword ? "visible" : "hidden"}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </motion.div>
                </div>

                {error && !hasLoginError && (
                  <motion.span
                    className="text-[#e53e3e] text-[0.85rem] mt-2 text-center font-medium bg-red-50 py-2 px-4 rounded-lg"
                    variants={itemVariants}
                  >
                    {error}
                  </motion.span>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="p-4 w-full border-none rounded-[16px] text-base font-semibold cursor-pointer bg-gradient-to-r from-[#3ea23e] to-[#2d8b2d] text-white flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 h-14"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Загрузка...</span>
                    </>
                  ) : (
                    t("register.login.submit") || "Войти"
                  )}
                </motion.button>

                <div className="flex justify-center items-center mt-4">
                  <motion.button
                    type="button"
                    className="text-[0.9rem] text-[#10b981] cursor-pointer no-underline bg-transparent border-none hover:text-[#0f7a5c] hover:underline font-medium"
                    variants={itemVariants}
                    onClick={() => handleSetStep(2)}
                  >
                    {t("register.registerLink") || "Создать аккаунт"}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                className="flex flex-col gap-6"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleRegisterPhoneSubmit}
              >
                <div className="text-center p-5">{logosvg}</div>
                <motion.h2
                  className="m-0 mb-2 text-[1.75rem] text-[#2d3748] text-center font-bold"
                  variants={itemVariants}
                >
                  {t("register.register.title") || "Регистрация"}
                </motion.h2>
                <motion.p
                  className="text-[0.9rem] text-[#718096] text-center m-0 mb-6 leading-[1.4]"
                  variants={itemVariants}
                >
                  {t("register.login.userCount") || "Создайте новый аккаунт"}
                </motion.p>

                <motion.div
                  className="relative w-full min-h-[56px] border-2 border-[#e2e8f0] hover:border-[#3ea23e] rounded-[16px] transition-all duration-300"
                  variants={itemVariants}
                >
                  <div className="flex items-center w-full h-[56px] bg-transparent">
                    <select
                      className="p-4 border-none text-base outline-none bg-transparent cursor-pointer w-[60px] h-full leading-[24px] appearance-none"
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      required
                    >
                      {countryCodes.map(({ code, flag }) => (
                        <option key={code} value={code}>
                          {flag}
                        </option>
                      ))}
                    </select>
                    <span className="text-base text-[#2d3748] mr-2 font-medium">{countryCode}</span>
                    <input
                      className="p-4 border-none text-base outline-none bg-transparent w-full h-full leading-[24px] placeholder:text-[#a0aec0] placeholder:italic font-medium"
                      type="tel"
                      ref={phoneInputRef}
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      maxLength={14 - countryCode.length}
                      placeholder={t("register.register.phonePlaceholder") || "Номер телефона"}
                      required
                    />
                  </div>
                </motion.div>

                <motion.p
                  className="text-[0.85rem] text-[#718096] text-center mt-2 leading-[1.4] bg-blue-50 py-3 px-4 rounded-lg"
                  variants={itemVariants}
                >
                  {t("register.otp.note") || "Для получения кода напишите боту:"}{" "}
                  <a
                    href="https://t.me/myprofy_bot"
                    target="_blank"
                    className="text-[#10b981] font-semibold hover:underline"
                  >
                    @myprofy_bot
                  </a>
                </motion.p>

                {error && (
                  <motion.span
                    className="text-[#e53e3e] text-[0.85rem] mt-2 text-center font-medium bg-red-50 py-2 px-4 rounded-lg"
                    variants={itemVariants}
                  >
                    {error}
                  </motion.span>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="p-4 w-full border-none rounded-[16px] text-base font-semibold cursor-pointer bg-gradient-to-r from-[#3ea23e] to-[#2d8b2d] text-white flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 h-14"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    t("register.register.submit") || "Получить код"
                  )}
                </motion.button>

                <motion.div
                  className="flex items-center justify-center mt-4"
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    onClick={() => handleSetStep(1)}
                    className="flex items-center gap-2 no-underline bg-transparent border-none text-[#10b981] hover:text-[#0f7a5c] cursor-pointer font-medium"
                  >
                    <FaArrowLeft />
                    <span>{t("register.login.title") || "Вход в аккаунт"}</span>
                  </button>
                </motion.div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                className="flex flex-col gap-6"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleOtpSubmit}
              >
                <div className="text-center p-5">{logosvg}</div>
                <motion.h2
                  className="m-0 mb-2 text-[1.75rem] text-[#2d3748] text-center font-bold"
                  variants={itemVariants}
                >
                  {t("register.otp.title") || "Подтверждение кода"}
                </motion.h2>
                <motion.p
                  className="text-[0.85rem] text-[#718096] text-center mt-2 leading-[1.4]"
                  variants={itemVariants}
                >
                  {t("register.otp.sentMessage") || "Код отправлен в Telegram:"}
                  <a
                    className="text-[#10b981] ml-1 font-semibold"
                    href="https://t.me/MyProfy_OTP_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MyProfy_OTP_bot
                  </a>
                </motion.p>

                <motion.div
                  className="border-none"
                  variants={itemVariants}
                >
                  <motion.div
                    className="grid grid-cols-4 gap-4 mx-auto mb-6 w-full max-w-[280px]"
                    variants={itemVariants}
                  >
                    {otpValues.map((value, index) => (
                      <input
                        key={index}
                        className="w-16 h-16 border-2 border-[#e2e8f0] rounded-[12px] text-2xl font-bold text-center outline-none bg-white transition-all duration-300 focus:border-[#3ea23e] focus:shadow-md"
                        ref={otpRefs.current[index]}
                        type="text"
                        value={value}
                        maxLength={1}
                        onChange={(e) => handleOtpInput(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={(e) => handleOtpPaste(index, e)}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="\d*"
                      />
                    ))}
                  </motion.div>
                </motion.div>

                {error && (
                  <motion.span
                    className="text-[#e53e3e] text-[0.85rem] mt-2 text-center font-medium bg-red-50 py-2 px-4 rounded-lg"
                    variants={itemVariants}
                  >
                    {error}
                  </motion.span>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="p-4 w-full border-none rounded-[16px] text-base font-semibold cursor-pointer bg-gradient-to-r from-[#3ea23e] to-[#2d8b2d] text-white flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 h-14"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Проверка...</span>
                    </>
                  ) : (
                    t("register.otp.submit") || "Подтвердить"
                  )}
                </motion.button>

                <motion.button
                  className={`text-[0.9rem] text-center mt-3 cursor-pointer bg-none border-none p-0 font-medium ${resendTimer > 0
                    ? "text-[#718096] cursor-not-allowed"
                    : "text-[#10b981] hover:text-[#0f7a5c] hover:underline"
                    }`}
                  variants={itemVariants}
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0
                    ? `${t("register.otp.resendTimer") || "Отправить повторно через"} ${resendTimer} сек.`
                    : t("register.otp.resend") || "Отправить код повторно"}
                </motion.button>

                <motion.div
                  className="flex items-center justify-center mt-4"
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    onClick={() => handleSetStep(2)}
                    className="flex items-center gap-2 no-underline bg-transparent border-none text-[#10b981] hover:text-[#0f7a5c] cursor-pointer font-medium"
                  >
                    <FaArrowLeft />
                    <span>{t("register.register.backToLogin") || "Назад к регистрации"}</span>
                  </button>
                </motion.div>
              </motion.form>
            )}

            {step === 4 && (
              <motion.form
                key="step4"
                className="flex flex-col gap-6"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleTelegramSubmit}
              >
                <div className="text-center p-5">{logosvg}</div>
                <motion.h2
                  className="m-0 mb-2 text-[1.75rem] text-[#2d3748] text-center font-bold"
                  variants={itemVariants}
                >
                  {t("register.telegram.title") || "Telegram"}
                </motion.h2>
                <motion.p
                  className="text-[0.9rem] text-[#718096] text-center m-0 mb-6 leading-[1.4]"
                  variants={itemVariants}
                >
                  {t("register.telegram.description") || "Введите ваш Telegram username"}
                </motion.p>

                <motion.div
                  className="relative w-full min-h-[56px] border-2 border-[#e2e8f0] hover:border-[#3ea23e] rounded-[16px] transition-all duration-300"
                  variants={itemVariants}
                >
                  <input
                    className="p-4 border-none text-base outline-none bg-transparent w-full h-full leading-[24px] placeholder:text-[#a0aec0] placeholder:italic font-medium"
                    type="text"
                    ref={telegramInputRef}
                    value={telegram}
                    onChange={handleTelegramChange}
                    placeholder={t("register.telegram.placeholder") || "@username"}
                    required
                  />
                </motion.div>

                {error && (
                  <motion.span
                    className="text-[#e53e3e] text-[0.85rem] mt-2 text-center font-medium bg-red-50 py-2 px-4 rounded-lg"
                    variants={itemVariants}
                  >
                    {error}
                  </motion.span>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="p-4 w-full border-none rounded-[16px] text-base font-semibold cursor-pointer bg-gradient-to-r from-[#3ea23e] to-[#2d8b2d] text-white flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 h-14"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Загрузка...</span>
                    </>
                  ) : (
                    t("register.telegram.submit") || "Продолжить"
                  )}
                </motion.button>

                <motion.div
                  className="flex items-center justify-center mt-4"
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    onClick={() => handleSetStep(3)}
                    className="flex items-center gap-2 no-underline bg-transparent border-none text-[#10b981] hover:text-[#0f7a5c] cursor-pointer font-medium"
                  >
                    <FaArrowLeft />
                    <span>{t("register.register.backToLogin") || "Назад"}</span>
                  </button>
                </motion.div>
              </motion.form>
            )}

            {step === 5 && (
              <motion.form
                key="step5"
                className="flex flex-col gap-3"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleProfileSubmit}
              >
                <div className="text-center mt-3">{logosvg}</div>

                <motion.h2
                  className="m-0 mb-1 text-[1.35rem] text-[#2d3748] text-center font-bold"
                  variants={itemVariants}
                >
                  {t("register.profile.welcomeTitle")}
                </motion.h2>

                <motion.p
                  className="text-[0.8rem] text-[#718096] text-center m-0 mb-3 leading-[1.3]"
                  variants={itemVariants}
                >
                  {t("register.profile.welcomeSubtitle")}
                </motion.p>

                <motion.div
                  className="relative w-full min-h-[44px] border-2 border-[#e2e8f0] hover:border-[#3ea23e] rounded-[12px] transition-all duration-300"
                  variants={itemVariants}
                >
                  <input
                    className="p-3 border-none text-sm outline-none bg-transparent w-full h-full leading-[20px] placeholder:text-[#a0aec0] placeholder:italic font-medium"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      dispatch(clearError());
                    }}
                    placeholder={t("register.profile.namePlaceholder")}
                    required
                  />
                </motion.div>

                {/* Password Input */}
                <div className="relative overflow-visible bg-white transition-all duration-300 min-h-[44px] border-2 border-[#e2e8f0] hover:border-[#3ea23e] rounded-[12px]">
                  <motion.div
                    className="absolute text-[0.95rem] z-2 left-3 top-1/2 -translate-y-1/2"
                    variants={iconVariants}
                    animate={isPasswordFocused ? "hover" : "inactive"}
                  >
                    {isPasswordFocused ? <FaLockOpen /> : <FaLock />}
                  </motion.div>

                  <input
                    className="p-3 border-none text-sm outline-none bg-transparent w-full h-full leading-[20px] pl-10 placeholder:text-[#a0aec0] placeholder:italic font-medium"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                      dispatch(clearError());
                    }}
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

                  <motion.div
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[1rem] flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100 transition-colors"
                    variants={eyeIconVariants}
                    animate={showPassword ? "visible" : "hidden"}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </motion.div>
                </div>

                {/* Confirm Password Input */}
                <div className="relative overflow-visible bg-white transition-all duration-300 min-h-[44px] border-2 border-[#e2e8f0] hover:border-[#3ea23e] rounded-[12px]">
                  <motion.div
                    className="absolute text-[0.95rem] z-2 left-3 top-1/2 -translate-y-1/2"
                    variants={iconVariants}
                    animate={isConfirmPasswordFocused ? "hover" : "inactive"}
                  >
                    {isConfirmPasswordFocused ? <FaLockOpen /> : <FaLock />}
                  </motion.div>

                  <input
                    className="p-3 border-none text-sm outline-none bg-transparent w-full h-full leading-[20px] pl-10 placeholder:text-[#a0aec0] placeholder:italic font-medium"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setConfirmPassword(e.target.value);
                      dispatch(clearError());
                    }}
                    placeholder={t("register.profile.confirmPasswordPlaceholder")}
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

                  <motion.div
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[1rem] flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100 transition-colors"
                    variants={eyeIconVariants}
                    animate={showConfirmPassword ? "visible" : "hidden"}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </motion.div>
                </div>

                {/* Gender Select */}
                <motion.div
                  className="relative w-full min-h-[44px] border-2 border-[#e2e8f0] hover:border-[#3ea23e] rounded-[12px] transition-all duration-300"
                  variants={itemVariants}
                >
                  <select
                    className="px-3 py-2 border-none rounded-[12px] text-sm outline-none bg-transparent bg-no-repeat cursor-pointer w-full h-[44px] appearance-none text-center focus:outline-none font-medium bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%276%27 viewBox=%270 0 12 6%27%3E%3Cpath d=%27M1 1l5 4 5-4%27 stroke=%27%23000%27 stroke-width=%271.5%27 fill=%27none%27/%3E%3C/svg%3E')] bg-[right_0.8rem_center] bg-[length:12px]"
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      dispatch(clearError());
                    }}
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
                  </select>
                </motion.div>

                {/* Region Select */}
                <motion.div
                  className="relative w-full min-h-[44px] border-2 border-[#e2e8f0] hover:border-[#3ea23e] rounded-[12px] transition-all duration-300"
                  variants={itemVariants}
                >
                  <select
                    className="px-3 py-2 border-none rounded-[12px] text-sm outline-none bg-transparent bg-no-repeat cursor-pointer w-full h-[44px] appearance-none text-center focus:outline-none font-medium bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%276%27 viewBox=%270 0 12 6%27%3E%3Cpath d=%27M1 1l5 4 5-4%27 stroke=%27%23000%27 stroke-width=%271.5%27 fill=%27none%27/%3E%3C/svg%3E')] bg-[right_0.8rem_center] bg-[length:12px]"
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      dispatch(clearError());
                    }}
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
                  </select>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.span
                    className="text-[#e53e3e] text-[0.75rem] mt-1 text-center font-medium bg-red-50 py-1.5 px-3 rounded-lg"
                    variants={itemVariants}
                  >
                    {error}
                  </motion.span>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="p-3 w-full border-none rounded-[12px] text-sm font-semibold cursor-pointer bg-gradient-to-r from-[#3ea23e] to-[#2d8b2d] text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 h-11"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Регистрация...</span>
                    </>
                  ) : (
                    t("register.profile.submit")
                  )}
                </motion.button>

                {/* Back Button */}
                <motion.div
                  className="flex items-center justify-center mt-2"
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    onClick={() => handleSetStep(4)}
                    className="flex items-center gap-1.5 no-underline bg-transparent border-none text-[#10b981] hover:text-[#0f7a5c] cursor-pointer font-medium text-sm"
                  >
                    <FaArrowLeft className="text-xs" />
                    <span>{t("register.register.backToLogin")}</span>
                  </button>
                </motion.div>
              </motion.form>
            )}

            {step === 9 && (
              <motion.form
                key="step9"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex flex-col justify-center p-6 relative">
                  <div className="mb-4 text-center">{logosvg}</div>
                  <h1 className="text-center text-[1.5rem] font-bold text-black m-0 mb-2">
                    {t("registerCoolText1.title")}
                  </h1>
                  <p className="text-[0.9rem] text-[#666666] m-0 mb-4 text-center">
                    {t("registerCoolText1.description")}
                  </p>
                  <div className="flex justify-between w-full gap-4 mb-4 h-[161px]">
                    <div className="flex justify-start bg-[#e6ffe6] rounded-[8px] p-3 w-full">
                      <p className="text-base text-black m-0">
                        {t("registerCoolText1.subtitle")}
                      </p>
                    </div>
                    <div className="flex justify-start bg-[#e6ffe6] rounded-[8px] p-3 w-full">
                      <p className="text-base text-black m-0">
                        {t("registerCoolText1.subtitle2")}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full p-3 text-base font-medium text-white bg-[#3ea240] border-none rounded-[8px] cursor-pointer"
                    onClick={() => handleSetStep(10)}
                    type="button"
                  >
                    {t("registerCoolText1.button")}
                  </button>
                </div>
              </motion.form>
            )}

            {step === 10 && (
              <motion.form
                key="step10"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex flex-col justify-center p-6 relative">
                  <div className="mb-4 text-center">{logosvg}</div>
                  <h1 className="text-center text-[1.5rem] font-bold text-black m-0 mb-2">
                    {t("registerCoolText2.title")}
                  </h1>
                  <p className="text-[0.9rem] text-[#666666] m-0 mb-4 text-center">
                    {t("registerCoolText2.description")}
                  </p>
                  <div className="flex justify-between w-full gap-4 mb-4 h-[161px]">
                    <div className="flex justify-start bg-[#e6ffe6] rounded-[8px] p-3 w-full mb-4">
                      <p className="text-base text-black m-0">
                        {t("registerCoolText2.boost_description")}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full p-3 text-base font-medium text-white bg-[#3ea240] border-none rounded-[8px] cursor-pointer"
                    onClick={() => {
                      handleClose();
                      router.push("/profile");
                    }}
                    type="button"
                  >
                    {t("registerCoolText2.button")}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </FocusTrap>
  );
}