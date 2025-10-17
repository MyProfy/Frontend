// import React, { useState, useCallback, useEffect, useMemo } from "react";
// import styled from "@emotion/styled";
// import { useTranslation } from "react-i18next";
// import Filters from "./Filter";
// // import Results from "./Results";
// import { Category, SubCategory, Service, Vacancy } from "../types/apiTypes";
// import { Filters as FiltersType } from "./types";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import { FaChevronDown, FaFilter } from "react-icons/fa6";
// import { debounce } from "lodash";
// import {
//   SearchPageWrapper,
//   ToggleContainer,
//   ToggleButton,
//   ResultsGrid,
//   ErrorMessage,
//   LoadingContainer,
//   LoadingSpinner,
//   RetryButton,
//   SearchContainer,
//   SearchInput,
//   SearchIcon,
//   SearchTitle,
// } from "./styles";
// import { motion, AnimatePresence } from "framer-motion";
// import { getAPIClient } from "../types/apiClient";

// const SearchHeader = styled.div`
//   display: flex;
//   align-items: flex-start;
//   gap: clamp(10px, 2vw, 20px);
//   margin-bottom: 1rem;
//   flex-wrap: wrap;
//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: flex-start;
//     margin-bottom: 1.5rem;
//   }
// `;

// const StyledSearchTitle = styled(SearchTitle)`
//   font-weight: 600;
//   text-align: left;
// `;

// const ResultsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
//   align-self: start;
//   margin-top: 0;
// `;

// const StyledResultsGrid = styled(ResultsGrid)`
//   grid-template-columns: 1.2fr 2.55fr;
//   margin-left: 0;
//   align-items: flex-start;
//   gap: 1.7rem;
//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//     gap: clamp(8px, 1.5vw, 15px);
//     margin: clamp(15px, 2vw, 20px) auto;
//   }
//   @media (max-width: 480px) {
//     margin: clamp(10px, 1.5vw, 15px) auto;
//   }
// `;

// const StyledToggleContainer = styled(ToggleContainer)`
//   margin-top: clamp(48px, 8vh, 96px);
//   @media (max-width: 768px) {
//     margin-top: 80px;
//   }
// `;

// const StyledToggleButton = styled(ToggleButton)`
//   font-weight: 400;
// `;

// const FilterToggleButton = styled(motion.button)`
//   display: none;
//   padding: 0.75rem 1rem;
//   background: #ffffff;
//   border: 1px solid #eee;
//   border-radius: 16px;
//   font-size: clamp(0.85rem, 1.8vw, 0.95rem);
//   color: #444;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   @media (max-width: 768px) {
//     display: flex;
//   }
//   @media (min-width: 769px) {
//     display: none !important;
//   }
// `;

// const FiltersWrapper = styled(motion.div)`
//   @media (max-width: 768px) {
//     display: none;
//     &[data-visible="true"] {
//       display: block;
//     }
//   }
//   @media (min-width: 769px) {
//     display: none !important;
//   }
// `;

// const SidebarWrapper = styled.div`
//   @media (max-width: 768px) {
//     display: none;
//   }
// `;

// export const SearchPage: React.FC = () => {
//   const { t } = useTranslation();
//   const apiClient = useMemo(() => getAPIClient(), []);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<FiltersType>({
//     price: new Set<string>(),
//     hours: new Set<string>(),
//     experience: new Set<string>(),
//     category: "",
//     subcategory: new Set<string>(),
//     region: "",
//   });
//   const [searchResults, setSearchResults] = useState<(Service | Vacancy)[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<"services" | "vacancies">("services");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isFiltersVisible, setIsFiltersVisible] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const query = searchParams.get("q") || "";
//     const region = searchParams.get("region") || "";
//     const category = searchParams.get("category") || "";
//     const subcategory = searchParams.get("subcategory") || "";
//     setSearchQuery(query);
//     setFilters((prev) => ({
//       ...prev,
//       category,
//       subcategory: subcategory ? new Set(subcategory.split(",")) : new Set<string>(),
//       region,
//     }));
//   }, [searchParams]);

