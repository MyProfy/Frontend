// "use client";

// import React, { useContext, useEffect, useMemo, useState } from "react";
// import styled from "@emotion/styled";
// import { LanguageContext } from "@/contexts/LanguageContext";
// import { useTranslation } from "react-i18next";
// import { useRouter } from "next/navigation";
// import { getAPIClient } from "../../types/apiClient";
// import { Category, Reklama, Service, SubCategory, User } from "../../types/apiTypes";
// import ReviewsBlock from "components/ReviewsBlock/ReviewsBlock";
// import { motion } from "framer-motion";
// import apiClient from "@/components/types/apiClient";
// import Navbar from "@/components/Header/Navbar";

// interface CarouselTextProps {
//   isActive: boolean;
// }

// interface CharacterCounterProps {
//   isMax: boolean;
// }

// interface ReklamaSlideProps {
//   isActive: boolean;
// }

// interface ServiceResponse {
//   results: Service[];
//   count: number;
// }

// const ErrorMessage = styled.div`
//   font-size: clamp(1.4rem, 3.8vw, 1.8rem);
//   font-weight: 300;
//   color: #000;
//   position: absolute;
//   top: 50%;
//   left: 0;
//   transform: translateY(-50%);
//   width: 100%;
//   text-align: center;
//   opacity: 1;
//   transition: opacity 0.5s ease-in-out;
// `;

// const HeaderTop = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   margin-bottom: 2rem;
//   padding: 0 clamp(10px, 2vw, 33px);
//   transition: padding 0.3s ease;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: center;
//     gap: 1rem;
//     margin-bottom: 16px;
//   }
// `;

// const LoadingContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   font-size: clamp(0.9rem, 3.8vw, 1.1rem);
//   color: #000;
// `;

// const ErrorContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   font-size: clamp(0.9rem, 3.8vw, 1.1rem);
//   color: #000;
//   text-align: center;
//   padding: 20px;
// `;

// const BannerContainer = styled.div`
//   margin-top: clamp(60px, 10vh, 120px);
//   padding: clamp(20px, 3vw, 30px);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   text-align: center;
//   width: 100%;
//   box-sizing: border-box;
//   overflow: hidden;
//   position: relative;
//   contain: layout;
//   transition: padding 0.3s ease-in-out;
//   max-width: 1440px;
//   margin-left: auto;
//   margin-right: auto;

//   @media (max-width: 768px) {
//     padding: clamp(15px, 2vw, 20px);
//   }

//   @media (max-width: 480px) {
//     padding: clamp(10px, 1.5vw, 15px);
//   }
//   @media (max-width: 500px) {
//     margin-top: 140px;
//   }
// `;

// const MainTitle = styled.h1`
//   font-size: clamp(1.6rem, 4.5vw, 2rem);
//   font-weight: 400;
//   color: #000;
//   transition: font-size 0.3s ease;
//   max-width: 600px;
//   white-space: normal;
//   overflow-wrap: break-word;
//   line-height: 1.2;
//   text-align: center;
//   margin: 0 auto;
//   padding: clamp(10px, 2vw, 15px);

//   @media (max-width: 768px) {
//     font-size: 1.3rem;
//     max-width: 400px;
//     margin-bottom: 16px;
//   }

//   @media (max-width: 480px) {
//     font-size: 1.1rem;
//     max-width: 300px;
//   }
// `;

// const SearchContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   width: 100%;
//   margin-bottom: 40px;
// `;

// const SearchInput = styled.input`
//   padding: 13px 13px 13px 40px;
//   width: 100%;
//   border: none;
//   border-radius: 13px;
//   font-size: clamp(16px, 1.8vw, 18px);
//   transition: padding 0.3s ease, width 0.3s ease, font-size 0.3s ease;
  
//   @media (max-width: 768px) {
//     padding-left: 40px;
//   }
  
//   @media (max-width: 480px) {
//     padding-left: 35px;
//   }
// `;

// const InputWrapper = styled.div`
//   position: relative;
//   flex: 1;
//   display: flex;
//   align-items: center;
//   width: 100%;
// `;

// const SearchIcon = styled.svg`
//   position: absolute;
//   left: 12px;
//   top: 50%;
//   transform: translateY(-50%);
//   width: 20px;
//   height: 20px;
//   fill: #333;
  
//   @media (max-width: 768px) {
//     left: 12px;
//   }
  
//   @media (max-width: 480px) {
//     left: 10px; 
//     width: 18px;
//     height: 18px;
//   }
// `;

// const ChoiceSection = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: 20px;
//   margin: 40px 0;
//   flex-wrap: wrap;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     gap: 15px;
//   }
// `;

// const ChoiceButton = styled(motion.button)`
//   padding: 15px 30px;
//   background: #3ea240;
//   border: none;
//   border-radius: 12px;
//   font-size: 1.2rem;
//   font-weight: 500;
//   color: #fff;
//   cursor: pointer;
//   transition: background 0.3s ease;
//   min-width: 200px;

//   &:hover {
//     background: #218838;
//   }

//   @media (max-width: 768px) {
//     font-size: 1rem;
//     padding: 12px 24px;
//     min-width: 180px;
//   }
// `;

