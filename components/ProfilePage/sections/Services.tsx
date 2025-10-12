// components/ProfilePage/sections/Services.tsx
import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

const Container = styled(motion.section)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 32px 24px;
  min-height: 400px;
  
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

const AnnouncementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
`;

const AnnouncementCard = styled.div`
  padding: 24px;
  background: #ffffff;
  border-bottom: 1px dashed #cbd5e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  transition: background 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9fafb;
  }
  
  @media (max-width: 768px) {
    padding: 20px 16px;
    flex-wrap: wrap;
    gap: 16px;
  }
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  min-width: 120px;
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const CardMeta = styled.div`
  font-size: 14px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardRight = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 16px;
  }
`;

const CandidatesCount = styled.span`
  color: #10b981;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
`;

const ViewLink = styled.button`
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  padding: 0;
  transition: color 0.2s;
  white-space: nowrap;
  
  &:hover {
    color: #6b7280;
  }
`;

const Services = () => {
  const announcements = [
    { 
      title: "Сантехника", 
      date: "создан 12.12.2024", 
      time: "в 20:23", 
      candidates: "более 2022 кондидатов" 
    },
    { 
      title: "Сантехника", 
      date: "создан 12.12.2024", 
      time: "в 20:23", 
      candidates: "более 2022 кондидатов" 
    },
    { 
      title: "Сантехника", 
      date: "создан 12.12.2024", 
      time: "в 20:23", 
      candidates: "более 2022 кондидатов" 
    }
  ];

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title>Мои объявления</Title>
      <AnnouncementList>
        {announcements.map((item, index) => (
          <AnnouncementCard key={index}>
            <CardLeft>
              <CardTitle>{item.title}</CardTitle>
              <CardMeta>
                {item.date} {item.time}
              </CardMeta>
            </CardLeft>
            <CardRight>
              <CandidatesCount>{item.candidates}</CandidatesCount>
              <ViewLink>Перейти к кандидатам</ViewLink>
            </CardRight>
          </AnnouncementCard>
        ))}
      </AnnouncementList>
    </Container>
  );
};

export default Services;