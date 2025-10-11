
import React from "react";
import styled from "@emotion/styled";

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 40px;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 13px 13px 13px 40px;
  width: 100%;
  border: none;
  border-radius: 13px;
  font-size: clamp(16px, 1.8vw, 18px);
  transition: padding 0.3s ease, width 0.3s ease, font-size 0.3s ease;

  @media (max-width: 768px) {
    padding-left: 40px;
  }

  @media (max-width: 480px) {
    padding-left: 35px;
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  fill: #333;

  @media (max-width: 768px) {
    left: 12px;
  }

  @media (max-width: 480px) {
    left: 10px;
    width: 18px;
    height: 18px;
  }
`;

const ModalButton = styled.button`
  background: #3ea23e;
  border: none;
  font-size: 0.98rem;
  font-weight: 400;
  color: #fff;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #2e8b57;
    color: #fff;
  }

  &:active {
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 0.833rem;
    padding: 14px;
  }
`;

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  t: (key: string) => string;
}

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, t }: SearchBarProps) => {
  return (
    <SearchContainer>
      <InputWrapper>
        <SearchIcon viewBox="0 0 24 24" aria-hidden="true">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.48359 10.0833C2.48359 5.88592 5.88623 2.48329 10.0836 2.48329C14.281 2.48329 17.6836 5.88592 17.6836 10.0833C17.6836 12.1741 16.8393 14.0678 15.473 15.4419C15.4676 15.4469 15.4623 15.4521 15.457 15.4573C15.4517 15.4626 15.4466 15.4679 15.4415 15.4733C14.0675 16.8392 12.1741 17.6833 10.0836 17.6833C5.88623 17.6833 2.48359 14.2807 2.48359 10.0833ZM15.9002 16.8198C14.3402 18.1679 12.3071 18.9833 10.0836 18.9833C5.16826 18.9833 1.18359 14.9986 1.18359 10.0833C1.18359 5.16795 5.16826 1.18329 10.0836 1.18329C14.9989 1.18329 18.9836 5.16795 18.9836 10.0833C18.9836 12.3072 18.1679 14.3405 16.8195 15.9006L20.0429 19.124C20.2967 19.3779 20.2967 19.7894 20.0429 20.0433C19.789 20.2971 19.3775 20.2971 19.1237 20.0433L15.9002 16.8198Z"
              fill="#A4A8B2"
            />
          </svg>
        </SearchIcon>
        <SearchInput
          aria-label={t("search.ariaLabel")}
          placeholder={t("search.placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
      </InputWrapper>
      <ModalButton onClick={handleSearch}>{t("search.search")}</ModalButton>
    </SearchContainer>
  );
};

export default SearchBar;