//   useEffect(() => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (searchQuery) {
//       params.set("q", searchQuery);
//     } else {
//       params.delete("q");
//     }
//     if (filters.region) {
//       params.set("region", filters.region);
//     } else {
//       params.delete("region");
//     }
//     if (filters.category) {
//       params.set("category", filters.category);
//     } else {
//       params.delete("category");
//     }
//     if (filters.subcategory.size > 0) {
//       params.set("subcategory", Array.from(filters.subcategory).join(","));
//     } else {
//       params.delete("subcategory");
//     }
//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//   }, [searchQuery, filters, router, pathname, searchParams]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const categoriesData = await apiClient.getCategories();

//         let categories: Category[] = [];
//         if (categoriesData && "results" in categoriesData && Array.isArray(categoriesData.results)) {
//           categories = categoriesData.results as Category[];
//         } else if (Array.isArray(categoriesData)) {
//           categories = categoriesData as Category[];
//         }

//         setCategories(categories);
//       } catch (err: unknown) {
//         setError(err instanceof Error ? err.message : t("errors.fetchError"));
//       }
//     };

//     fetchCategories();
//   }, [t, apiClient]);

//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const params: { category?: string } = {};
//         if (filters.category) params.category = filters.category;

//         const subcategoriesData = await apiClient.getSubcategories(params);
//         console.log("Subcategories API Response:", subcategoriesData);

//         const subcategories: SubCategory[] =
//           Array.isArray(subcategoriesData)
//             ? subcategoriesData
//             : "results" in subcategoriesData
//               ? (subcategoriesData as { results: SubCategory[] }).results
//               : [];

//         setSubcategories(subcategories);
//       } catch (err: unknown) {
//         console.error("Subcategories Error:", err);
//         setError(err instanceof Error ? err.message : t("errors.fetchError"));
//       }
//     };

//     if (filters.category) fetchSubcategories();
//     else setSubcategories([]);
//   }, [filters.category, t, apiClient]);

//   const fetchSearchResults = useCallback(async () => {
//     setError(null);
//     setIsLoading(true);
//     try {
//       const params = {
//         search: searchQuery || undefined,
//         category: filters.category ? filters.category : undefined,
//         sub_categories__in:
//           filters.subcategory.size > 0
//             ? Array.from(filters.subcategory).join(",")
//             : undefined,
//         price__gte:
//           filters.price.size > 0
//             ? Math.min(
//                 ...Array.from(filters.price)
//                   .map((p) => parseInt(p.split("-")[0]))
//                   .filter((v) => !isNaN(v))
//               )
//             : undefined,
//         price__lte:
//           filters.price.size > 0
//             ? Math.max(
//                 ...Array.from(filters.price)
//                   .map((p) => parseInt(p.split("-")[1] || p))
//                   .filter((v) => !isNaN(v))
//               )
//             : undefined,
//         executor__work_experience__gte:
//           filters.experience.size > 0
//             ? Math.min(
//                 ...Array.from(filters.experience)
//                   .map((e) => parseFloat(e.split("-")[0]))
//                   .filter((v) => !isNaN(v))
//               )
//             : undefined,
//         executor__work_experience__lte:
//           filters.experience.size > 0
//             ? Math.max(
//                 ...Array.from(filters.experience)
//                   .map((e) => parseFloat(e.split("-")[1] || e))
//                   .filter((v) => !isNaN(v))
//               )
//             : undefined,
//         region: filters.region || undefined,
//         include: "boosts,images,reviews,executor,client,sub_categories,category",
//       };

//       const cleanParams: Record<string, string> = Object.fromEntries(
//         Object.entries(params)
//           .filter(([_, value]) => value !== undefined && value !== "")
//           .map(([key, value]) => [key, String(value)])
//       );

//       let results: (Service | Vacancy)[] = [];
//       if (viewMode === "services") {
//         const servicesData = await apiClient.getServices(1, 50, cleanParams);
//         const services =
//           "results" in servicesData ? servicesData.results : servicesData;

//         results = await Promise.all(
//           services.map(async (service: any) => {
//             let userData: any = {
//               id: service.executor,
//               name: t("order.notSpecified"),
//               gender: null,
//               executor_rating: 0,
//               client_rating: 0,
//               work_experience: null,
//               created_at: "",
//               region: null,
//               phone: null,
//               email: null,
//               telegram_username: null,
//             };
//             try {
//               userData = await apiClient.getUserById(service.executor.toString());
//             } catch (err) {
//               // Silent catch
//             }

