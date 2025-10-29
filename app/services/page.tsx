"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer/Footer";
import VacanciesCategory from "@/components/VacanciesCategory/Vacancies";
import ClientRoot from "@/components/ClientRoot";
import Loader from "@/components/Loader/Loader";
import Navbar from "@/components/Header/Navbar";  

export default function Vacancies() {
    return (
        <ClientRoot>
            {/* <Loader 
                duration={3500}
                // message="Loading..."
            > */}
                <Navbar />
                <VacanciesCategory />
            {/* </Loader> */}
        </ClientRoot>
    );
}