
import React from "react";
import styled from "@emotion/styled";

const RequestContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 34px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  border-radius: 24px;
  transition: margin 0.3s ease, padding 0.3s ease;
  min-width: 320px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
    padding: clamp(15px, 2vw, 20px);
    margin: clamp(15px, 2vw, 20px) auto;
  }

  @media (max-width: 480px) {
    padding: clamp(10px, 1.5vw, 15px);
    margin: clamp(10px, 1.5vw, 15px) auto;
  }
`;

const RequestText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  text-align: left;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  padding: clamp(10px, 2vw, 15px);

  @media (max-width: 768px) {
    gap: 8px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const RequestTitle = styled.h3`
  font-family: "Font 1", sans-serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0;
  color: #292c32;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-top: -25px;
  margin-left: -12px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-top: -10px;
    right: 15px;
    margin-bottom: 6px;
    width: auto;
    height: auto;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 4px;
  }
`;

const RequestDescription = styled.p`
  font-family: "Font 1", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0;
  color: #292c32;
  width: 396px;
  height: 24px;
  display: flex;
  align-items: center;
  margin-top: 0px;
  margin-left: -12px;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    width: auto;
    height: auto;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    line-height: 1.3;
  }
`;

const StyledDescription = styled(RequestDescription)`
  height: 34px;
  padding: 5px 20px;
  border-radius: 8px;
  box-sizing: border-box;
  font-family: "Font 1", sans-serif;
  font-size: 15.25px;
  font-weight: 500;
  line-height: 23.2px;
  letter-spacing: 0;
  text-align: center;
  color: #676e7e;
  background-color: #f2f3f7;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  position: relative;

  @media (max-width: 768px) {
    width: 512px;
    height: auto;
    min-height: 24px;
    padding: 8px 16px;
    font-size: 14px;
    line-height: 1.5;
    white-space: normal;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 300px;
    font-size: 13px;
    padding: 6px 12px;
  }
`;

const RequestInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  max-width: 600px;
  height: 180px;
  position: relative;
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
    height: 160px;
  }

  @media (max-width: 480px) {
    height: 140px;
  }
`;

const RequestInput = styled.textarea`
  padding: 24px;
  width: 100%;
  height: 116.55px;
  border-radius: 8px;
  border: none;
  font-size: clamp(1rem, 2vw, 1.2rem);
  resize: none;
  overflow-y: auto;
  background: #f2f3f7;
  outline: none;
  position: relative;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px;
    height: 115.5px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 8px;
    height: 105px;
  }
`;

const CharacterCounter = styled.span<{ isMax: boolean }>`
  font-size: clamp(0.75rem, 1.5vw, 0.8rem);
  color: ${({ isMax }) => (isMax ? "#ff0000" : "#000")};
  position: absolute;
  bottom: 38%;
  right: 10px;
  transform-origin: bottom right;
  transform: scale(1);

  @media (max-width: 768px) {
    bottom: 38%;
    right: 8px;
    font-size: 0.65rem;
  }

  @media (max-width: 480px) {
    bottom: 55px;
    right: 12px;
    font-size: 0.6rem;
  }
`;

const RequestButton = styled.button`
  padding: 12px 20px;
  background: #3ea240;
  border: none;
  border-radius: 8px;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #fff;
  cursor: pointer;
  width: 100%;
  height: 46px;
  transition: background 0.3s ease;
  margin-top: 13px;

  &:hover {
    background: #218838;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px 15px;
    height: 40px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 8px 12px;
    height: 36px;
  }
`;

interface RequestFormProps {
  requestText: string;
  setRequestText: (text: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  t: (key: string) => string;
}

const RequestForm = ({ requestText, setRequestText, handleKeyDown, t }: RequestFormProps) => {
  return (
    <RequestContainer>
      <RequestText>
        <RequestTitle>{t("request.title")}</RequestTitle>
        <RequestDescription>{t("request.description")}</RequestDescription>
        <StyledDescription>{"5 " + t("specialists.description")}</StyledDescription>
      </RequestText>
      <RequestInputWrapper>
        <RequestInput
          aria-label={t("request.inputAriaLabel")}
          placeholder={t("request.inputPlaceholder")}
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={250}
        />
        <CharacterCounter isMax={requestText.length === 250}>
          {requestText.length}/250
        </CharacterCounter>
        <RequestButton>{t("request.button")}</RequestButton>
      </RequestInputWrapper>
    </RequestContainer>
  );
};

export default RequestForm;