// const CarouselContainer = styled.div`
//   background: rgb(228, 228, 228);
//   border-radius: 23px;
//   width: 100%;
//   max-width: 1400px;
//   margin: 0 auto clamp(20px, 3vw, 30px);
//   overflow: hidden;
//   position: relative;
//   aspect-ratio: 970 / 250;
//   height: auto;
//   transition: padding 0.3s ease;
//   border: 2px solid #e3f2fd;
// `;

// const SlideWrapper = styled.div`
//   width: 100%;
//   height: 100%;
//   position: relative;
//   aspect-ratio: 970 / 90;
// `;

// const CarouselText = styled.h2<CarouselTextProps>`
//   font-size: clamp(1.4rem, 3.8vw, 1.8rem);
//   font-weight: 300;
//   color: #000;
//   position: absolute;
//   top: 50%;
//   left: 0;
//   transform: translateY(-50%);
//   width: 100%;
//   text-align: center;
//   opacity: ${({ isActive }) => (isActive ? 1 : 0)};
//   transition: opacity 0.5s ease-in-out;
// `;

// const ReklamaSlide = styled.a<ReklamaSlideProps>`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: ${({ isActive }) => (isActive ? "block" : "none")};
//   cursor: pointer;
// `;

// const ReklamaImage = styled.img`
//   width: 100%;
//   max-width: 100%;
//   height: auto;
//   object-fit: contain;
//   border-radius: 24px;
// `;

// const BannerHighlight = styled.div`
//   position: absolute;
//   top: 10px;
//   left: 10px;
//   right: 10px;
//   height: 40px;
//   background: #2196f3;
//   color: white;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 8px;
//   font-weight: bold;
//   font-size: 1.2rem;
//   z-index: 2;
// `;

// const RegionInputWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin: 20px 0;
//   position: relative;
// `;

// const RegionFlag = styled.span`
//   width: 30px;
//   height: 20px;
//   background: #4caf50;
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
//   font-size: 0.8rem;
// `;

// const RegionInput = styled.input`
//   flex: 1;
//   padding: 10px 40px 10px 10px;
//   border: 2px solid #e3f2fd;
//   border-radius: 8px;
//   font-size: 1rem;
// `;

// const QuestionSection = styled.div`
//   background: white;
//   border: 2px solid #e3f2fd;
//   border-radius: 12px;
//   padding: 30px;
//   margin: 20px 0;
//   text-align: center;
// `;

// const QuestionTitle = styled.h3`
//   font-size: 1.5rem;
//   margin-bottom: 10px;
//   color: #333;
// `;

// const QuestionOptions = styled.div`
//   display: flex;
//   gap: 15px;
//   justify-content: center;
//   margin-top: 20px;
//   flex-wrap: wrap;
// `;

// const QuestionOption = styled.button`
//   padding: 10px 20px;
//   background: #f5f5f5;
//   border: 1px solid #ddd;
//   border-radius: 8px;
//   cursor: pointer;
//   transition: background 0.3s;
  
//   &:hover {
//     background: #e3f2fd;
//   }
// `;

// const RegistrationSection = styled.div`
//   background: linear-gradient(135deg, #3ea240, #218838);
//   color: white;
//   padding: 60px 34px;
//   border-radius: 24px;
//   margin: 40px auto;
//   max-width: 1400px;
//   width: 100%;
//   text-align: center;

//   @media (max-width: 768px) {
//     padding: 40px 20px;
//   }
// `;

// const RegistrationTitle = styled.h2`
//   font-size: 2.5rem;
//   margin-bottom: 10px;
//   @media (max-width: 768px) {
//     font-size: 1.8rem;
//   }
// `;

// const RegistrationSubtitle = styled.p`
//   font-size: 1.2rem;
//   margin-bottom: 30px;
//   opacity: 0.9;
//   @media (max-width: 768px) {
//     font-size: 1rem;
//   }
// `;

// const StatsBadge = styled.div`
//   display: inline-flex;
//   align-items: center;
//   background: rgba(255,255,255,0.2);
//   padding: 10px 20px;
//   border-radius: 20px;
//   margin-bottom: 20px;
//   font-size: 1.1rem;
//   font-weight: 500;
// `;

// const RegistrationForm = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 15px;
//   margin-top: 20px;
//   flex-wrap: wrap;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: center;
//   }
// `;

// const RegInput = styled.input`
//   padding: 12px 16px;
//   border: none;
//   border-radius: 8px;
//   font-size: 1rem;
//   width: 200px;
//   background: rgba(255,255,255,0.9);

//   @media (max-width: 768px) {
//     width: 100%;
//     max-width: 250px;
//   }
// `;

// const RegButton = styled.button`
//   padding: 12px 24px;
//   background: white;
//   color: #3ea240;
//   border: none;
//   border-radius: 8px;
//   font-size: 1rem;
//   font-weight: 500;
//   cursor: pointer;
//   transition: background 0.3s ease;

//   &:hover {
//     background: #f0f0f0;
//   }
// `;

