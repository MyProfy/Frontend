// import styled from "@emotion/styled";

// // Color palette for consistency
// const colors = {
//   white: "#fff",
//   black: "#000",
//   grayLight: "#fafafa",
//   grayMedium: "#ddd",
//   grayDark: "#666",
//   greenLight: "#90ee90",
//   gold: "#ffd700",
//   error: "#d32f2f",
// } as const;

// // Breakpoints for responsiveness
// const breakpoints = {
//   mobile: "480px",
// } as const;

// export const Card = styled.div`
//   background: ${colors.white};
//   border-radius: 12px;
//   padding: 24px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//   display: flex;
//   gap: 20px;

//   @media (max-width: ${breakpoints.mobile}) {
//     flex-direction: column;
//     padding: 12px;
//     gap: 10px;
//   }
// `;

// export const AvatarContainer = styled.div`
//   width: 120px;
//   height: 120px;
//   border-radius: 12px;
//   overflow: hidden;
//   flex-shrink: 0;

//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//   }

//   @media (max-width: ${breakpoints.mobile}) {
//     width: 100px;
//     height: 100px;
//   }
// `;

// export const InfoContainer = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;

//   @media (max-width: ${breakpoints.mobile}) {
//     gap: 12px;
//   }
// `;

// export const EditableField = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0px;

//   @media (max-width: ${breakpoints.mobile}) {
//     gap: 0px;
//   }
// `;

// export const ProfileName = styled.h2`
//   font-size: 1.5rem;
//   font-weight: 600;
//   color: ${colors.black};
//   margin: 0; /* Убираем отступы для выравнивания с началом контейнера */

//   @media (max-width: ${breakpoints.mobile}) {
//     font-size: 1.2rem;
//   }
// `;

// export const InfoText = styled.p`
//   font-size: 1rem;
//   color: ${colors.grayDark};
//   margin: 0;
//   display: flex;
//   align-items: center;
//   gap: 0px; /* Минимизируем расстояние внутри текста */

//   @media (max-width: ${breakpoints.mobile}) {
//     font-size: 0.85rem;
//     gap: 0px;
//   }
// `;

// export const AboutText = styled.p`
//   font-size: 2rem;
//   color: #292c32;
//   margin: 0;
//   display: flex;
//   align-items: center;
//   gap: 0px;

//   @media (max-width: ${breakpoints.mobile}) {
//     font-size: 0.85rem;
//     gap: 0px;
//   }
// `;

// export const EditIcon = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 0.9rem;
//   color: ${colors.grayDark};
//   transition: color 0.3s ease;
//   padding: 0;
//   margin: 0; /* Убираем все отступы */
//   line-height: 1;

//   &:hover {
//     color: ${colors.black};
//   }

//   &:disabled {
//     cursor: not-allowed;
//     opacity: 0.5;
//   }

//   @media (max-width: ${breakpoints.mobile}) {
//     font-size: 0.8rem;
//   }
// `;

// export const DescriptionInput = styled.textarea`
//   width: 100%;
//   height: 170px;
//   border: 1px solid ${colors.grayMedium};
//   border-radius: 8px;
//   padding: 10px;
//   font-size: 1rem;
//   color: ${colors.grayDark};
//   resize: none;
//   outline: none;
//   background: ${colors.grayLight};

//   &:focus {
//     border-color: ${colors.greenLight};
//   }

//   &:disabled {
//     background: ${colors.grayMedium};
//     cursor: not-allowed;
//   }

//   @media (max-width: ${breakpoints.mobile}) {
//     height: 100px;
//     padding: 8px;
//     font-size: 0.85rem;
//   }
// `;

// export const Rating = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 5px;
//   font-size: 0.9rem;
//   color: ${colors.grayDark};

//   @media (max-width: ${breakpoints.mobile}) {
//     font-size: 0.8rem;
//     gap: 3px;
//   }
// `;

