"use client";

import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
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
  executor: number | { id: number };
  client: number;
}

interface CustomStyles {
  container?: React.CSSProperties;
  title?: React.CSSProperties;
  card?: React.CSSProperties;
}

interface ReviewsBlockProps {
  reviews?: Review[];
  customStyles?: CustomStyles;
}

const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        color={index < Math.floor(rating) ? "#48bb78" : "#e2e8f0"}
        size={12}
      />
    ))}
    <span className="text-[0.7rem] font-medium ml-1 text-[#2d3748]">
      {rating.toFixed(1)}
    </span>
  </div>
));
StarRating.displayName = "StarRating";

  const ReviewCard = memo(({ review, customStyles }: { review: Review; customStyles: CustomStyles }) => (
  <div
    className="bg-white rounded-[18px] p-4 flex flex-col items-start gap-2.5 w-full max-w-[400px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#e3e3e3] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] relative"
    style={customStyles.card}
  >
    <div className="bg-[#f2f3f7] p-3 rounded-xl w-full flex items-center gap-3 mb-2.5">
      <img
        src={review.image}
        alt={review.reviewer}
        className="w-11 h-11 rounded-full object-cover border-2 border-white"
        loading="lazy"
      />
      <div className="flex flex-col items-start">
        <span className="text-[clamp(0.77rem,1.65vw,0.88rem)] text-[#1a202c] font-bold leading-tight">
          {review.reviewer}
        </span>
        {review.jobName && (
          <span className="text-[clamp(0.77rem,1.65vw,0.88rem)] text-[#718096] font-light pl-2">
            {review.jobName}
          </span>
        )}
      </div>
    </div>

    {review.cost && (
      <span className="text-[clamp(0.55rem,1.21vw,0.77rem)] text-[#2d3748] block mb-1 font-medium">
        {review.cost}
      </span>
    )}

    {review.serviceName && (
      <h3 className="font-normal text-sm text-[#718096] mb-1">
        {review.serviceName}
      </h3>
    )}

    <p className="text-[clamp(1.05rem,1.32vw,0.77rem)] text-[#4a5568] my-1 font-normal leading-relaxed flex-grow">
      {review.comment}
    </p>

    <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#f0f0f0]">
      <div className="flex items-center gap-1 bg-[#f7fafc] py-0.5 px-2 rounded-lg">
        <StarRating rating={review.rating} />
      </div>
      <p className="text-[clamp(0.55rem,1.21vw,0.737rem)] text-[#a0aec0] italic">
        {review.date}
      </p>
    </div>
  </div>
));
ReviewCard.displayName = "ReviewCard";

const ReviewsBlock: React.FC<ReviewsBlockProps> = ({
  reviews: propReviews,
  customStyles = {},
}) => {
  const { t } = useTranslation();
  const apiClient = useMemo(() => getAPIClient(), []);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatReviews = useCallback((reviewsData: ExecutorReview[]): Review[] => {
    return reviewsData.map((review) => {
      const executorId = typeof review.executor === "object"
        ? review.executor?.id ?? 0
        : review.executor ?? 0;

      return {
        id: review.id ?? 0,
        comment: review.review || t("reviews.noComment") || "Без комментария",
        date: new Date(review.created_at).toLocaleDateString(
          t("reviews.locale") || "ru-RU",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        ),
        reviewer: `${t("reviews.user") || "User"}_${executorId}`,
        rating: review.rating ?? 0,
        image: `https://via.placeholder.com/44?text=U${executorId}`,
      };
    });
  }, [t]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await apiClient.getExecuterReviews();

        if (!Array.isArray(reviewsData)) {
          console.warn("⚠️ reviewsData не является массивом:", reviewsData);
          setReviews([]);
          return;
        }

        const formattedReviews = formatReviews(reviewsData);
        setReviews(formattedReviews);
        console.log(t("reviews.loadedSuccessfully"), formattedReviews);
      } catch (error) {
        console.error(t("reviews.loadError"), error);
        setError(t("reviews.errorMessage") || "Ошибка при загрузке отзывов");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [apiClient, formatReviews, t]);

  const reviewsData = useMemo(() =>
    propReviews && propReviews.length > 0 ? propReviews : reviews,
    [propReviews, reviews]
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        {t("reviews.loading") || "Loading..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-[#e53e3e]">
        {error}
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[1400px] my-5 p-5 bg-white rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 min-w-[320px] box-border"
      style={customStyles.container}
    >
      <h2
        className="font-semibold text-3xl leading-8 text-[#1a202c] my-6 mx-6 p-0 text-left uppercase tracking-wider"
        style={customStyles.title}
      >
        {t("reviews.title") || "Отзывы клиентов"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5 px-2.5 max-md:gap-4">
        {reviewsData.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            customStyles={customStyles}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ReviewsBlock);