// const RequestContainer = styled.div`
//   width: 100%;
//   max-width: 1400px;
//   margin: 0 auto;
//   padding: 50px 34px;
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   background: #fff;
//   border-radius: 24px;
//   transition: margin 0.3s ease, padding 0.3s ease;
//   min-width: 320px;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     width: 90%;
//     padding: clamp(15px, 2vw, 20px);
//     margin: clamp(15px, 2vw, 20px) auto;
//   }

//   @media (max-width: 480px) {
//     padding: clamp(10px, 1.5vw, 15px);
//     margin: clamp(10px, 1.5vw, 15px) auto;
//   }
// `;

// const RequestText = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   align-items: flex-start;
//   text-align: left;
//   width: 100%;
//   max-width: 600px;
//   box-sizing: border-box;
//   padding: clamp(10px, 2vw, 15px);

//   @media (max-width: 768px) {
//     gap: 8px;
//     max-width: 100%;
//   }

//   @media (max-width: 480px) {
//     gap: 6px;
//   }
// `;

// const RequestTitle = styled.h3`
//   font-family: "Font 1", sans-serif;
//   font-size: 30px;
//   font-weight: 600;
//   line-height: 32px;
//   letter-spacing: 0;
//   color: #292c32;
//   display: flex;
//   align-items: center;
//   margin-bottom: 5px;
//   margin-top: -25px;
//   margin-left: -12px;

//   @media (max-width: 768px) {
//     font-size: 1.3rem;
//     margin-top: -10px;
//     right: 15px;
//     margin-bottom: 6px;
//     width: auto;
//     height: auto;
//   }

//   @media (max-width: 480px) {
//     font-size: 1.1rem;
//     margin-bottom: 4px;
//   }
// `;

// const RequestDescription = styled.p`
//   font-family: "Font 1", sans-serif;
//   font-size: 14px;
//   font-weight: 600;
//   line-height: 24px;
//   letter-spacing: 0;
//   color: #292c32;
//   width: 396px;
//   height: 24px;
//   display: flex;
//   align-items: center;
//   margin-top: 0px;
//   margin-left: -12px;
//   overflow-wrap: break-word;

//   @media (max-width: 768px) {
//     font-size: 0.9rem;
//     width: auto;
//     height: auto;
//     line-height: 1.4;
//   }

//   @media (max-width: 480px) {
//     font-size: 0.7rem;
//     line-height: 1.3;
//   }
// `;

// const StyledDescription = styled(RequestDescription)`
//   height: 34px;
//   padding: 5px 20px;
//   border-radius: 8px;
//   box-sizing: border-box;
//   font-family: "Font 1", sans-serif;
//   font-size: 15.25px;
//   font-weight: 500;
//   line-height: 23.2px;
//   letter-spacing: 0;
//   text-align: center;
//   color: #676e7e;
//   background-color: #f2f3f7;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   white-space: nowrap;
//   position: relative;

//   @media (max-width: 768px) {
//     width: 512px;
//     height: auto;
//     min-height: 24px;
//     padding: 8px 16px;
//     font-size: 14px;
//     line-height: 1.5;
//     white-space: normal;
//     max-width: 90%;
//   }

//   @media (max-width: 480px) {
//     width: 100%;
//     max-width: 300px;
//     font-size: 13px;
//     padding: 6px 12px;
//   }
// `;

// const RequestInputWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 5px;
//   width: 100%;
//   max-width: 600px;
//   height: 180px;
//   position: relative;
//   box-sizing: border-box;

//   @media (max-width: 768px) {
//     max-width: 100%;
//     height: 160px;
//   }

//   @media (max-width: 480px) {
//     height: 140px;
//   }
// `;

// const RequestInput = styled.textarea`
//   padding: 24px;
//   width: 100%;
//   height: 116.55px;
//   border-radius: 8px;
//   border: none;
//   font-size: clamp(1rem, 2vw, 1.2rem);
//   resize: none;
//   overflow-y: auto;
//   background: #f2f3f7;
//   outline: none;
//   position: relative;

//   @media (max-width: 768px) {
//     font-size: 0.9rem;
//     padding: 10px;
//     height: 115.5px;
//   }

//   @media (max-width: 480px) {
//     font-size: 0.8rem;
//     padding: 8px;
//     height: 105px;
//   }
// `;

// const CharacterCounter = styled.span<CharacterCounterProps>`
//   font-size: clamp(0.75rem, 1.5vw, 0.8rem);
//   color: ${({ isMax }) => (isMax ? "#ff0000" : "#000")};
//   position: absolute;
//   bottom: 38%;
//   right: 10px;
//   transform-origin: bottom right;
//   transform: scale(1);

//   @media (max-width: 768px) {
//     bottom: 38%;
//     right: 8px;
//     font-size: 0.65rem;
//   }

//   @media (max-width: 480px) {
//     bottom: 55px;
//     right: 12px;
//     font-size: 0.6rem;
//   }
// `;

// const RequestButton = styled.button`
//   padding: 12px 20px;
//   background: #3ea240;
//   border: none;
//   border-radius: 8px;
//   font-size: clamp(1rem, 2vw, 1.2rem);
//   color: #fff;
//   cursor: pointer;
//   width: 100%;
//   height: 46px;
//   transition: background 0.3s ease;
//   margin-top: 13px;

