import styled from "@emotion/styled";
import {motion} from "framer-motion";

export const SearchPageWrapper = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(10px, 2vw, 20px);
  margin-bottom: 2rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 2rem;
  padding: 0 clamp(10px, 2vw, 33px);
  transition: padding 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 16px;
  }
`;

export const MainTitle = styled.h1`
  font-size: clamp(1.6rem, 4.5vw, 2rem);
  font-weight: 400;
  color: #000;
  transition: font-size 0.3s ease;
  max-width: 600px;
  white-space: normal;
  overflow-wrap: break-word;
  line-height: 1.2;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    max-width: 400px;
    text-align: center;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    max-width: 300px;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  gap: clamp(5px, 1vw, 10px);
  justify-content: center;
  width: 100%;
  max-width: 905px;
  align-items: center;

  @media (max-width: 500px) {
    flex-direction: column-reverse; /* кнопка сверху, инпут снизу */
    align-items: stretch;           /* растягиваем детей на 100% */
    gap: 8px;

    /* тянем обоих детей (инпут и кнопку) на всю ширину */
    & > * { width: 100%; }
    /* safety для нативных тегов */
    & input, & button { width: 100%; }
  }
`;


export const SearchInput = styled.input`
  padding: 13px 13px 13px 40px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 16px;
  font-size: 16px;
  background: #e9ecef;
  transition: padding 0.3s ease, font-size 0.3s ease;

  @media (max-width: 768px) {
    padding-left: 35px;
  }

  @media (max-width: 480px) {
    padding-left: 30px;
  }

`;

export const SearchIcon = styled.svg`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  fill: #333;
`;

export const CategoryButton = styled(motion.button)`
  width: 130%;
  margin-top: -30px;
  max-width: 260px;
  padding: 1.1rem;
  font-size: 1.21rem;
  font-weight: 300;
  border: 1px solid #eee;
  border-radius: 16px;
  background: #ffffff;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: left;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0.88rem; /* Уменьшено на 20% */
    font-size: 0.968rem; /* Уменьшено на 20% */
  }
`;

export const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #eee;
  border-radius: 16px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
  @media (max-width: 768px) {
    max-height: 160px; /* Уменьшено на 20% */
  }
`;

export const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

export const ToggleButton = styled(motion.button)<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${({ active }) => (active ? "#3ea23e" : "#727373")};
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${({ active }) => (active ? "#669a66" : "#9ea2a6")};
  }
`;

export const CustomToggleButton = styled(ToggleButton)`
  font-weight: 400;
`;

export const ResultsGrid = styled.main`
  display: grid;
  grid-template-columns: 1.2fr 2.805fr;
  gap: 1.7rem;
  align-items: start; /* Уточнено для выравнивания по верхнему краю */
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  width: 308px;
  height: 98%;
  padding: 1.925rem;
  background: transparent;
  border-radius: 16px;
  @media (max-width: 1024px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

export const FilterSectionTitle = styled.h3`
  font-size: 1.54rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #eee;
  background: #ffffff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 768px) {
    font-size: 1.232rem; /* Уменьшено на 20% */
    padding: 0.4rem 0.6rem; /* Уменьшено на 20% */
    margin-bottom: 0.8rem; /* Уменьшено на 20% */
  }
`;

export const FilterGroup = styled.div`
  margin-bottom: 1.275rem;
  background: transparent;
  @media (max-width: 768px) {
    margin-bottom: 1.02rem; /* Уменьшено на 20% */
  }
`;

export const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.95rem;
  font-size: 1.21rem;
  color: #444;
  cursor: pointer;
  font-weight: 300;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }

  input {
    appearance: none;
    width: 26.4px;
    height: 26.4px;
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    transition: border-radius 0.2s ease, border 0.2s ease;

    &:checked {
      border-radius: 50%;
      border: 2px solid #000;
      background: #ffffff;
    }

    @media (max-width: 768px) {
      width: 21.12px; /* Уменьшено на 20% */
      height: 21.12px; /* Уменьшено на 20% */
    }
  }

  @media (max-width: 768px) {
    font-size: 0.968rem; /* Уменьшено на 20% */
    margin-bottom: 0.76rem; /* Уменьшено на 20% */
  }
`;

export const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: transparent;
`;

export const ResultItem = styled.div`
  display: flex;
  gap: 1.1rem;
  padding: 1.375rem;
  background: #ffffff;
  border-radius: 16px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ResultContent = styled.div`
  flex: 1;
  padding-right: 1rem;
  background: #ffffff;
`;

export const ResultAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 18px;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
  @media (max-width: 480px) {
    width: 26px;
    height: 26px;
  }
`;

export const ResultName = styled.h3`
  font-size: 1.65rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

export const ResultPrice = styled.h3`
  font-size: 1.35rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

export const Underline = styled.div`
  width: 100%;
  height: 1px;
  background: #e6e6e6;
  margin: 1.5rem 0;
`;

