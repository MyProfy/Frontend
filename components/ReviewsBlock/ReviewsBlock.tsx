"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { FaStar } from "react-icons/fa";
import { getAPIClient } from ".././types/apiClient";

interface Review {
  id: number;
  text?: string;
  comment: string;
  date: string;
  reviewer: string;
  rating: number;
  tasksCompleted?: number;
  image: string;
  cost?: string;
  serviceName?: string;
  jobName?: string;
  paymentMethod?: "cash" | "transfer";
}

interface ExecutorReview {
  id: number;
  created_at: string;
  rating: number;
  review: string;
  order: number;
  vacancy: number;
  executor: number;
  client: number;
}

interface CustomStyles {
  container?: React.CSSProperties;
  title?: React.CSSProperties;
  card?: React.CSSProperties;
  details?: React.CSSProperties;
  text?: React.CSSProperties;
  comment?: React.CSSProperties;
  date?: React.CSSProperties;
  rating?: React.CSSProperties;
  reviewerName?: React.CSSProperties;
  ratingStars?: React.CSSProperties;
  tasksCompleted?: React.CSSProperties;
  image?: React.CSSProperties;
  cost?: React.CSSProperties;
  serviceName?: React.CSSProperties;
  jobName?: React.CSSProperties;
}

const ReviewsContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 20px auto;
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 320px;
  box-sizing: border-box;
`;

const ReviewsTitle = styled.h2`
  font-family: "Font 1", sans-serif;
  font-weight: 600;
  font-size: 30px;
  line-height: 32px;
  color: #1a202c;
  margin: 24px 0 24px 24px;
  padding: 0;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ReviewsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  gap: 20px;
  padding: 0 10px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ReviewCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e3e3e3;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ReviewerInfoContainer = styled.div`
  background: #f2f3f7;
  padding: 12px;
  border-radius: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

const ReviewerImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
`;

const ReviewerName = styled.span`
  font-size: clamp(0.77rem, 1.65vw, 0.88rem);
  color: #1a202c;
  font-weight: 700;
  line-height: 1.2;
`;

const ReviewerNameJob = styled.span`
  font-size: clamp(0.77rem, 1.65vw, 0.88rem);
  color: #718096;
  font-weight: 300;
  padding-left: 8px;
`;

const ReviewerNameAndJobContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ReviewComment = styled.p`
  font-size: clamp(1.05rem, 1.32vw, 0.77rem);
  color: #4a5568;
  margin: 5px 0;
  font-weight: 400;
  line-height: 1.5;
`;

const ReviewDate = styled.p`
  font-size: clamp(0.55rem, 1.21vw, 0.737rem);
  color: #a0aec0;
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-style: italic;
`;

const ReviewCost = styled.span`
  font-size: clamp(0.55rem, 1.21vw, 0.77rem);
  color: #2d3748;
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const ReviewServiceName = styled.h3`
  font-family: "Font 1", sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #718096;
  margin-bottom: 5px;
`;

const ServiceRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #f7fafc;
  padding: 2px 8px;
  border-radius: 8px;
`;

const renderStars = (rating: number) => (
  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
    {Array.from({ length: 5 }).map((_, index) => (
      <FaStar key={index} color={index < Math.floor(rating) ? "#48bb78" : "#e2e8f0"} size={12} />
    ))}
    <span style={{ fontSize: "0.7rem", fontWeight: 500, marginLeft: "4px", color: "#2d3748" }}>
      {rating.toFixed(1)}
    </span>
  </div>
);

const ReviewsBlock: React.FC<{ reviews?: Review[]; customStyles?: CustomStyles }> = ({
  reviews: propReviews,
  customStyles = {},
}) => {
  const { t } = useTranslation();
  const apiClient = getAPIClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await apiClient.getExecutorReviews();

        const formattedReviews = reviewsData.map((review) => {
          const executorId =
            typeof review.executor === "object"
              ? review.executor?.id ?? 0
              : review.executor ?? 0;

          return {
            id: review.id ?? 0,
            comment: review.review || "Без комментария",
            date: new Date(review.created_at).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            reviewer: `User_${executorId}`,
            rating: review.rating ?? 0,
            image: `https://via.placeholder.com/44?text=U${executorId}`,
          };
        });

        console.log("Отзывы успешно загружены:", formattedReviews);
      } catch (error) {
        console.error("Ошибка при загрузке отзывов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);


  if (loading) return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "20px", color: "#e53e3e" }}>{error}</div>;

  const reviewsData = propReviews && propReviews.length > 0 ? propReviews : reviews;

  return (
    <ReviewsContainer style={customStyles.container}>
      <ReviewsTitle style={customStyles.title}>
        {t("reviews.title") || "Отзывы клиентов"}
      </ReviewsTitle>
      <ReviewsWrapper>
        {reviewsData.map((review) => (
          <ReviewCard key={review.id} style={customStyles.card}>
            <ReviewerInfoContainer>
              <ReviewerImage src={review.image} alt={review.reviewer} />
              <ReviewerNameAndJobContainer>
                <ReviewerName>{review.reviewer}</ReviewerName>
                {review.jobName && <ReviewerNameJob>{review.jobName}</ReviewerNameJob>}
              </ReviewerNameAndJobContainer>
            </ReviewerInfoContainer>

            {review.cost && <ReviewCost>{review.cost}</ReviewCost>}
            {review.serviceName && <ReviewServiceName>{review.serviceName}</ReviewServiceName>}

            <ServiceRating>{renderStars(review.rating)}</ServiceRating>
            <ReviewComment>{review.comment}</ReviewComment>
            <ReviewDate>{review.date}</ReviewDate>
          </ReviewCard>
        ))}
      </ReviewsWrapper>
    </ReviewsContainer>
  );
};

export default ReviewsBlock;
