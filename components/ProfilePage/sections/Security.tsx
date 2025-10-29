import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { getAPIClient } from "../../types/apiClient";

const Security = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const apiClient = getAPIClient();

  const passwordRequirements = {
    minLength: formData.newPassword.length >= 8,
    hasNumber: /\d/.test(formData.newPassword),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword),
    hasUpperCase: /[A-Z]/.test(formData.newPassword),
    hasLowerCase: /[a-z]/.test(formData.newPassword),
    passwordsMatch: formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(met => met);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }

    if (success) {
      setSuccess(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Введите текущий пароль";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Введите новый пароль";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Пароль должен содержать минимум 8 символов";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.newPassword)) {
      newErrors.newPassword = "Пароль не соответствует требованиям безопасности";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите новый пароль";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "Новый пароль должен отличаться от текущего";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);
      setErrors({});

      console.log("🔐 Попытка смены пароля...");

      const currentUser = await apiClient.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        throw new Error("Пользователь не авторизован");
      }

      console.log("👤 Пользователь:", currentUser.id);

      try {
        await apiClient.changePassword({
          old_password: formData.currentPassword,
          new_password: formData.newPassword
        });
        
        console.log("✅ Пароль успешно изменен через API");
        setSuccess(true);

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });

        setTimeout(() => {
          setSuccess(false);
        }, 5000);

      } catch (apiError: any) {
        console.error("❌ Ошибка API смены пароля:", apiError);

        if (apiError.message?.includes("not a function") || apiError.response?.status === 404) {
          console.log("🔄 Пробуем альтернативный метод через updateProfile...");

          try {
            await apiClient.login({
              phone: currentUser.phone,
              password: formData.currentPassword
            });

            console.log("✓ Текущий пароль подтвержден");

            await apiClient.updateProfile(currentUser.id, {
              name: currentUser.name,
              phone: currentUser.phone,
              role: currentUser.role,
              password: formData.newPassword, 
              region: currentUser.region,
              gender: currentUser.gender,
              work_experience: currentUser.work_experience,
              birthday: currentUser.birthday,
              email: currentUser.email,
              telegram_username: currentUser.telegram_username,
              about_user: currentUser.about_user,
            });

            console.log("✅ Пароль успешно изменен через updateProfile");
            setSuccess(true);

            // Очищаем форму
            setFormData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: ""
            });

            // Показываем сообщение
            setTimeout(() => {
              setSuccess(false);
            }, 5000);

          } catch (loginError: any) {
            console.error("❌ Неверный текущий пароль:", loginError);
            setErrors({ 
              currentPassword: "Неверный текущий пароль" 
            });
          }
        } else {
          // Обрабатываем другие ошибки API
          if (apiError.response?.status === 400) {
            setErrors({ 
              currentPassword: "Неверный текущий пароль" 
            });
          } else if (apiError.response?.status === 401) {
            setErrors({ 
              submit: "Сессия истекла. Пожалуйста, войдите снова" 
            });
          } else {
            throw apiError;
          }
        }
      }

    } catch (error: any) {
      console.error("❌ Критическая ошибка смены пароля:", error);

      let errorMessage = "Не удалось изменить пароль. ";

      if (error.response?.data?.detail) {
        errorMessage += error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Попробуйте позже.";
      }

      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white rounded-2xl shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <FaLock className="text-gray-600" />
        Безопасность
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Текущий пароль */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Текущий пароль
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              placeholder="Введите текущий пароль"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              className={`w-full px-4 py-3 pr-10 border rounded-lg text-base transition-all focus:outline-none focus:ring-2 ${
                errors.currentPassword
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200 focus:border-green-500"
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              {showPasswords.current ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <FaExclamationTriangle size={12} />
              {errors.currentPassword}
            </div>
          )}
        </div>

        {/* Новый пароль */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Новый пароль
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              placeholder="Введите новый пароль"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className={`w-full px-4 py-3 pr-10 border rounded-lg text-base transition-all focus:outline-none focus:ring-2 ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200 focus:border-green-500"
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              {showPasswords.new ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <FaExclamationTriangle size={12} />
              {errors.newPassword}
            </div>
          )}

          {formData.newPassword && (
            <div className="mt-2 p-3 bg-slate-50 border-l-3 border-l-green-500 rounded-md">
              <div className="space-y-0.5">
                <div className={`flex items-center gap-1.5 text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <FaCheckCircle size={12} />
                  <span>Минимум 8 символов</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  <FaCheckCircle size={12} />
                  <span>Содержит цифры</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  <FaCheckCircle size={12} />
                  <span>Содержит специальные символы (!@#$%...)</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <FaCheckCircle size={12} />
                  <span>Содержит заглавные буквы (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <FaCheckCircle size={12} />
                  <span>Содержит строчные буквы (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${passwordRequirements.passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
                  <FaCheckCircle size={12} />
                  <span>Пароли совпадают</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Подтверждение пароля
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Подтвердите новый пароль"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-3 pr-10 border rounded-lg text-base transition-all focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200 focus:border-green-500"
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              {showPasswords.confirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <FaExclamationTriangle size={12} />
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* Общая ошибка */}
        {errors.submit && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <FaExclamationTriangle />
            {errors.submit}
          </div>
        )}

        {/* Сообщение об успехе */}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <FaCheckCircle />
            Пароль успешно изменен!
          </div>
        )}

        {/* Кнопка отправки */}
        <motion.button
          type="submit"
          whileHover={{ scale: allRequirementsMet && !loading ? 1.02 : 1 }}
          whileTap={{ scale: allRequirementsMet && !loading ? 0.98 : 1 }}
          disabled={!allRequirementsMet || loading || !formData.currentPassword}
          className={`w-full py-3 px-6 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            !allRequirementsMet || loading || !formData.currentPassword
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Изменение...
            </>
          ) : (
            "Изменить пароль"
          )}
        </motion.button>
      </form>
    </motion.section>
  );
};

export default Security;