import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FaTelegram, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { getAPIClient } from "../../types/apiClient";
import { Order } from "../../types/apiTypes";

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
  margin-bottom: 8px;
`;

const OrderDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const OrderDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const Price = styled.span`
  font-weight: 600;
  color: #10b981;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ status }) => {
    switch (status) {
      case 'Completed':
        return 'background: #dcfce7; color: #166534;';
      case 'InProgress':
        return 'background: #fef3c7; color: #92400e;';
      case 'Awaiting':
        return 'background: #e0e7ff; color: #3730a3;';
      case 'Cancelled':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #6b7280;';
    }
  }}
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

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #9ca3af;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  margin: 0 0 8px 0;
`;

const EmptyStateSubtext = styled.p`
  font-size: 14px;
  margin: 0;
`;

// Вспомогательные функции
const getStatusDisplay = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'Awaiting': 'Ожидает',
    'InProgress': 'В процессе',
    'Completed': 'Завершен',
    'Cancelled': 'Отменен'
  };
  return statusMap[status] || status;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <FaCheckCircle />;
    case 'InProgress':
      return <FaHourglassHalf />;
    case 'Awaiting':
      return <FaClock />;
    case 'Cancelled':
      return <FaTimesCircle />;
    default:
      return <FaClock />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const History = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiClient = getAPIClient();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log("🔄 Загрузка истории заказов...");
        
        const ordersData = await apiClient.getOrders();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        console.log("✅ Заказы загружены:", ordersData);
        
      } catch (err) {
        console.error("❌ Ошибка загрузки заказов:", err);
        setError("Не удалось загрузить историю заказов");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiClient]);

  const getOrderTitle = (order: Order): string => {
    if (typeof order.service === 'object' && order.service?.name) {
      return `Заказ: ${order.service.name}`;
    }
    if (typeof order.vacancy === 'object' && order.vacancy?.title) {
      return `Вакансия: ${order.vacancy.title}`;
    }
    return 'Заказ';
  };

  // Функция для получения имени клиента/исполнителя
  const getCounterpartyName = (order: Order): string => {
    const user = typeof order.client === 'object' ? order.client : 
                typeof order.executor === 'object' ? order.executor : null;
    
    return user?.name || 'Пользователь';
  };

  // Функция для обработки открытия чата
  const handleOpenChat = (order: Order) => {
    // Здесь будет логика открытия чата
    console.log("Открыть чат для заказа:", order.id);
    // В будущем можно интегрировать с Telegram API или внутренним чатом
  };

  if (loading) {
    return (
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Header>
          <Title>Мои заказы</Title>
          <Subtitle>Загрузка...</Subtitle>
        </Header>
        <LoadingState>
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div>
          Загрузка заказов...
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Header>
          <Title>Мои заказы</Title>
          <Subtitle>Произошла ошибка</Subtitle>
        </Header>
        <EmptyState>
          <EmptyStateIcon>⚠️</EmptyStateIcon>
          <EmptyStateText>{error}</EmptyStateText>
          <EmptyStateSubtext>Попробуйте обновить страницу</EmptyStateSubtext>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>Мои заказы</Title>
        <Subtitle>
          {orders.length > 0 
            ? `${orders.length} заказ${orders.length === 1 ? '' : orders.length >= 2 && orders.length <= 4 ? 'а' : 'ов'}`
            : 'История заказов'
          }
        </Subtitle>
      </Header>
      
      {orders.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📦</EmptyStateIcon>
          <EmptyStateText>Заказов пока нет</EmptyStateText>
          <EmptyStateSubtext>
            Когда у вас появятся заказы, они отобразятся здесь
          </EmptyStateSubtext>
        </EmptyState>
      ) : (
        <OrdersList>
          {orders.map((order) => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderInfo>
                  <OrderName isNew={order.status === 'Awaiting'}>
                    {getOrderTitle(order)}
                  </OrderName>
                  <OrderMessage>
                    {order.status === 'Awaiting' 
                      ? `Вам написал ${getCounterpartyName(order)}`
                      : `Чат с ${getCounterpartyName(order)}`
                    }
                  </OrderMessage>
                  <OrderDetails>
                    <OrderDetail>
                      {getStatusIcon(order.status)}
                      <StatusBadge status={order.status}>
                        {getStatusDisplay(order.status)}
                      </StatusBadge>
                    </OrderDetail>
                    <OrderDetail>
                      💰 <Price>{order.price} UZS</Price>
                    </OrderDetail>
                    {order.created_at && (
                      <OrderDetail>
                        📅 {formatDate(order.created_at)}
                      </OrderDetail>
                    )}
                  </OrderDetails>
                </OrderInfo>
                <ChatButton 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenChat(order)}
                >
                  <FaTelegram />
                  Чат
                </ChatButton>
              </OrderHeader>
            </OrderCard>
          ))}
        </OrdersList>
      )}
    </Container>
  );
};

export default History;