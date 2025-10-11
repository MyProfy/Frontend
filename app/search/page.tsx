"use client";

import React from "react";
import { Suspense } from "react";
import Header from "@/components/Header/Header.server";
import Footer from "@/components/Footer/Footer";
import { SearchPage as SearchPageComponent } from "@/components/SearchPage/SearchPage"; 
import ClientRoot from "@/components/ClientRoot";
import Loader from "@/components/Loader/Loader";

export default function SearchPage() {
    return (
        <ClientRoot>
            <Loader >
                <Header />
                <Suspense fallback={<div>Загрузка результатов поиска...</div>}>
                    <SearchPageComponent /> 
                </Suspense>
                <Footer />
            </Loader>
        </ClientRoot>
    );
}