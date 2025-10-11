
import React from "react";
import styled from "@emotion/styled";
import { Category, SubCategory } from "@/components/types/apiTypes";

const SpecialistsContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: clamp(20px, 3vw, 20px) auto;
  padding: clamp(1px, 3vw, 30px);
  background: #fff;
  border-radius: 24px;
  transition: margin 0.3s ease, padding 0.3s ease;
  min-width: 320px;
  position: relative;
  display: block;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: clamp(15px, 2vw, 20px);
    margin: clamp(15px, 2vw, 20px) auto;
    width: 90%;
  }

  @media (max-width: 480px) {
    padding: clamp(10px, 1.5vw, 15px);
    margin: clamp(10px, 1.5vw, 15px) auto;
  }
`;

const SpecialistsTitle = styled.h2`
  font-size: clamp(1.4rem, 3.8vw, 2.2rem);
  font-weight: 300;
  color: #000;
  margin-bottom: 2rem;
  text-align: left;
  transition: font-size 0.3s ease;
  position: relative;
  z-index: 2;
  white-space: normal;
  overflow-wrap: break-word;
  max-width: 50%;
  padding: clamp(10px, 2vw, 15px);
  width: 100%;

  @media (max-width: 768px) {
    font-size: 1.7rem;
    margin-top: 0.7rem;
    margin-bottom: 6rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-top: 1.2rem;
    margin-bottom: 4rem;
    max-width: 70%;
  }
`;

const SpecialistsDescription = styled.div`
  font-size: clamp(0.7rem, 1.2vw, 0.9rem);
  color: #676e7e;
  text-align: center;
  background-color: #f2f3f7;
  padding: clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 14px);
  border-radius: 12px;
  width: fit-content;
  max-width: 35vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  position: absolute;
  top: clamp(45px, 1.5vw, 25px);
  right: clamp(32px, 1.5vw, 20px);
  z-index: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 80vw;
    padding: clamp(9px, 0.8vw, 8px) clamp(8px, 1.2vw, 12px);
    top: clamp(85px, 1.3vw, 20px);
    right: 30px;
  }

  @media (max-width: 515px) {
    max-width: 80vw;
    padding: clamp(9px, 0.8vw, 8px) clamp(8px, 1.2vw, 12px);
    top: clamp(110px, 1.3vw, 20px);
    right: 30px;
  }

  @media (max-width: 480px) {
    max-width: 80vw;
    padding: clamp(9px, 0.8vw, 8px) clamp(8px, 1.2vw, 12px);
    top: clamp(90px, 1.3vw, 20px);
    right: 30px;
  }
`;

const SpecialistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 65px;
  margin-bottom: 20px;
  margin-left: 15px;
  justify-content: center;
  transition: margin 0.3s ease;
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: -25px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
    margin-top: -25px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: -10px;
  }
`;

const SpecialistItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: gap 0.3s ease;
  text-align: left;
  overflow-wrap: break-word;

  @media (max-width: 1120px) {
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 768px) {
    gap: 2px;
  }

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

const SpecialistCategory = styled.h3`
  font-size: clamp(0.787rem, 1.99vw, 1.08rem);
  font-weight: bold;
  color: #292c32;
  cursor: pointer;
  text-align: left;
  transition: font-size 0.3s ease, color 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  display: inline-block;
  vertical-align: middle;

  @media (max-width: 768px) {
    font-size: clamp(0.757rem, 1.82vw, 0.91rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(0.65rem, 1.66vw, 0.83rem);
  }
`;

const SpecialistCount = styled.p`
  font-size: clamp(0.75rem, 2vw, 1.1rem);
  color: #858b98;
  transition: font-size 0.3s ease;
  margin: 0;
  margin-left: 10px;
  display: inline-block;
  vertical-align: middle;
  line-height: 1.2;

  @media (max-width: 768px) {
    display: none;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const SubCategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  transition: transform 0.3s ease;
  color: #292c32;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SubCategoryItem = styled.li`
  font-size: clamp(0.75rem, 1.6vw, 1.12rem);
  color: #303030;
  margin-top: 6px;
  margin-bottom: 7px;
  cursor: pointer;
  text-align: left;
  transition: font-size 0.3s ease, margin 0.3s ease, color 0.3s ease;
  overflow-wrap: break-word;

  &:hover {
    color: #87e087;
  }

  @media (max-width: 768px) {
    font-size: clamp(0.86rem, 1.4vw, 1rem);
    margin-top: 5px;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: clamp(0.7rem, 1.2vw, 0.9rem);
    margin-top: 4px;
    margin-bottom: 5px;
  }
`;

const ShowAllLink = styled.a`
  font-size: clamp(0.75rem, 1.5vw, 0.9rem);
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  overflow-wrap: break-word;

  &:hover {
    color: #87e087;
  }

  @media (max-width: 768px) {
    font-size: clamp(0.65rem, 1.3vw, 0.8rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(0.6rem, 0.7vw, 0.7rem);
  }
`;

interface SpecialistsSectionProps {
  categories: Category[];
  subCategories: SubCategory[];
  getDisplayName: (item: Category | SubCategory) => string;
  handleCategoryClick: (categoryId: number) => void;
  handleSubCategoryClick: (subCategoryId: number) => void;
  handleShowAllClick: (categoryId: number) => void;
  t: (key: string) => string;
}

const SpecialistsSection = ({
  categories,
  subCategories,
  getDisplayName,
  handleCategoryClick,
  handleSubCategoryClick,
  handleShowAllClick,
  t,
}: SpecialistsSectionProps) => {
  return (
    <SpecialistsContainer>
      <SpecialistsTitle>{t("specialists.title")}</SpecialistsTitle>
      <SpecialistsDescription>{"5 " + t("specialists.description")}</SpecialistsDescription>
      <SpecialistsGrid>
        {categories.map((category) => {
          const subCategoryCount = subCategories.filter((sub) => {  
            const categoryId = typeof sub.category === "number" ? sub.category : sub.category.id;
            return categoryId === category.id;
          }).length;
          return (
            <SpecialistItem key={category.id}>
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <SpecialistCategory onClick={() => handleCategoryClick(category.id)}>
                  {getDisplayName(category)}
                </SpecialistCategory>
                <SpecialistCount>{category.service_count || 0}</SpecialistCount>
              </div>
              <SubCategoryList>
                {subCategories
                  .filter((sub) => {
                    const categoryId = typeof sub.category === "number" ? sub.category : sub.category.id;
                    return categoryId === category.id;
                  })
                  .slice(0, 5)
                  .map((subCategory) => (
                    <SubCategoryItem
                      key={subCategory.id}
                      onClick={() => handleSubCategoryClick(subCategory.id)}
                    >
                      {getDisplayName(subCategory)}
                    </SubCategoryItem>
                  ))}
              </SubCategoryList>
              <ShowAllLink onClick={() => handleShowAllClick(category.id)}>
                {t("specialists.showAll")} ({subCategoryCount})
              </ShowAllLink>
            </SpecialistItem>
          );
        })}
      </SpecialistsGrid>
    </SpecialistsContainer>
  );
};

export default SpecialistsSection;
