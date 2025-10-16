import BannerClient from "./Hero.client";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Профессионалы на любой запрос",
    description: "Найдите специалистов в Ташкенте для любых задач",
};

interface BannerServerProps {
    initialSlide?: number;
}

export default function BannerServer({ initialSlide = 0 }: BannerServerProps) {
    return (
        <div className="w-full min-h-0 md:min-h-screen flex flex-col bg-white/95">
            <BannerClient initialSlide={initialSlide} />
        </div>
    );
}