//   &:hover {
//     background: #218838;
//   }

//   @media (max-width: 768px) {
//     font-size: 0.9rem;
//     padding: 10px 15px;
//     height: 40px;
//   }

//   @media (max-width: 480px) {
//     font-size: 0.8rem;
//     padding: 8px 12px;
//     height: 36px;
//   }
// `;

// const SpecialistsContainer = styled.div`
//   width: 100%;
//   max-width: 1400px;
//   margin: clamp(20px, 3vw, 20px) auto;
//   padding: clamp(1px, 3vw, 30px);
//   background: #fff;
//   border-radius: 24px;
//   transition: margin 0.3s ease, padding 0.3s ease;
//   min-width: 320px;
//   position: relative;
//   display: block;
//   overflow: hidden;

//   @media (max-width: 768px) {
//     padding: clamp(15px, 2vw, 20px);
//     margin: clamp(15px, 2vw, 20px) auto;
//     width: 90%;
//   }

//   @media (max-width: 480px) {
//     padding: clamp(10px, 1.5vw, 15px);
//     margin: clamp(10px, 1.5vw, 15px) auto;
//     width: 90%;
//   }
// `;

// const SpecialistsTitle = styled.h2`
//   font-size: clamp(1.4rem, 3.8vw, 2.2rem);
//   font-weight: 300;
//   color: #000;
//   margin-bottom: 2rem;
//   text-align: left;
//   transition: font-size 0.3s ease;
//   position: relative;
//   z-index: 2;
//   white-space: normal;
//   overflow-wrap: break-word;
//   max-width: 50%;
//   padding: clamp(10px, 2vw, 15px);
//   width: 100%;

//   @media (max-width: 768px) {
//     font-size: 1.7rem;
//     margin-top: 0.7rem;
//     margin-bottom: 6rem;
//     max-width: 100%;
//   }

//   @media (max-width: 480px) {
//     font-size: 1.2rem;
//     margin-top: 1.2rem;
//     margin-bottom: 4rem;
//     max-width: 70%;
//   }
// `;

// const SpecialistsDescription = styled.div`
//   font-size: clamp(0.7rem, 1.2vw, 0.9rem);
//   color: #676e7e;
//   text-align: center;
//   background-color: #f2f3f7;
//   padding: clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 14px);
//   border-radius: 12px;
//   width: fit-content;
//   max-width: 35vw;
//   box-sizing: border-box;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   white-space: nowrap;
//   position: absolute;
//   top: clamp(45px, 1.5vw, 25px);
//   right: clamp(32px, 1.5vw, 20px);
//   z-index: 1;
//   overflow: hidden;

//   @media (max-width: 768px) {
//     max-width: 80vw;
//     padding: clamp(9px, 0.8vw, 8px) clamp(8px, 1.2vw, 12px);
//     top: clamp(85px, 1.3vw, 20px);
//     right: 30px;
//   }

//   @media (max-width: 515px) {
//     max-width: 80vw;
//     padding: clamp(9px, 0.8vw, 8px) clamp(8px, 1.2vw, 12px);
//     top: clamp(110px, 1.3vw, 20px);
//     right: 30px;
//   }
//   @media (max-width: 480px) {
//     max-width: 80vw;
//     padding: clamp(9px, 0.8vw, 8px) clamp(8px, 1.2vw, 12px);
//     top: clamp(90px, 1.3vw, 20px);
//     right: 30px;
//   }
// `;

// const SpecialistsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 65px;
//   margin-bottom: 20px;
//   margin-left: 15px;
//   justify-content: center;
//   transition: margin 0.3s ease;
//   max-width: 100%;
//   overflow-x: hidden;

//   @media (max-width: 1120px) {
//     grid-template-columns: repeat(3, 1fr);
//     gap: 32px;
//     margin-top: -25px;
//   }

//   @media (max-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//     gap: 32px;
//     margin-top: -25px;
//   }

//   @media (max-width: 480px) {
//     grid-template-columns: repeat(2, 1fr);
//     gap: 20px;
//     margin-top: -10px;
//   }
// `;

// const SpecialistItem = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   transition: gap 0.3s ease;
//   text-align: left;
//   overflow-wrap: break-word;

//   @media (max-width: 1120px) {
//     flex-wrap: wrap;
//     gap: 10px;
//   }

//   @media (max-width: 768px) {
//     gap: 2px;
//   }

//   @media (max-width: 480px) {
//     gap: 2px;
//   }
// `;

// const SpecialistCategory = styled.h3`
//   font-size: clamp(0.787rem, 1.99vw, 1.08rem);
//   font-weight: bold;
//   color: #292c32;
//   cursor: pointer;
//   text-align: left;
//   transition: font-size 0.3s ease, color 0.3s ease;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   margin: 0;
//   display: inline-block;
//   vertical-align: middle;

//   @media (max-width: 768px) {
//     font-size: clamp(0.757rem, 1.82vw, 0.91rem);
//   }

//   @media (max-width: 480px) {
//     font-size: clamp(0.65rem, 1.66vw, 0.83rem);
//   }
// `;

