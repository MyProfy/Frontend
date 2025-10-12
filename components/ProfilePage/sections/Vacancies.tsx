// components/ProfilePage/sections/Vacancies.tsx
import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";

const Container = styled(motion.section)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 48px 24px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`
  text-align: center;
  max-width: 400px;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  
  svg {
    width: 36px;
    height: 36px;
    color: #9ca3af;
  }
`;

const EmptyTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

const CreateButton = styled(motion.button)`
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #059669;
  }
`;

const Vacancies = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <EmptyState>
        <EmptyIcon>
          <FaBriefcase />
        </EmptyIcon>
        <EmptyTitle>У вас пока нет объявлений</EmptyTitle>
        <EmptyText>
          Создайте свое первое объявление и начните получать заказы от клиентов
        </EmptyText>
        <CreateButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          Создать объявление
        </CreateButton>
      </EmptyState>
    </Container>
  );
};

export default Vacancies;