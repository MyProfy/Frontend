// components/Security.jsx
import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";

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

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const SaveButton = styled(motion.button)`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #059669;
  }
`;

const Security = () => {
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
      <FormGroup>
        <Label>Текущий пароль</Label>
        <Input type="password" placeholder="Введите текущий пароль" />
      </FormGroup>
      <FormGroup>
        <Label>Новый пароль</Label>
        <Input type="password" placeholder="Введите новый пароль" />
      </FormGroup>
      <FormGroup>
        <Label>Подтверждение пароля</Label>
        <Input type="password" placeholder="Подтвердите новый пароль" />
      </FormGroup>
      <SaveButton whileHover={{ scale: 1.02 }}>
        Изменить пароль
      </SaveButton>
    </Container>
  );
};

export default Security;