// const SpecialistCount = styled.p`
//   font-size: clamp(0.75rem, 2vw, 1.1rem);
//   color: #858b98;
//   transition: font-size 0.3s ease;
//   margin: 0;
//   margin-left: 10px;
//   display: inline-block;
//   vertical-align: middle;
//   line-height: 1.2;

//   @media (max-width: 768px) {
//     display: none;
//   }

//   @media (max-width: 480px) {
//     display: none;
//   }
// `;

// const SubCategoryList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
//   text-align: left;
//   transition: transform 0.3s ease;
//   color: #292c32;
//   font-weight: 400;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;

// const SubCategoryItem = styled.li`
//   font-size: clamp(0.75rem, 1.6vw, 1.12rem);
//   color: #303030;
//   margin-top: 6px;
//   margin-bottom: 7px;
//   cursor: pointer;
//   text-align: left;
//   transition: font-size 0.3s ease, margin 0.3s ease, color 0.3s ease;
//   overflow-wrap: break-word;

//   &:hover {
//     color: #87e087;
//   }

//   @media (max-width: 768px) {
//     font-size: clamp(0.86rem, 1.4vw, 1rem);
//     margin-top: 5px;
//     margin-bottom: 6px;
//   }

//   @media (max-width: 480px) {
//     font-size: clamp(0.7rem, 1.2vw, 0.9rem);
//     margin-top: 4px;
//     margin-bottom: 5px;
//   }
// `;

// const ShowAllLink = styled.a`
//   font-size: clamp(0.75rem, 1.5vw, 0.9rem);
//   color: #000;
//   text-decoration: underline;
//   cursor: pointer;
//   transition: color 0.3s ease;
//   display: flex;
//   align-items: center;
//   overflow-wrap: break-word;

//   &:hover {
//     color: #87e087;
//   }

//   @media (max-width: 768px) {
//     font-size: clamp(0.65rem, 1.3vw, 0.8rem);
//   }

//   @media (max-width: 480px) {
//     font-size: clamp(0.6rem, 0.7vw, 0.7rem);
//   }
// `;

// const ModalButton = styled(motion.button)`
//   background: #3ea23e;
//   border: none;
//   font-size: 0.98rem;
//   font-weight: 400;
//   color: #fff;
//   padding: 12px 16px;
//   cursor: pointer;
//   border-radius: 8px;
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background: #2e8b57;
//     color: #fff;
//   }

//   &:active {
//     color: #fff;
//   }

//   @media (max-width: 768px) {
//     font-size: 0.833rem;
//     padding: 14px;
//   }
// `;

// const TopSpecialtiesContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: clamp(10px, 2vw, 20px);
//   width: 100%;
//   max-width: 1400px;
//   min-width: 320px;
//   margin: clamp(20px, 3vw, 30px) auto;
//   padding: 0 clamp(5px, 1vw, 10px);
//   box-sizing: border-box;
//   overflow-x: hidden;

//   @media (max-width: 800px) {
//     grid-template-columns: repeat(2, 1fr);
//     grid-template-rows: repeat(2, 1fr);
//     gap: clamp(8px, 1.5vw, 15px);
//     padding: 16px;
//   }

//   @media (max-width: 480px) {
//     grid-template-columns: repeat(2, 1fr);
//     grid-template-rows: repeat(2, 1fr);
//     gap: clamp(5px, 1vw, 10px);
//     padding: 0 clamp(2px, 0.5vw, 2px);
//   }
// `;

// const SpecialtyContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin: clamp(5px, 1vw, 16px) 0;
//   padding: 16px;
//   background: #fff;
//   border-radius: 18px;
//   box-sizing: border-box;

//   @media (max-width: 930px) {
//     padding: clamp(4px, 0.8vw, 8px);
//     margin: clamp(4px, 0.8vw, 8px) 0;
//   }
// `;

// const TopSpecialtyCard = styled.div`
//   background: #f5f5f5;
//   border-radius: 10px;
//   width: 100%;
//   aspect-ratio: 1 / 1;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   cursor: pointer;
//   transition: none;
//   box-sizing: border-box;

//   @media (max-width: 768px) {
//     aspect-ratio: 1 / 1;
//   }

//   @media (max-width: 480px) {
//     aspect-ratio: 1 / 1;
//   }
// `;

// const CardImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   border-radius: 10px;
// `;

// const SpecialtyTitle = styled.h3`
//   font-size: clamp(1.2rem, 2vw, 1.3rem);
//   font-weight: 400;
//   color: #000;
//   margin: 10px 0 0;
//   text-align: center;
//   overflow-wrap: break-word;
//   padding: clamp(10px, 2vw, 15px);

//   @media (max-width: 768px) {
//     font-size: clamp(1rem, 1.8vw, 1.2rem);
//   }

//   @media (max-width: 480px) {
//     font-size: clamp(0.9rem, 1.6vw, 1rem);
//   }
// `;

// interface BannerSpecialistClientProps {
//   initialSlide?: number;
// }

