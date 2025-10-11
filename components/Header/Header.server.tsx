import styled from "@emotion/styled";
import { motion } from "framer-motion";
import ClientHeader from "../MainPage/Hero/Hero.client";

const HeaderContainer = styled(motion.header)<{ isScrolled: boolean }>`
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    z-index: 50;
    padding: 12px 24px;
    border-radius: 16px;
    transition: all 0.3s ease-in-out;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 2px solid rgba(152, 251, 152, 0.8);
    animation: glowEffect 5s ease-in-out infinite;

    ${({ isScrolled }) =>
        isScrolled
            ? `
          border: 2px solid rgba(144, 238, 144, 1);
        `
            : ""}

    @keyframes glowEffect {
        0% {
            box-shadow:
                0px 0px 8px 2px rgba(152, 251, 152, 0.3),
                0px 0px 20px 8px rgba(144, 238, 144, 0.25),
                0px 0px 40px 15px rgba(144, 238, 144, 0.15);
        }
        50% {
            box-shadow:
                0px 0px 12px 4px rgba(152, 251, 152, 0.4),
                0px 0px 30px 12px rgba(144, 238, 144, 0.3),
                0px 0px 50px 25px rgba(144, 238, 144, 0.2);
        }
        100% {
            box-shadow:
                0px 0px 8px 2px rgba(152, 251, 152, 0.3),
                0px 0px 20px 8px rgba(144, 238, 144, 0.25),
                0px 0px 40px 15px rgba(144, 238, 144, 0.15);
        }
    }
`;

export default function HeaderServer() {
    return (
        <HeaderContainer isScrolled={false} initial={{ y: -100, opacity: 0 }}>
            <ClientHeader />
        </HeaderContainer>
    );
}
