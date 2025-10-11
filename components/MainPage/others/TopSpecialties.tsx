
import React from "react";
import styled from "@emotion/styled";

const TopSpecialtiesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(10px, 2vw, 20px);
  width: 100%;
  max-width: 1400px;
  min-width: 320px;
  margin: clamp(20px, 3vw, 30px) auto;
  padding: 0 clamp(5px, 1vw, 10px);
  box-sizing: border-box;
  overflow-x: hidden;
    background-color: #FFFFFF;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: clamp(8px, 1.5vw, 15px);
    padding: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: clamp(5px, 1vw, 10px);
    padding: 0 clamp(2px, 0.5vw, 2px);
  }
`;

const SpecialtyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: clamp(5px, 1vw, 16px) 0;
  padding: 16px;
  background: #fff;
  border-radius: 18px;
  box-sizing: border-box;

  @media (max-width: 930px) {
    padding: clamp(4px, 0.8vw, 8px);
    margin: clamp(4px, 0.8vw, 8px) 0;
  }
`;

const TopSpecialtyCard = styled.div`
  background: #f5f5f5;
  border-radius: 10px;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: none;
  box-sizing: border-box;

  @media (max-width: 768px) {
    aspect-ratio: 1 / 1;
  }

  @media (max-width: 480px) {
    aspect-ratio: 1 / 1;
  }
`;

const SpecialtyTitle = styled.h3`
  font-size: clamp(1.2rem, 2vw, 1.3rem);
  font-weight: 400;
  color: #000;
  margin: 10px 0 0;
  text-align: center;
  overflow-wrap: break-word;
  padding: clamp(10px, 2vw, 15px);

  @media (max-width: 768px) {
    font-size: clamp(1rem, 1.8vw, 1.2rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(0.9rem, 1.6vw, 1rem);
  }
`;

interface TopSpecialtiesProps {
  topSpecialties: { name: string; link: string }[];
  handleSpecialtyClick: (link: string) => void;
}

const TopSpecialties = ({ topSpecialties, handleSpecialtyClick }: TopSpecialtiesProps) => {
  return (
    <TopSpecialtiesContainer>
      {topSpecialties.map((specialty, index) => (
        <SpecialtyContainer key={index}>
          <TopSpecialtyCard onClick={() => handleSpecialtyClick(specialty.link)}>
          </TopSpecialtyCard>
          <SpecialtyTitle>{specialty.name}</SpecialtyTitle>
        </SpecialtyContainer>
      ))}
    </TopSpecialtiesContainer>
  );
};

export default TopSpecialties;
