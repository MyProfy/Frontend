// components/ProfilePage/sections/Support.tsx
import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FaTelegram, FaEnvelope } from "react-icons/fa";

const Container = styled(motion.section)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 32px 24px;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 32px 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin: 0 0 24px 0;
  }
`;

const SupportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
`;

const SupportCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: #ffffff;
  border-bottom: 1px dashed #cbd5e1;
  gap: 20px;
  transition: background 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9fafb;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 20px 16px;
  }
`;

const SupportInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
`;

const SupportText = styled.div`
  flex: 1;
`;

const SupportLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const SupportDesc = styled.div`
  font-size: 13px;
  color: #9ca3af;
`;

const ContactButton = styled(motion.button)`
  padding: 10px 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #059669;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Support = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title>Поддержка</Title>
      <SupportList>
        <SupportCard>
          <SupportInfo>
            <IconWrapper>
              <FaTelegram />
            </IconWrapper>
            <SupportText>
              <SupportLabel>Напишите нам в телеграм</SupportLabel>
              <SupportDesc>Мы постораемся ответить быстрее</SupportDesc>
            </SupportText>
          </SupportInfo>
          <ContactButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <FaTelegram />
            Написать
          </ContactButton>
        </SupportCard>
        
        <SupportCard>
          <SupportInfo>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <SupportText>
              <SupportLabel>Напишите нам на почту</SupportLabel>
              <SupportDesc>Ответим в течении 7 рабочих дней</SupportDesc>
            </SupportText>
          </SupportInfo>
          <ContactButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <FaTelegram />
            Написать
          </ContactButton>
        </SupportCard>
      </SupportList>
    </Container>
  );
};

export default Support;