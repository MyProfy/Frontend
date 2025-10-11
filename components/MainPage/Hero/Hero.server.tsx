import styled from "@emotion/styled";
import BannerClient from "./Hero.client";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Профессионалы на любой запрос",
    description: "Найдите специалистов в Ташкенте для любых задач",
};

const BannerWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    @media (max-width: 768px) {
        min-height: auto;
    }
`;

interface BannerServerProps {
    initialSlide?: number;
}

export default function BannerServer({ initialSlide = 0 }: BannerServerProps) {
    
    
    return (
        <BannerWrapper>
            <BannerClient initialSlide={initialSlide} />
        </BannerWrapper>
    );
}