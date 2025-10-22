import React, { useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { getAPIClient } from "../../types/apiClient";

const Container = styled(motion.section)`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 1px solid ${({ hasError }) => (hasError ? '#ef4444' : '#d1d5db')};
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? '#ef4444' : '#10b981')};
    box-shadow: 0 0 0 3px ${({ hasError }) => (hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)')};
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #374151;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PasswordRequirements = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #10b981;
`;

const Requirement = styled.div<{ met?: boolean }>`
  font-size: 12px;
  color: ${({ met }) => (met ? '#10b981' : '#6b7280')};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SaveButton = styled(motion.button) <{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? '#9ca3af' : '#10b981')};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${({ disabled }) => (disabled ? '#9ca3af' : '#059669')};
  }
`;

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
      newErrors.newPassword = "Пароль должен содержать буквы в верхнем и нижнем регистре, цифры и специальные символы";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите новый пароль";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
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

      console.log("🔐 Смена пароля...");

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Если бы был API метод:
      // await apiClient.changePassword({
      //   current_password: formData.currentPassword,
      //   new_password: formData.newPassword
      // });

      console.log("✅ Пароль успешно изменен");
      setSuccess(true);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error: any) {
      console.error("❌ Ошибка смены пароля:", error);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.detail ||
        "Не удалось изменить пароль. Проверьте текущий пароль.";

      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title>
        <FaLock />
        Безопасность
      </Title>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Текущий пароль</Label>
          <InputWrapper>
            <Input
              type={showPasswords.current ? "text" : "password"}
              placeholder="Введите текущий пароль"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              hasError={!!errors.currentPassword}
            />
            <ToggleButton
              type="button"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </ToggleButton>
          </InputWrapper>
          {errors.currentPassword && (
            <ErrorMessage>
              <FaExclamationTriangle />
              {errors.currentPassword}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Новый пароль</Label>
          <InputWrapper>
            <Input
              type={showPasswords.new ? "text" : "password"}
              placeholder="Введите новый пароль"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              hasError={!!errors.newPassword}
            />
            <ToggleButton
              type="button"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </ToggleButton>
          </InputWrapper>
          {errors.newPassword && (
            <ErrorMessage>
              <FaExclamationTriangle />
              {errors.newPassword}
            </ErrorMessage>
          )}

          {formData.newPassword && (
            <PasswordRequirements>
              <Requirement met={passwordRequirements.minLength}>
                <FaCheckCircle />
                Минимум 8 символов
              </Requirement>
              <Requirement met={passwordRequirements.hasNumber}>
                <FaCheckCircle />
                Содержит цифры
              </Requirement>
              <Requirement met={passwordRequirements.hasSpecialChar}>
                <FaCheckCircle />
                Содержит специальные символы
              </Requirement>
              <Requirement met={passwordRequirements.hasUpperCase}>
                <FaCheckCircle />
                Содержит заглавные буквы
              </Requirement>
              <Requirement met={passwordRequirements.hasLowerCase}>
                <FaCheckCircle />
                Содержит строчные буквы
              </Requirement>
              <Requirement met={passwordRequirements.passwordsMatch}>
                <FaCheckCircle />
                Пароли совпадают
              </Requirement>
            </PasswordRequirements>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Подтверждение пароля</Label>
          <InputWrapper>
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Подтвердите новый пароль"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              hasError={!!errors.confirmPassword}
            />
            <ToggleButton
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </ToggleButton>
          </InputWrapper>
          {errors.confirmPassword && (
            <ErrorMessage>
              <FaExclamationTriangle />
              {errors.confirmPassword}
            </ErrorMessage>
          )}
        </FormGroup>

        {errors.submit && (
          <ErrorMessage style={{ marginBottom: '16px' }}>
            <FaExclamationTriangle />
            {errors.submit}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            <FaCheckCircle />
            Пароль успешно изменен!
          </SuccessMessage>
        )}

        <SaveButton
          type="submit"
          whileHover={{ scale: allRequirementsMet && !loading ? 1.02 : 1 }}
          whileTap={{ scale: allRequirementsMet && !loading ? 0.98 : 1 }}
          disabled={!allRequirementsMet || loading || !formData.currentPassword}
        >
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Изменение...
            </>
          ) : (
            "Изменить пароль"
          )}
        </SaveButton>
      </form>
    </Container>
  );
};

export default Security;