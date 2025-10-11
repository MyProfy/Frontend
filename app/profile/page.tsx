"use client";

import React, { useState } from "react";
import Header from "@/components/MainPage/Hero/Hero.client";
import Footer from "@/components/Footer/Footer";
import ProfilePage from "@/components/ProfilePage/Hero";
import ClientRoot from "@/components/ClientRoot";
import Loader from "@/components/Loader/Loader";

export default function Profile() {
    const [showContent, setShowContent] = useState(false);

    const handleLoadingComplete = () => {
        setShowContent(true);
    };

    return (
        <ClientRoot>
            <Loader duration={3500} message="Loading Profile..." onLoadingComplete={() => { }}>
                {showContent && (
                    <>
                        <Header />
                        <ProfilePage />
                        <Footer />
                    </>
                )}
            </Loader>
        </ClientRoot>
    );
}