// export default function BannerSpecialistClient({ initialSlide = 0 }: BannerSpecialistClientProps) {
//   const { language } = useContext(LanguageContext);
//   const { t, i18n } = useTranslation();
//   const router = useRouter();
//   const apiClient = useMemo(() => getAPIClient(), []);

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [userRegion, setUserRegion] = useState<string | null>(null);
//   const [totalServices, setTotalServices] = useState<number>(0);
//   const [regionalServices, setRegionalServices] = useState<number>(0);
//   const [reklamaData, setReklamaData] = useState<Reklama[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentSlide, setCurrentSlide] = useState<number>(initialSlide);
//   const [isPaused, setIsPaused] = useState<boolean>(false);
//   const [requestText, setRequestText] = useState<string>("");
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [imageError, setImageError] = useState<boolean>(false);
//   const [errorTimerExpired, setErrorTimerExpired] = useState<boolean>(false);
//   const [region, setRegion] = useState<string>("");

//   const textSlides = useMemo(
//     () => [t("carousel.slide1"), t("carousel.slide2"), t("carousel.slide3")],
//     [t]
//   );

//   const reviews = useMemo(
//     () =>
//       Array.from({ length: 9 }, (_, i) => ({
//         id: i + 1,
//         text: t(`reviews.${i + 1}.text`),
//         comment: t(`reviews.${i + 1}.comment`),
//         date: t(`reviews.${i + 1}.date`),
//         reviewer: t(`reviews.${i + 1}.reviewer`),
//         rating: Number(t(`reviews.${i + 1}.rating`)),
//         tasksCompleted: Number(t(`reviews.${i + 1}.tasksCompleted`)),
//         image: t(`reviews.${i + 1}.image`),
//         cost: t(`reviews.${i + 1}.cost`),
//         serviceName: t(`reviews.${i + 1}.serviceName`),
//         jobName: t(`reviews.${i + 1}.jobName`),
//       })),
//     [t]
//   );

//   const validReklama = useMemo(() => {
//     const today = new Date();
//     return reklamaData.filter((rek) => {
//       const startDate = new Date(rek.start_date);
//       const endDate = new Date(rek.end_date);
//       return startDate <= today && today <= endDate;
//     });
//   }, [reklamaData]);

//   const slides = useMemo(
//     () => (validReklama.length > 0 ? validReklama : textSlides),
//     [validReklama, textSlides]
//   );

//   const topSpecialties = useMemo(
//     () => [
//       { name: t("topSpecialties.tutors"), link: "/register-specialist?category=math" },
//       { name: t("topSpecialties.repair"), link: "/register-specialist?category=english" },
//       {
//         name: t("topSpecialties.construction"),
//         link: "/register-specialist?category=plumber",
//       },
//       { name: t("topSpecialties.makeup"), link: "/register-specialist?category=tire" },
//     ],
//     [t]
//   );

//   useEffect(() => {
//     document.addEventListener(
//       "touchmove",
//       (e: TouchEvent) => {
//         if (e.touches.length > 1) e.preventDefault();
//       },
//       { passive: false }
//     );

//     return () => {
//       document.removeEventListener("touchmove", () => { });
//     };
//   }, []);

//   useEffect(() => {
//     i18n.changeLanguage(language);
//   }, [language, i18n]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [
//           categoriesData,
//           subCategoriesData,
//           totalServicesData,
//         ] = await Promise.all([
//           apiClient.getCategories(),
//           apiClient.getSubcategories(),
//           apiClient.getServices(1, 1),
//         ]);

//         setReklamaData([]);
        
//         if (Array.isArray(categoriesData)) {
//           setCategories(categoriesData);
//         } else if (categoriesData && 'results' in categoriesData) {
//           setCategories((categoriesData as any).results || []);
//         } else {
//           setCategories([]);
//         }

//         if (Array.isArray(subCategoriesData)) {
//           setSubCategories(subCategoriesData);
//         } else if (subCategoriesData && 'results' in subCategoriesData) {
//           setSubCategories((subCategoriesData as any).results || []);
//         } else {
//           setSubCategories([]);
//         }

//         if (totalServicesData && typeof totalServicesData === 'object' && 'count' in totalServicesData) {
//           setTotalServices((totalServicesData as any).count || 0);
//         } else {
//           setTotalServices(0);
//         }

//       } catch (err: unknown) {
//         console.error("Fetch error:", err);
//         setError(t("errors.fetchError"));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [apiClient, t, i18n]);

//   useEffect(() => {
//     if (isPaused) return;
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [slides.length, isPaused]);

