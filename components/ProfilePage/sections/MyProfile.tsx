// components/ProfilePage/sections/MyProfile.tsx
import React, { useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBriefcase, FaCalendar, FaEdit } from "react-icons/fa";

const Container = styled(motion.section)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  padding: 32px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 16px;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #e5e7eb;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.2;
`;

const UserMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: #6b7280;
  font-size: 14px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const EditButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background: #059669;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const AboutSection = styled.div`
  padding: 0 24px 24px;
  border-top: 1px solid #e5e7eb;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px 16px;
    margin-top: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 24px 0 12px;
`;

const AboutText = styled.div`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
`;

const HistoryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  margin-top: 12px;
  
  &:hover {
    background: #e5e7eb;
  }
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  text-align: center;
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const AvatarEditSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const AvatarEdit = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  position: relative;
  margin-bottom: 12px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EditIconButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
  }
  
  svg {
    width: 14px;
    height: 14px;
    color: #6b7280;
  }
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
  font-size: 14px;
  color: #111827;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const SaveButton = styled(motion.button)`
  width: 100%;
  padding: 14px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #059669;
  }
`;

const MyProfile = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProfileHeader>
          <ProfileInfo>
            <Avatar>
              <img src="https://i.pravatar.cc/150?img=12" alt="Константин Короленко" />
            </Avatar>
            <UserDetails>
              <UserName>Константин Короленко</UserName>
              <UserMeta>
                <MetaItem>
                  <FaBriefcase />
                  <span>Мужской пол</span>
                </MetaItem>
                <MetaItem>
                  <FaMapMarkerAlt />
                  <span>Ташкент город</span>
                </MetaItem>
                <MetaItem>
                  <FaCalendar />
                  <span>5 лет опыта</span>
                </MetaItem>
              </UserMeta>
            </UserDetails>
          </ProfileInfo>
          <EditButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
          >
            <FaEdit />
            Изменить данные
          </EditButton>
        </ProfileHeader>
        
        <AboutSection>
          <SectionTitle>О себе</SectionTitle>
          <AboutText>
            История заказов
          </AboutText>
          <HistoryButton>
            ✓ Сохранить изменения
          </HistoryButton>
        </AboutSection>
      </Container>

      {/* Edit Modal */}
      {showModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Изменить данные</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <AvatarEditSection>
                <AvatarEdit>
                  <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" />
                  <EditIconButton>
                    <FaEdit />
                  </EditIconButton>
                </AvatarEdit>
              </AvatarEditSection>
              
              <FormGroup>
                <Label>Имя</Label>
                <Input type="text" placeholder="Введите имя" />
              </FormGroup>
              
              <FormGroup>
                <Label>Фамилия</Label>
                <Input type="text" placeholder="Введите фамилию" />
              </FormGroup>
              
              <FormGroup>
                <Label>Выберите пол</Label>
                <Select>
                  <option>Выберите пол</option>
                  <option>Мужской</option>
                  <option>Женский</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Выберите регион</Label>
                <Select>
                  <option>Выберите регион</option>
                  <option>Ташкент</option>
                  <option>Самарканд</option>
                  <option>Бухара</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Сколько лет опыта</Label>
                <Select>
                  <option>Сколько лет опыта</option>
                  <option>1-2 года</option>
                  <option>3-5 лет</option>
                  <option>5+ лет</option>
                </Select>
              </FormGroup>
              
              <SaveButton
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowModal(false)}
              >
                Сохранить
              </SaveButton>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default MyProfile;