export const UserInfoContainer = styled.div`
  background: #f2f3f7;
  padding: 6.6px;
  border-radius: 18px;
  display: flex;
  margin-top: -18px;
  align-items: center;
  gap: 5.5px;
  box-sizing: border-box;
  flex-wrap: nowrap;
  overflow: hidden;
  max-width: 230px;
  @media (max-width: 768px) {
    padding: 4.4px;
    gap: 4.4px;
    max-width: 172.5px;
  }
  @media (max-width: 480px) {
    margin-top: -2px;
    padding: 3.3px;
    gap: 3.3px;
    max-width: 138px;
  }
`;

export const UserImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 18px;
  object-fit: cover;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
  @media (max-width: 480px) {
    width: 26px;
    height: 26px;
  }
`;

export const UserName = styled.span`
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  color: #000;
  display: block;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 480px) {
    font-size: clamp(0.65rem, 1.2vw, 0.75rem);
  }
`;

export const ResultHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const RegionContainer = styled.div`
  background: #f2f3f7;
  padding: 6.6px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 5.5px;
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 172.5px;
  @media (max-width: 768px) {
    padding: 4.4px;
    gap: 4.4px;
    font-size: clamp(0.75rem, 1.6vw, 0.85rem);
    max-width: 138px;
  }
  @media (max-width: 480px) {
    padding: 3.3px;
    gap: 3.3px;
    font-size: clamp(0.65rem, 1.2vw, 0.75rem);
    max-width: 115px;
  }
`;

export const HoursContainer = styled.div`
  background: #f2f3f7;
  padding: 6.6px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 5.5px;
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 172.5px;
  @media (max-width: 768px) {
    padding: 4.4px;
    gap: 4.4px;
    font-size: clamp(0.75rem, 1.6vw, 0.85rem);
    max-width: 138px;
  }
  @media (max-width: 480px) {
    padding: 3.3px;
    gap: 3.3px;
    font-size: clamp(0.65rem, 1.2vw, 0.75rem);
    max-width: 115px;
  }
`;

export const ResultDetail = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

export const ResultReview = styled.p`
  font-size: 1.05rem;
  color: #777;
  margin: 1rem 0;
  font-style: italic;
`;

export const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ccdbb3;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #a0ffa0;
  }
`;

export const ErrorMessage = styled(motion.div)`
  color: #d32f2f;
  font-size: clamp(0.9rem, 2vw, 1rem);
  text-align: center;
  margin-bottom: 16px;
  background: #ffffff;
  @media (min-width: 769px) {
    font-size: clamp(1rem, 2vw, 1.1rem);
  }
`;

export const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #666;
  background: #ffffff;
  z-index: 9999; /* чтобы было поверх всего */
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  padding: 20px;
  max-width: 500px;
  width: 90%;
  background: #ffffff;
  border-radius: 16px;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.h3`
  font-weight: 300;
  color: #1a1a1a;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  margin: 0 0 20px;
`;

export const ModalDetail = styled.p`
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  color: #666;
  margin: 10px 0;
  line-height: unset;
`;


export const ResponsiveActionButtonLogin = styled(motion.button)`
	width: auto;
	font-size: 16px;
	padding: 12px;
	background-color: #4caf50;
	color: white;
	border-radius: 16px;
	cursor: pointer;
	transition: background-color 0.3s;
	margin: 5px;
	
	&:hover {
		background-color: #45a049;
	}
	
	&.danger {
		background-color: #dc3545;
		&:hover {
			background-color: #c82333;
		}
	}
	
	@media (min-width: 600px) {
		width: auto;
		padding: 12px 32px;
	}
`;



export const ResponsiveActionButton = styled(motion.button)`
  width: auto;
  font-size: 16px;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px;

  &:hover {
    background-color: #45a049;
  }

  &.danger {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }

  @media (min-width: 600px) {
    width: auto;
    padding: 12px 32px;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
`;

export const ServiceImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  background: #ffffff;
`;

export const SearchTitle = styled.h1`
  font-size: clamp(1.6rem, 4.5vw, 2rem);
  font-weight: 400;
  color: #000;
  text-align: center;
  margin: 0; /* Убраны лишние отступы */
  max-width: 600px;
  white-space: normal;
  overflow-wrap: break-word;
  line-height: 1.2;
  transition: font-size 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    max-width: 300px;
  }
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top: 4px solid #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    border-width: 2px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const RetryButton = styled.button`
  padding: 12px 20px;
  background: #28a745;
  border: none;
  border-radius: 16px;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #fff;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #218838;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 8px 12px;
  }
`;

export const IconWrapper = styled.div`
  font-size: 1.32rem;
  color: #000;
  background: #f2f3f7;
  padding: 4.4px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    font-size: 1.056rem; /* Уменьшено на 20% */
    padding: 3.52px; /* Уменьшено на 20% */
  }
`;