//             return {
//               id: service.id,
//               name: service.name || "",
//               description: service.description || "",
//               category:
//                 typeof service.category === "number"
//                   ? {
//                       id: service.category,
//                       name:
//                         categories.find((c) => c.id === service.category)?.name ||
//                         t("order.notSpecified"),
//                     }
//                   : service.category || { id: 0, name: t("order.notSpecified") },
//               sub_categories: Array.isArray(service.sub_categories)
//                 ? service.sub_categories.map((sub: any) =>
//                     typeof sub === "number"
//                       ? {
//                           id: sub,
//                           name:
//                             subcategories.find((s) => s.id === sub)?.name ||
//                             t("order.notSpecified"),
//                         }
//                       : { id: sub.id, name: sub.name }
//                   )
//                 : [],
//               price: Number(service.price) || 0,
//               executor: userData,
//               images: service.images || [],
//               reviews: service.reviews || [],
//               boosts: service.boosts || [],
//             } as Service;
//           })
//         );
//       } else if (viewMode === "vacancies") {
//         const vacanciesData = await apiClient.getVacancies(1, 50, cleanParams);
//         const vacancies =
//           "results" in vacanciesData ? vacanciesData.results : vacanciesData;

//         results = await Promise.all(
//           vacancies.map(async (vacancy: any) => {
//             let userData: any = {
//               id: vacancy.client,
//               name: t("order.notSpecified"),
//               gender: null,
//               executor_rating: 0,
//               client_rating: 0,
//               work_experience: null,
//               created_at: "",
//               region: null,
//               phone: null,
//               email: null,
//               telegram_username: null,
//             };
//             try {
//               userData = await apiClient.getUserById(vacancy.client.toString());
//             } catch (err) {
//               // Silent catch
//             }

//             return {
//               id: vacancy.id,
//               name: vacancy.name || "",
//               description: vacancy.description || "",
//               category:
//                 typeof vacancy.category === "number"
//                   ? {
//                       id: vacancy.category,
//                       name: 
//                         categories.find((c) => c.id === vacancy.category)?.name ||
//                         t("order.notSpecified"),
//                     }
//                   : vacancy.category || { id: 0, name: t("order.notSpecified") },
//               sub_categories: Array.isArray(vacancy.sub_categories)
//                 ? vacancy.sub_categories.map((sub: any) =>
//                     typeof sub === "number"
//                       ? {
//                           id: sub,
//                           name:
//                             subcategories.find((s) => s.id === sub)?.name ||
//                             t("order.notSpecified"),
//                         }
//                       : { id: sub.id, name: sub.name }
//                   )
//                 : [],
//               price: Number(vacancy.price) || 0,
//               client: userData,
//               images: vacancy.images || [],
//               reviews: vacancy.reviews || [],
//               boosts: vacancy.boosts || [],
//             } as Vacancy;
//           })
//         );
//       }
//       setSearchResults(results);
//     } catch (err: unknown) {
//       setError(
//         err instanceof Error
//           ? `${t("errors.fetchError")}: ${err.message}`
//           : t("errors.fetchError")
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [searchQuery, filters, viewMode, apiClient, t, categories, subcategories]);

//   const debouncedFetchSearchResults = useCallback(
//     debounce(fetchSearchResults, 300),
//     [fetchSearchResults]
//   );

//   useEffect(() => {
//     debouncedFetchSearchResults();
//     return () => {
//       debouncedFetchSearchResults.cancel();
//     };
//   }, [debouncedFetchSearchResults]);

//   const handleSearch = useCallback(() => {
//     if (
//       !searchQuery.trim() &&
//       !filters.region &&
//       !filters.category &&
//       !filters.subcategory.size
//     ) {
//       setError(t("search.emptySearch"));
//       return;
//     }
//     setError(null);
//     debouncedFetchSearchResults();
//   }, [searchQuery, filters, t, debouncedFetchSearchResults]);

//   const handleFilterChange = useCallback(
//     (key: keyof FiltersType | "category" | "subcategory", value: string) => {
//       setFilters((prev) => {
//         const newFilters = {
//           price: new Set(prev.price),
//           hours: new Set(prev.hours),
//           experience: new Set(prev.experience),
//           category: prev.category,
//           subcategory: new Set(prev.subcategory),
//           region: prev.region,
//         };
//         if (key === "category") {
//           newFilters.category = value;
//           newFilters.subcategory.clear();
//         } else if (key === "subcategory") {
//           if (newFilters.subcategory.has(value)) {
//             newFilters.subcategory.delete(value);
//           } else {
//             newFilters.subcategory.add(value);
//           }
//         } else if (key === "region") {
//           newFilters.region = value;
//         } else {
//           if (newFilters[key].has(value)) {
//             newFilters[key].delete(value);
//           } else {
//             newFilters[key].add(value);
//           }
//         }
//         return newFilters;
//       });
//     },
//     []
//   );

