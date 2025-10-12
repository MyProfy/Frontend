// components/ProfilePage/sections/History.tsx
import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FaTelegram } from "react-icons/fa";

const Container = styled(motion.section)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 32px 24px;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: #9ca3af;
  margin: 0;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
`;

const OrderCard = styled.div`
  padding: 20px 24px;
  background: #ffffff;
  border-bottom: 1px dashed #cbd5e1;
  transition: background 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9fafb;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderName = styled.div<{ isNew?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ isNew }) => (isNew ? '#10b981' : '#6b7280')};
  margin-bottom: 4px;
`;

const OrderMessage = styled.div`
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.4;
`;

const ChatButton = styled(motion.button)`
  padding: 8px 16px;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const History = () => {
  const orders = [
    {
      name: "Вам написал Алексей Борисов",
      message: "Здравствуйте хотел бы заказать у вас услугу, у меня т...",
      isNew: true
    },
    {
      name: "Чат с Алексей Борисов",
      message: "Здравствуйте хотел бы заказать у вас услугу, у меня т...",
      isNew: false
    },
    {
      name: "Чат с Алексей Борисов",
      message: "Здравствуйте хотел бы заказать у вас услугу, у меня т...",
      isNew: false
    }
  ];

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>Мои заказы</Title>
        <Subtitle>Сантехник</Subtitle>
      </Header>
      
      <OrdersList>
        {orders.map((order, index) => (
          <OrderCard key={index}>
            <OrderHeader>
              <OrderInfo>
                <OrderName isNew={order.isNew}>
                  {order.name}
                </OrderName>
                <OrderMessage>{order.message}</OrderMessage>
              </OrderInfo>
              <ChatButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <FaTelegram />
                Чат
              </ChatButton>
            </OrderHeader>
          </OrderCard>
        ))}
      </OrdersList>
    </Container>
  );
};

export default History;