import React from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import {
  Category,
  SubCategory,
} from "../../components/types/apiTypes";
import { Filters as FiltersType } from "./types";

const FiltersContainer = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  margin-right: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const FilterCheckbox = styled.input`
  margin-right: 0.5rem;
`;

const FilterOption = styled.option`
  padding: 0.25rem;
`;

interface FiltersProps {
  filters: FiltersType;
  onFilterChange: (key: keyof FiltersType | "category" | "subcategory", value: string) => void;
  categories: Category[];
  subcategories: SubCategory[];
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  handleCategorySelect: (categoryId: string) => void;
}

export default function Filters({
  filters,
  onFilterChange,
  categories,
  subcategories,
  isDropdownOpen,
  toggleDropdown,
  handleCategorySelect,
}: FiltersProps) {
  const { t } = useTranslation();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleCategorySelect(e.target.value);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange("subcategory", e.target.value);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange("region", e.target.value);
  };

  return (
    <FiltersContainer>
      <FilterSection>
        <FilterLabel>{t("filters.category")}</FilterLabel>
        <FilterSelect value={filters.category} onChange={handleCategoryChange}>
          <FilterOption value="">{t("filters.selectCategory")}</FilterOption>
          {categories.map((category) => (
            <FilterOption key={category.id} value={category.id.toString()}>
              {category.name}
            </FilterOption>
          ))}
        </FilterSelect>
      </FilterSection>

      <FilterSection>
        <FilterLabel>{t("filters.subcategory")}</FilterLabel>
        {subcategories.map((subcategory) => (
          <div key={subcategory.id}>
            <FilterCheckbox
              type="checkbox"
              value={subcategory.id.toString()}
              checked={filters.subcategory.has(subcategory.id.toString())}
              onChange={handleSubcategoryChange}
            />
            <span>{subcategory.name}</span>
          </div>
        ))}
      </FilterSection>

      <FilterSection>
        <FilterLabel>{t("filters.region")}</FilterLabel>
        <FilterSelect value={filters.region || ""} onChange={handleRegionChange}>
          <FilterOption value="">{t("filters.selectRegion")}</FilterOption>
          <FilterOption value="Tashkent">{t("regions.tashkent")}</FilterOption>
          <FilterOption value="Samarkand">{t("regions.samarkand")}</FilterOption>
        </FilterSelect>
      </FilterSection>
    </FiltersContainer>
  );
}