//   useEffect(() => {
//     if (validReklama.length === 0) return;
//     const timer = setTimeout(() => {
//       if (imageError) setErrorTimerExpired(true);
//     }, 15000);
//     return () => clearTimeout(timer);
//   }, [imageError, validReklama]);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (
//       requestText.length >= 250 &&
//       ![
//         "Backspace",
//         "Delete",
//         "ArrowLeft",
//         "ArrowRight",
//         "ArrowUp",
//         "ArrowDown",
//         "Tab",
//         "Enter",
//         "Escape",
//         "Home",
//         "End",
//         "PageUp",
//         "PageDown",
//       ].includes(e.key)
//     ) {
//       e.preventDefault();
//     }
//   };

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleCategoryClick = (categoryId: number) => {
//     router.push(`/register-specialist?category=${categoryId}`);
//   };

//   const handleSubCategoryClick = (subCategoryId: number) => {
//     router.push(`/register-specialist?subcategory=${subCategoryId}`);
//   };

//   const handleShowAllClick = (categoryId: number) => {
//     router.push(`/register-specialist?category=${categoryId}&all=true`);
//   };

//   const handleSpecialtyClick = (link: string) => {
//     router.push(link);
//   };

//   const handleChoiceClick = (choice: 'find' | 'become') => {
//     if (choice === 'find') {
//       router.push('/'); // Первая страница - найти специалиста
//     } else {
//       router.push('/specialist'); // Текущая - стать специалистом
//     }
//   };

//   const getDisplayName = (item: Category | SubCategory) => {
//     if (language === "ru" && item.display_ru) {
//       return item.display_ru;
//     }
//     if (language === "uz" && item.display_uz) {
//       return item.display_uz;
//     }
//     return item.name;
//   };

//   useEffect(() => {
//     const activeSlide = slides[currentSlide];
//     if (validReklama.length > 0) {
//       const reklama = activeSlide as Reklama;
//       console.log(`Active Slide: ${currentSlide}, Link: ${reklama.link}`);
//     } else {
//       console.log(`Active Slide: ${currentSlide}, Text: ${activeSlide}`);
//     }
//   }, [currentSlide, slides, validReklama]);

//   if (loading)
//     return <LoadingContainer>{t("errors.loading")}</LoadingContainer>;
//   if (error) return <ErrorContainer>{error}</ErrorContainer>;

//   return (
//     <div>
//       <Navbar />

//       <BannerContainer>
//         <HeaderTop>
//           <MainTitle>{t("hero.titleSpecialist") || "Станьте специалистом и зарабатывайте"}</MainTitle>
//         </HeaderTop>

//         <ChoiceSection>
//           <ChoiceButton
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => handleChoiceClick('find')}
//           >
//             Найти специалиста
//           </ChoiceButton>
//           <ChoiceButton
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             style={{ background: '#218838' }}
//           >
//             Стать специалистом
//           </ChoiceButton>
//         </ChoiceSection>

//         <SearchContainer>
//           <InputWrapper>
//             <SearchIcon viewBox="0 0 24 24" aria-hidden="true">
//               <svg
//                 width="22"
//                 height="22"
//                 viewBox="0 0 22 22"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fill-rule="evenodd"
//                   clip-rule="evenodd"
//                   d="M2.48359 10.0833C2.48359 5.88592 5.88623 2.48329 10.0836 2.48329C14.281 2.48329 17.6836 5.88592 17.6836 10.0833C17.6836 12.1741 16.8393 14.0678 15.473 15.4419C15.4676 15.4469 15.4623 15.4521 15.457 15.4573C15.4517 15.4626 15.4466 15.4679 15.4415 15.4733C14.0675 16.8392 12.1741 17.6833 10.0836 17.6833C5.88623 17.6833 2.48359 14.2807 2.48359 10.0833ZM15.9002 16.8198C14.3402 18.1679 12.3071 18.9833 10.0836 18.9833C5.16826 18.9833 1.18359 14.9986 1.18359 10.0833C1.18359 5.16795 5.16826 1.18329 10.0836 1.18329C14.9989 1.18329 18.9836 5.16795 18.9836 10.0833C18.9836 12.3072 18.1679 14.3405 16.8195 15.9006L20.0429 19.124C20.2967 19.3779 20.2967 19.7894 20.0429 20.0433C19.789 20.2971 19.3775 20.2971 19.1237 20.0433L15.9002 16.8198Z"
//                   fill="#A4A8B2"
//                 />
//               </svg>
//             </SearchIcon>
//             <SearchInput
//               aria-label={t("search.ariaLabel")}
//               placeholder={t("search.placeholderSpecialist") || "Поиск услуг для регистрации"}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//             />
//           </InputWrapper>
//           <ModalButton
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => handleSearch()}
//           >
//             {t("search.search")}
//           </ModalButton>
//         </SearchContainer>

//         <CarouselContainer
//           role="region"
//           aria-label={t("carousel.ariaLabel")}
//           onMouseEnter={() => setIsPaused(true)}
//           onMouseLeave={() => setIsPaused(false)}
//         >
//           <SlideWrapper>
//             {validReklama.length > 0 && !errorTimerExpired ? (
//               <ReklamaSlide
//                 isActive={true}
//                 href={(slides[currentSlide] as Reklama).link || "#"}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-hidden={false}
//               >
//                 <ReklamaImage
//                   src={(slides[currentSlide] as Reklama).image}
//                   alt={`Реклама ${currentSlide + 1}`}
//                   loading="lazy"
//                   onError={(e) => {
//                     e.currentTarget.src = "/placeholder-image.jpg";
//                     setImageError(true);
//                   }}
//                 />
//                 <BannerHighlight>111 × 387 Hug</BannerHighlight>
//               </ReklamaSlide>
//             ) : (
//               <ErrorMessage>
//                 {errorTimerExpired
//                   ? t("errors.imageError")
//                   : (slides[currentSlide] as string)}
//               </ErrorMessage>
//             )}
//           </SlideWrapper>
//           <RegionInputWrapper>
//             <RegionFlag>🇺🇿</RegionFlag>
//             <RegionInput
//               placeholder="Выберите город"
//               value={region}
//               onChange={(e) => setRegion(e.target.value)}
//             />
//           </RegionInputWrapper>
//         </CarouselContainer>