// export const Stars = styled.div`
//   color: ${colors.gold};
//   display: flex;
//   gap: 2px;
//   margin-top: -10px;

//   svg {
//     width: 24px;
//     height: 24px;
//   }

//   @media (max-width: ${breakpoints.mobile}) {
//     margin-top: -8px;
//     svg {
//       width: 18px;
//       height: 18px;
//     }
//   }
// `;

// export const ExperienceNote = styled.span`
//   font-size: 0.8rem;
//   color: #999;
//   font-style: italic;
//   margin-left: 8px;

//   @media (max-width: ${breakpoints.mobile}) {
//     font-size: 0.7rem;
//     margin-left: 4px;
//   }
// `;

// export const ActionButton = styled.button`
//   background: none;
//   border: 1px solid ${colors.grayMedium};
//   border-radius: 8px;
//   padding: 10px;
//   font-size: 1rem;
//   color: #333;
//   cursor: pointer;
//   transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
//   text-align: center;
//   width: 140px;

//   &:hover {
//     background: #3ea23e;
//     border-color: #3ea23e;
//     color: ${colors.white};
//   }

//   &:disabled {
//     cursor: not-allowed;
//     opacity: 0.5;
//   }

//   @media (max-width: ${breakpoints.mobile}) {
//     padding: 8px;
//     font-size: 0.85rem;
//     width: 120px;
//   }
// `;


// export const StatusToggle = styled.div<{ isOnline: boolean }>`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   font-size: 0.9rem;
//   color: ${({ isOnline }) => (isOnline ? "#00cc00" : colors.grayDark)};
//   cursor: pointer;

//   @media (max-width: ${breakpoints.mobile}) {
//     font-size: 0.8rem;
//     gap: 6px;
//   }
// `;

// export const StatusDot = styled.div<{ isOnline: boolean }>`
//   width: 8px;
//   height: 8px;
//   border-radius: 50%;
//   background: ${({ isOnline }) => (isOnline ? "#00cc00" : colors.grayDark)};

//   @media (max-width: ${breakpoints.mobile}) {
//     width: 6px;
//     height: 6px;
//   }
// `;


// export const ModalInput = styled.input`
//   padding: 10px;
//   border: 1px solid ${colors.grayMedium};
//   border-radius: 8px;
//   font-size: 16px;
//   color: ${colors.grayDark};
//   outline: none;
//   background: ${colors.grayLight};
//   width: 100%;   /* теперь всегда тянется */
//   box-sizing: border-box;
  
//   &:focus {
//     border-color: ${colors.greenLight};
//   }
  
//   &:disabled {
//     background: ${colors.grayMedium};
//     cursor: not-allowed;
//   }
  
//   @media (max-width: ${breakpoints.mobile}) {
//     padding: 8px;
//     font-size: 16px;
//   }
// `;


// export const ModalSelect = styled.select`
//   padding: 10px;
//   border: 1px solid ${colors.grayMedium};
//   border-radius: 8px;
//   font-size: 1rem;
//   color: ${colors.grayDark};
//   outline: none;
//   background: ${colors.grayLight};
//   cursor: pointer;
//   width: 100%;
//   box-sizing: border-box;

//   &:focus {
//     border-color: ${colors.greenLight};
//   }

//   &:disabled {
//     cursor: not-allowed;
//     opacity: 0.5;
//   }

//   @media (max-width: ${breakpoints.mobile}) {
//     padding: 8px;
//     font-size: 0.85rem;
//   }
// `;

// export const ModalInputGroup = styled.div`
//   display: flex;
//   gap: 10px;
//   align-items: center;

//   @media (max-width: ${breakpoints.mobile}) {
//     gap: 6px;
//     flex-wrap: wrap;
//   }
// `;

// export const ErrorText = styled.span`
//   color: ${colors.error};
//   font-size: 0.8rem;

//   @media (max-width: ${breakpoints.mobile}) {
//     font-size: 0.7rem;
//   }
// `;