//   const handleToggleView = useCallback((mode: "services" | "vacancies") => {
//     setViewMode(mode);
//   }, []);

//   const handleRetry = useCallback(() => {
//     setError(null);
//     debouncedFetchSearchResults();
//   }, [debouncedFetchSearchResults]);

//   const handleRegionSelect = useCallback(
//     (region: string) => {
//       setFilters((prev) => ({ ...prev, region }));
//     },
//     []
//   );

//   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

//   const handleCategorySelect = (categoryId: string) => {
//     handleFilterChange("category", categoryId);
//     setIsDropdownOpen(false);
//   };

//   const toggleFilters = () => setIsFiltersVisible((prev) => !prev);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768) {
//         setIsFiltersVisible(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <SearchPageWrapper>
//       {isLoading ? (
//         <LoadingContainer>
//           <LoadingSpinner />
//           {t("search.loading")}
//         </LoadingContainer>
//       ) : error ? (
//         <>
//           <ErrorMessage>{error}</ErrorMessage>
//           <RetryButton onClick={handleRetry}>{t("search.retry")}</RetryButton>
//         </>
//       ) : (
//         <>
//           <StyledToggleContainer>
//             <StyledToggleButton
//               active={viewMode === "services"}
//               onClick={() => handleToggleView("services")}
//               aria-pressed={viewMode === "services"}
//               aria-label={t("search.toggleServices")}
//             >
//               {t("search.services")}
//             </StyledToggleButton>
//             <StyledToggleButton
//               active={viewMode === "vacancies"}
//               onClick={() => handleToggleView("vacancies")}
//               aria-pressed={viewMode === "vacancies"}
//               aria-label={t("search.toggleVacancies")}
//             >
//               {t("search.vacancies")}
//             </StyledToggleButton>
//           </StyledToggleContainer>
//           {error && <ErrorMessage>{error}</ErrorMessage>}
//           <StyledResultsGrid>
//             <SidebarWrapper>
//               <Filters
//                 filters={filters}
//                 onFilterChange={handleFilterChange}
//                 categories={categories}
//                 subcategories={subcategories}
//                 isDropdownOpen={isDropdownOpen}
//                 toggleDropdown={toggleDropdown}
//                 handleCategorySelect={handleCategorySelect}
//               />
//             </SidebarWrapper>
//             <ResultsContainer>
//               <SearchHeader>
//                 <StyledSearchTitle>
//                   {t("search.resultsTitle", {
//                     query: searchQuery || t("search.noQuery"),
//                     region: filters.region
//                       ? t("search.inRegion", { region: filters.region })
//                       : "",
//                   })}
//                 </StyledSearchTitle>
//                 <SearchContainer>
//                   <SearchInput
//                     aria-label={t("SearchPage.ariaLabel")}
//                     placeholder={t("SearchPage.placeholder")}
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         handleSearch();
//                       }
//                     }}
//                   />
//                   <FilterToggleButton
//                     onClick={toggleFilters}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <FaFilter />
//                     {t("filters.toggle")}
//                   </FilterToggleButton>
//                 </SearchContainer>
//               </SearchHeader>
//               <AnimatePresence>
//                 <FiltersWrapper
//                   data-visible={isFiltersVisible}
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{
//                     opacity: isFiltersVisible ? 1 : 0,
//                     y: isFiltersVisible ? 0 : -10,
//                   }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <Filters
//                     filters={filters}
//                     onFilterChange={handleFilterChange}
//                     categories={categories}
//                     subcategories={subcategories}
//                     isDropdownOpen={isDropdownOpen}
//                     toggleDropdown={toggleDropdown}
//                     handleCategorySelect={handleCategorySelect}
//                   />
//                 </FiltersWrapper>
//               </AnimatePresence>
//               <Results results={searchResults} viewMode={viewMode} />
//             </ResultsContainer>
//           </StyledResultsGrid>
//         </>
//       )}
//     </SearchPageWrapper>
//   );
// };