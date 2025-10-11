
import React from "react";
import styled from "@emotion/styled";

const CarouselContainer = styled.div`
  background: rgb(228, 228, 228);
  border-radius: 23px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto clamp(20px, 3vw, 30px);
  overflow: hidden;
  position: relative;
  aspect-ratio: 970 / 250;
  height: auto;
  transition: padding 0.3s ease;
`;

const SlideWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  aspect-ratio: 970 / 90;
`;

const CarouselText = styled.h2<{ isActive: boolean }>`
  font-size: clamp(1.4rem, 3.8vw, 1.8rem);
  font-weight: 300;
  color: #000;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const ReklamaSlide = styled.a<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  cursor: pointer;
`;

const ReklamaImage = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 24px;
`;

const ErrorMessage = styled.div`
  font-size: clamp(1.4rem, 3.8vw, 1.8rem);
  font-weight: 300;
  color: #000;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
`;

interface CarouselProps {
  slides: (string | { image: string; link: string })[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  errorTimerExpired: boolean;
  imageError: boolean;
  setImageError: (error: boolean) => void;
  t: (key: string) => string;
}

const Carousel = ({
  slides,
  currentSlide,
  setCurrentSlide,
  isPaused,
  setIsPaused,
  errorTimerExpired,
  imageError,
  setImageError,
  t,
}: CarouselProps) => {
  return (
    <CarouselContainer
      role="region"
      aria-label={t("carousel.ariaLabel")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <SlideWrapper>
        {typeof slides[currentSlide] === "string" || errorTimerExpired ? (
          <ErrorMessage>
            {errorTimerExpired ? t("errors.imageError") : (slides[currentSlide] as string)}
          </ErrorMessage>
        ) : (
          <ReklamaSlide
            isActive={true}
            href={(slides[currentSlide] as { image: string; link: string }).link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={false}
          >
            <ReklamaImage
              src={(slides[currentSlide] as { image: string; link: string }).image}
              alt={`Реклама ${currentSlide + 1}`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.jpg";
                setImageError(true);
              }}
            />
          </ReklamaSlide>
        )}
      </SlideWrapper>
    </CarouselContainer>
  );
};

export default Carousel;