//         <QuestionSection>
//           <QuestionTitle>Какие услуги вы хотите заказать?</QuestionTitle>
//           <p>Опишите, что вам нужно, и мы подберем лучших специалистов</p>
//           <QuestionOptions>
//             <QuestionOption>Ремонт квартиры</QuestionOption>
//             <QuestionOption>Уроки английского</QuestionOption>
//             <QuestionOption>Установка кондиционера</QuestionOption>
//           </QuestionOptions>
//         </QuestionSection>

//         <RegistrationSection>
//           <RegistrationTitle>Зарегистрируйтесь, чтобы зарабатывать</RegistrationTitle>
//           <RegistrationSubtitle>Создайте профиль специалиста и получайте заказы от клиентов</RegistrationSubtitle>
//           <StatsBadge>111 × 387 заказов на платформе</StatsBadge>
//           <RegistrationForm>
//             <RegInput placeholder="Ваш email" type="email" />
//             <RegButton>Зарегистрироваться</RegButton>
//           </RegistrationForm>
//         </RegistrationSection>

//         <TopSpecialtiesContainer>
//           {topSpecialties.map((specialty, index) => (
//             <SpecialtyContainer key={index}>
//               <TopSpecialtyCard
//                 onClick={() => handleSpecialtyClick(specialty.link)}
//               >
//                 {/* <CardImage src="/avatar/logologo.png" alt={specialty.name} /> */}
//               </TopSpecialtyCard>
//               <SpecialtyTitle>{specialty.name}</SpecialtyTitle>
//             </SpecialtyContainer>
//           ))}
//         </TopSpecialtiesContainer>

//         <SpecialistsContainer>
//           <SpecialistsTitle>{t("specialists.titleSpecialist") || "Популярные категории для специалистов"}</SpecialistsTitle>
//           <SpecialistsDescription>
//             {"5 " + t("specialists.descriptionSpecialist") || "минут на регистрацию"}
//           </SpecialistsDescription>
//           <SpecialistsGrid>
//             {categories.map((category) => {
//               const subCategoryCount = subCategories.filter((sub) => {
//                 const categoryId =
//                   typeof sub.category === "number"
//                     ? sub.category
//                     : sub.category.id;
//                 return categoryId === category.id;
//               }).length;
//               return (
//                 <SpecialistItem key={category.id}>
//                   <div style={{ display: "inline-flex", alignItems: "center" }}>
//                     <SpecialistCategory
//                       onClick={() => handleCategoryClick(category.id)}
//                     >
//                       {getDisplayName(category)}
//                     </SpecialistCategory>
//                     <SpecialistCount>
//                       {category.service_count || 0}
//                     </SpecialistCount>
//                   </div>
//                   <SubCategoryList>
//                     {subCategories
//                       .filter((sub) => {
//                         const categoryId =
//                           typeof sub.category === "number"
//                             ? sub.category
//                             : sub.category.id;
//                         return categoryId === category.id;
//                       })
//                       .slice(0, 5)
//                       .map((subCategory) => (
//                         <SubCategoryItem
//                           key={subCategory.id}
//                           onClick={() => handleSubCategoryClick(subCategory.id)}
//                         >
//                           {getDisplayName(subCategory)}
//                         </SubCategoryItem>
//                       ))}
//                   </SubCategoryList>
//                   <ShowAllLink onClick={() => handleShowAllClick(category.id)}>
//                     {t("specialists.showAll")} ({subCategoryCount})
//                   </ShowAllLink>
//                 </SpecialistItem>
//               );
//             })}
//           </SpecialistsGrid>
//         </SpecialistsContainer>

//         <RequestContainer>
//           <RequestText>
//             <RequestTitle>{t("request.titleSpecialist") || "Расскажите о своих услугах"}</RequestTitle>
//             <RequestDescription>{t("request.descriptionSpecialist") || "Опишите, чем вы занимаетесь, и мы поможем найти клиентов"}</RequestDescription>
//             <StyledDescription>
//               {"5 " + t("specialists.descriptionSpecialist") || "минут на создание профиля"}
//             </StyledDescription>
//           </RequestText>
//           <RequestInputWrapper>
//             <RequestInput
//               aria-label={t("request.inputAriaLabelSpecialist") || "Описание услуг"}
//               placeholder={t("request.inputPlaceholderSpecialist") || "Например: 'Я ремонтирую квартиры в Ташкенте'"}
//               value={requestText}
//               onChange={(e) => setRequestText(e.target.value)}
//               onKeyDown={handleKeyDown}
//               maxLength={250}
//             />
//             <CharacterCounter isMax={requestText.length === 250}>
//               {requestText.length}/250
//             </CharacterCounter>
//             <RequestButton>{t("request.buttonSpecialist") || "Создать профиль"}</RequestButton>
//           </RequestInputWrapper>
//         </RequestContainer>

//         <ReviewsBlock reviews={reviews} />
//       </BannerContainer>
//     </div>
//   );
// }