"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/MainPage/Hero/Hero.client";
import Footer from "@/components/Footer/Footer";
import ClientRoot from "@/components/ClientRoot";
import "flag-icons/css/flag-icons.min.css";
import Loader from "@/components/Loader/Loader";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isLoaderEnabled, setIsLoaderEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoaderEnabled) {
      setIsLoading(false);
      setShowContent(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoaderEnabled]);

  const handleLoadingComplete = () => {
    setShowContent(true);
  };

  if (process.env.NODE_ENV === "development") {
    console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  }

  return (
    <ClientRoot>
      {isLoaderEnabled ? (
        <Loader
          duration={3500}
          onLoadingComplete={handleLoadingComplete}
          containerSize={{ width: "120px", height: "120px" }}
          circleSize={{ width: "120px", height: "120px" }}
          trailSize={{ width: "120px", height: "120px" }}
          animationPosition={{ top: "50%", left: "10%" }}
          textSize="2.5rem"
          textGap="80px"
          textPosition={{ left: "20px" }}
          trailCount={3}
          message="WELCOME !"
        >
          {showContent && (
            <>
              <Header />
              <Footer />
            </>
          )}
        </Loader>
      ) : (
        <>
          <Header />
          <Footer />
        </>
      )}
    </ClientRoot>
  );
}