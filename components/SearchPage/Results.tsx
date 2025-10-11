import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  ClientReview,
  ExecutorReview,
  normalizeUser,
  SearchResult,
  Service,
  User,
  Vacancy,
} from "../../components/types/apiTypes";
import {
  HoursContainer,
  IconWrapper,
  ModalContent,
  ModalDetail,
  ModalHeader,
  ModalOverlay,
  RegionContainer,
  ResponsiveActionButton,
  ResponsiveActionButtonLogin,
  ResultAvatar,
  ResultDetail,
  ResultHeaderContainer,
  ResultName,
  ResultPrice,
  ResultReview,
  ResultsList,
  Underline,
  UserImage,
  UserInfoContainer,
  UserName,
} from "./styles";
import apiClient, { checkAuth } from "../types/apiClient";

const FaArrowLeft = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaArrowLeft),
  { ssr: false }
);
const FaArrowRight = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaArrowRight),
  { ssr: false }
);
const FaClock = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaClock),
  { ssr: false }
);
const FaMapMarkerAlt = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaMapMarkerAlt),
  { ssr: false }
);

const ServiceAvatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Styled components for scrollable reviews
const ScrollableReviews = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 8px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const ImageContainer = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  cursor: pointer;
  position: relative;
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    order: 2;
    margin-left: auto;
  }
`;

// Animation variants for the image carousel modal
const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Styled components for ResultItem
export const ResultItem = styled(motion.div) <{
  boostType?: "Turbo" | "Top" | null;
}>`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 22px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  ${({ boostType }) =>
    boostType === "Turbo"
      ? `
          border: 2px solid rgb(62, 162, 62);
          box-shadow: 0 0 10px rgba(62, 162, 62, 0.7), 0 0 20px rgba(62, 162, 62, 0.5);
        `
      : boostType === "Top"
        ? `
          border: 2px solid rgba(62, 162, 62, 0.5);
          box-shadow: 0 0 8px rgba(62, 162, 62, 0.4), 0 0 15px rgba(62, 162, 62, 0.3);
        `
        : `
          border: 1px solid transparent;
          box-shadow: none;
        `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
`;

// Styled components for ResultContent
export const ResultContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media (max-width: 768px) {
    flex: 1;
    order: 1;
  }
`;

// Styled components for ResultDetail
export const StyledResultDetail = styled(ResultDetail)`
  text-align: left;
`;

// Image Carousel Modal Styles
const ImageCarouselOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ImageCarouselContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  z-index: 2010;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
  }
`;

const ResultRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;

  @media (max-width: 500px) {
    flex-direction: column-reverse;
  }
`;

const LeftCol = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  flex: 1 1 auto;
  min-width: 0;

  @media (max-width: 500px) {
    width: 100%;
    margin-top: 12px;
  }
`;

const RightCol = styled.div`
  flex: 0 0 300px;
  width: 300px;
  text-align: right;

  @media (max-width: 500px) {
    flex: 1 1 100%;
    width: 100%;
    text-align: left;
  }
`;

const LeftArrow = styled(ArrowButton)`
  left: 10px;
`;

const RightArrow = styled(ArrowButton)`
  right: 10px;
`;

const ReviewContainer = styled(motion.div)`
  margin-top: 8px;
  padding: 8px;
  background: rgba(245, 245, 245, 0.8);
  border-radius: 6px;
  border-left: 3px solid rgb(62, 162, 62);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ReviewTitle = styled(motion.h4)`
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const ReviewText = styled(motion.p)`
  font-size: 0.85rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.4;
`;

const ReviewMeta = styled(motion.p)`
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  font-style: italic;
`;

// Helper functions for fetching reviews
const getExecutorReviewsByExecutor = async (executorId: number): Promise<ExecutorReview[]> => {
  try {
    const response = await apiClient.getExecutorReviews();
    return response.filter((review: ExecutorReview) => {
      const reviewExecutorId = typeof review.executor === 'object' ? review.executor.id : review.executor;
      return reviewExecutorId === executorId;
    });
  } catch (error) {
    console.error('Error fetching executor reviews:', error);
    return [];
  }
};

const getClientReviewsByClient = async (clientId: number): Promise<ClientReview[]> => {
  try {
    const response = await apiClient.getClientReviews();
    return response.filter((review: ClientReview) => {
      const reviewClientId = typeof review.client === 'object' ? review.client.id : review.client;
      return reviewClientId === clientId;
    });
  } catch (error) {
    console.error('Error fetching client reviews:', error);
    return [];
  }
};

// Define interfaces
interface ResultDetailsProps {
  result: SearchResult;
  viewMode: "services" | "vacancies";
  index: number;
  onToggleDetails: (index: number) => void;
  onOpenOrderModal: (result: SearchResult, index: number) => void;
  onOpenImageModal: (images: string[], startIndex: number) => void;
  expanded: boolean;
  modalOpen: { [key: number]: boolean };
  imageUrls: string[];
  userRating: number | null;
  resultReviews: (ExecutorReview | ClientReview)[];
  error: string | null;
  closeModal: (index: number) => void;
  selectedResult: SearchResult | null;
  handleOrder: (result: SearchResult, index: number) => Promise<void>;
  avatarUrl: string | null;
}

interface ResultItemWithReviewsProps {
  result: SearchResult;
  viewMode: "services" | "vacancies";
  index: number;
  onToggleDetails: (index: number) => void;
  onOpenOrderModal: (result: SearchResult, index: number) => void;
  onOpenImageModal: (images: string[], startIndex: number) => void;
  expanded: boolean;
  modalOpen: { [key: number]: boolean };
  error: string | null;
  closeModal: (index: number) => void;
  selectedResult: SearchResult | null;
  handleOrder: (result: SearchResult, index: number) => Promise<void>;
}

interface ResultsProps {
  results: SearchResult[];
  viewMode: "services" | "vacancies";
}

const ResultDetails: React.FC<ResultDetailsProps> = ({
  result,
  viewMode,
  index,
  onToggleDetails,
  onOpenOrderModal,
  onOpenImageModal,
  expanded,
  modalOpen,
  imageUrls,
  userRating,
  resultReviews,
  error,
  closeModal,
  selectedResult,
  handleOrder,
  avatarUrl,
}) => {
  const { t } = useTranslation();

  const boostType = useMemo(() => {
    const currentTime = new Date();
    const activeBoost = result.boosts?.find(
      (boost) => boost.is_active && new Date(boost.end_date) > currentTime
    );
    const type = activeBoost?.boost_data?.boost_type as "Turbo" | "Top" | undefined;
    return type || null;
  }, [result.boosts]);

  const isService = viewMode === "services";
  const userField = isService
    ? (result as Service).executor
    : (result as Vacancy).client;

  const executorRating =
    userField && typeof userField === "object" && "executor_rating" in userField
      ? (userField as User).executor_rating ?? null
      : null;
  const clientRating =
    userField && typeof userField === "object" && "client_rating" in userField
      ? (userField as User).client_rating ?? null
      : null;

  const displayRating =
    userRating !== null
      ? userRating
      : viewMode === "services"
        ? executorRating
        : clientRating;

  const createdAt =
    userField && typeof userField === "object" && "created_at" in userField
      ? (userField as User).created_at
      : t("order.notSpecified");

  const region =
    userField && typeof userField === "object"
      ? userField.region || t("order.notSpecified")
      : t("order.notSpecified");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await checkAuth();
        const authenticated = !!response.user_id || !!response.name;
        setIsAuthenticated(authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkServerStatus();
  }, []);

  // Function to trigger RegisterModal
  const openRegisterModal = () => {
    const event = new Event("openRegisterModal");
    window.dispatchEvent(event);
  };

  return (
    <ResultItem
      key={index}
      onClick={() => onToggleDetails(index)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      boostType={boostType}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <ResultContent>
          <ResultHeaderContainer>
            <ResultName>{result.name}</ResultName>
            <ResultPrice>
              {t("order.price")}: {result.price} UZS
            </ResultPrice>
          </ResultHeaderContainer>
          <Underline />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <UserInfoContainer>
              {avatarUrl ? (
                <UserImage src={avatarUrl} alt={result.name} />
              ) : (
                <ResultAvatar />
              )}
              <UserName>
                {userField && typeof userField === "object"
                  ? userField.name || t("order.notSpecified")
                  : t("order.notSpecified")}
              </UserName>
            </UserInfoContainer>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <HoursContainer>
                <IconWrapper>
                  <FaClock />
                </IconWrapper>
                {createdAt && typeof createdAt === "string"
                  ? new Date(createdAt).toLocaleDateString()
                  : createdAt}
              </HoursContainer>
              <RegionContainer>
                <IconWrapper>
                  <FaMapMarkerAlt />
                </IconWrapper>
                {region}
              </RegionContainer>
            </div>
          </div>

          {expanded && (
            <div>
              <ResultRow>
                <LeftCol>
                  <div>
                    <StyledResultDetail>
                      {t("order.rating")}:{" "}
                      {typeof displayRating === "number"
                        ? `${displayRating.toFixed(1)}/5`
                        : t("order.notSpecified")}
                    </StyledResultDetail>

                    <StyledResultDetail>
                      {t("order.category")}:{" "}
                      {result.category && typeof result.category === "object"
                        ? result.category.name || t("order.notSpecified")
                        : t("order.notSpecified")}
                    </StyledResultDetail>

                    <StyledResultDetail>
                      {t("order.subcategories")}:{" "}
                      {(result.sub_categories ?? [])
                        .map((sub) =>
                          typeof sub === "object"
                            ? sub.name || t("order.notSpecified")
                            : t("order.notSpecified")
                        )
                        .join(", ") || t("order.notSpecified")}
                    </StyledResultDetail>

                    <StyledResultDetail>
                      {t("order.gender")}:{" "}
                      {userField && typeof userField === "object"
                        ? userField.gender || t("order.notSpecified")
                        : t("order.notSpecified")}
                    </StyledResultDetail>

                    <StyledResultDetail>
                      {t("order.workExperience")}:{" "}
                      {userField && typeof userField === "object"
                        ? userField.work_experience
                          ? `${userField.work_experience} ${t("order.years")}`
                          : t("order.notSpecified")
                        : t("order.notSpecified")}
                    </StyledResultDetail>

                    <StyledResultDetail>
                      {t("order.region")}: {region}
                    </StyledResultDetail>

                    <ResultReview>
                      "{result.description || t("order.noDescription")}"
                    </ResultReview>

                    <ScrollableReviews>
                      {resultReviews.length > 0 ? (
                        resultReviews.map((review, idx) => (
                          <ReviewContainer key={idx}>
                            <ReviewTitle>{t("order.review")}</ReviewTitle>
                            <ReviewText>
                              <strong>{t("order.rating")}:</strong>{" "}
                              {review.rating}/5
                            </ReviewText>
                            <ReviewText>
                              <strong>{t("order.comment")}:</strong>{" "}
                              {review.review || t("order.noComment")}
                            </ReviewText>
                            <ReviewMeta>
                              {t("order.reviewDate")}:{" "}
                              {new Date(review.created_at).toLocaleDateString()}
                            </ReviewMeta>
                          </ReviewContainer>
                        ))
                      ) : (
                        <StyledResultDetail>
                          {t("order.noReviews")}
                        </StyledResultDetail>
                      )}
                    </ScrollableReviews>
                  </div>
                </LeftCol>

                <RightCol>
                  {imageUrls.length > 0 ? (
                    <ImageContainer
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenImageModal(imageUrls, 0);
                      }}
                    >
                      <motion.img
                        src={imageUrls[0]}
                        alt="Result Image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </ImageContainer>
                  ) : (
                    <ImageContainer>
                      <ServiceAvatar />
                    </ImageContainer>
                  )}
                </RightCol>
              </ResultRow>

              <ResponsiveActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenOrderModal(result, index);
                }}
              >
                {viewMode === "services"
                  ? t("order.order")
                  : t("order.respond")}
              </ResponsiveActionButton>
            </div>
          )}
        </ResultContent>
      </div>
      {modalOpen[index] &&
        createPortal(
          <ModalOverlay>
            <ModalContent>
              {error ? (
                <>
                  <ModalHeader>{t("order.errorTitle")}</ModalHeader>
                  <ModalDetail>{error}</ModalDetail>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <ResponsiveActionButton
                      className="danger"
                      onClick={() => closeModal(index)}
                    >
                      {t("order.close")}
                    </ResponsiveActionButton>
                    {!isAuthenticated && (
                      <ResponsiveActionButtonLogin
                        onClick={() => {
                          openRegisterModal();
                          closeModal(index);
                        }}
                      >
                        {t("header.login")}
                      </ResponsiveActionButtonLogin>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <ModalHeader>
                    {viewMode === "services"
                      ? t("order.modalTitle")
                      : t("order.respondModalTitle")}
                  </ModalHeader>
                  <ModalDetail>
                    {viewMode === "services"
                      ? t("order.executor")
                      : t("order.client")}
                    :{" "}
                    {selectedResult &&
                      ("executor" in selectedResult || "client" in selectedResult)
                      ? (
                        ("executor" in selectedResult
                          ? (selectedResult as Service).executor
                          : (selectedResult as Vacancy).client) as User
                      )?.name || t("order.notSpecified")
                      : t("order.notSpecified")}
                  </ModalDetail>
                  <ModalDetail>
                    {t("order.phone")}:{" "}
                    {selectedResult &&
                      ("executor" in selectedResult || "client" in selectedResult)
                      ? (
                        ("executor" in selectedResult
                          ? (selectedResult as Service).executor
                          : (selectedResult as Vacancy).client) as User
                      )?.phone || t("order.notSpecified")
                      : t("order.notSpecified")}
                  </ModalDetail>
                  <ModalDetail>
                    {t("order.email")}:{" "}
                    {selectedResult &&
                      ("executor" in selectedResult || "client" in selectedResult)
                      ? (
                        ("executor" in selectedResult
                          ? (selectedResult as Service).executor
                          : (selectedResult as Vacancy).client) as User
                      )?.email || t("order.notSpecified")
                      : t("order.notSpecified")}
                  </ModalDetail>
                  <ModalDetail>
                    {t("order.telegram")}:{" "}
                    {selectedResult &&
                      ("executor" in selectedResult || "client" in selectedResult)
                      ? (
                        ("executor" in selectedResult
                          ? (selectedResult as Service).executor
                          : (selectedResult as Vacancy).client) as User
                      )?.telegram_username || t("order.notSpecified")
                      : t("order.notSpecified")}
                  </ModalDetail>
                  <ResponsiveActionButton
                    onClick={() => handleOrder(result, index)}
                  >
                    {viewMode === "services"
                      ? t("order.confirmButton")
                      : t("order.confirmRespondButton")}
                  </ResponsiveActionButton>
                  <ResponsiveActionButton
                    className="danger"
                    onClick={() => closeModal(index)}
                  >
                    {t("order.cancelButton")}
                  </ResponsiveActionButton>
                </>
              )}
            </ModalContent>
          </ModalOverlay>,
          document.body
        )}
    </ResultItem>
  );
};

const ResultItemWithReviews: React.FC<ResultItemWithReviewsProps> = ({
  result,
  viewMode,
  index,
  onToggleDetails,
  onOpenOrderModal,
  onOpenImageModal,
  expanded,
  modalOpen,
  error,
  closeModal,
  selectedResult,
  handleOrder,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const [resultReviews, setResultReviews] = useState<
    (ExecutorReview | ClientReview)[]
  >([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const getUserId = (field: number | User | null | undefined): number | null => {
    if (field == null) return null;
    if (typeof field === "number") return field;
    const id = (field as User).id;
    return typeof id === "number" ? id : null;
  };

  const userField =
    viewMode === "services"
      ? (result as Service).executor
      : (result as Vacancy).client;
  const userId = getUserId(userField);

  const fetchReviewsForUser = useCallback(
    async (
      userId: number
    ): Promise<{ rating: number | null; reviews: (ExecutorReview | ClientReview)[] }> => {
      if (!userId || typeof userId !== "number") {
        return { rating: null, reviews: [] };
      }

      try {
        let reviews: (ExecutorReview | ClientReview)[] = [];

        if (viewMode === "services") {
          reviews = await getExecutorReviewsByExecutor(userId);
        } else if (viewMode === "vacancies") {
          reviews = await getClientReviewsByClient(userId);
        }

        const validRatings = reviews
          .map((r) => (typeof r.rating === "number" ? r.rating : null))
          .filter((r): r is number => r !== null);

        const totalRating = validRatings.reduce((sum, r) => sum + r, 0);
        const averageRating =
          validRatings.length > 0 ? totalRating / validRatings.length : null;

        return { rating: averageRating, reviews };
      } catch (err: any) {
        console.error(`Failed to fetch reviews for user ${userId}:`, err?.message || err);
        return { rating: null, reviews: [] };
      }
    },
    [viewMode]
  );

  useEffect(() => {
    let mounted = true;
    if (hasFetched.current || typeof userId !== "number") {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const { rating, reviews } = await fetchReviewsForUser(userId);

      let fetchedAvatarUrl: string | null = null;
      if (
        typeof userField === "object" &&
        userField !== null &&
        "avatar" in userField
      ) {
        fetchedAvatarUrl = (userField as User).avatar || null;
      } else if (typeof userId === "number") {
        try {
          const user = await apiClient.getUserById(userId.toString());
          fetchedAvatarUrl = user.avatar || null;
        } catch (err) {
          console.error(`Failed to fetch user ${userId} avatar:`, err);
        }
      }

      if (mounted) {
        setRating(rating);
        setResultReviews(reviews);
        setAvatarUrl(fetchedAvatarUrl);
        setIsLoading(false);
        hasFetched.current = true;
      }
    };
    fetchData();

    return () => {
      mounted = false;
    };
  }, [userId, fetchReviewsForUser, userField]);

  if (isLoading) {
    return (
      <ResultItem>
        <ResultContent>{t("order.loading")}</ResultContent>
      </ResultItem>
    );
  }

  return (
    <ResultDetails
      result={result}
      viewMode={viewMode}
      index={index}
      onToggleDetails={onToggleDetails}
      onOpenOrderModal={onOpenOrderModal}
      onOpenImageModal={onOpenImageModal}
      expanded={expanded}
      modalOpen={modalOpen}
      imageUrls={result.images?.map((img) => img.image) || []}
      userRating={rating}
      resultReviews={resultReviews}
      error={error}
      closeModal={closeModal}
      selectedResult={selectedResult}
      handleOrder={handleOrder}
      avatarUrl={avatarUrl}
    />
  );
};

export default function Results({ results, viewMode }: ResultsProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [modalOpen, setModalOpen] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleDetails = (index: number) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const openOrderModal = (result: SearchResult, index: number) => {
    setSelectedResult(result);
    setModalOpen((prev) => ({ ...prev, [index]: true }));
  };

  const openImageModal = (images: string[], startIndex: number) => {
    setCurrentImages(images);
    setCurrentImageIndex(startIndex);
    setIsImageModalOpen(true);
  };

  const handleOrder = async (result: SearchResult, index: number) => {
    try {
      const auth = await apiClient.checkAuth();
      if (!auth.user_id) {
        setError(t("order.errorNotAuthenticated"));
        setModalOpen((prev) => ({ ...prev, [index]: true }));
        return;
      }

      if (typeof result.id !== "number") {
        setError(t("order.invalidId"));
        setModalOpen((prev) => ({ ...prev, [index]: true }));
        return;
      }

      const normalizedExecutor = normalizeUser((result as Service).executor, t);
      const normalizedClient = normalizeUser((result as Vacancy).client, t);
      const price = Number(result.price);
      if (isNaN(price)) {
        setError(t("order.invalidPrice"));
        setModalOpen((prev) => ({ ...prev, [index]: true }));
        return;
      }

      const orderData =
        viewMode === "services"
          ? {
            service: result.id,
            client: auth.user_id,
            executor: normalizedExecutor.id,
            amount: 1,
            price,
            status: "Awaiting",
          }
          : {
            vacancy: result.id,
            client: normalizedClient.id,
            executor: auth.user_id,
            amount: 1,
            price,
            status: "Awaiting",
          };

      if (viewMode === "services" && normalizedExecutor.id === auth.user_id) {
        setError(t("order.errorOwnService"));
        setModalOpen((prev) => ({ ...prev, [index]: true }));
        return;
      } else if (viewMode === "vacancies" && normalizedClient.id === auth.user_id) {
        setError(t("order.errorOwnVacancy"));
        setModalOpen((prev) => ({ ...prev, [index]: true }));
        return;
      }

      console.log("Sending orderData:", orderData);
      await apiClient.createOrder(orderData);
      setError(null);
      closeModal(index);
    } catch (err: any) {
      console.error("Order creation failed:", err.response?.data, err.message);
      setError(
        t("order.error") + `: ${err.response?.data?.message || err.message || t("order.unknownError")}`
      );
      setModalOpen((prev) => ({ ...prev, [index]: true }));
    }
  };

  const closeModal = (index: number) => {
    setModalOpen((prev) => ({ ...prev, [index]: false }));
    setSelectedResult(null);
    setError(null);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentImageIndex < currentImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <ResultsList>
        {results.map((result, index) => (
          <ResultItemWithReviews
            key={result.id}
            result={result}
            viewMode={viewMode}
            index={index}
            onToggleDetails={toggleDetails}
            onOpenOrderModal={openOrderModal}
            onOpenImageModal={openImageModal}
            expanded={!!expanded[index]}
            modalOpen={modalOpen}
            error={error}
            closeModal={closeModal}
            selectedResult={selectedResult}
            handleOrder={handleOrder}
          />
        ))}
      </ResultsList>

      <AnimatePresence>
        {isImageModalOpen && (
          <ImageCarouselOverlay
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onClick={() => setIsImageModalOpen(false)}
          >
            <ImageCarouselContainer
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <LeftArrow
                onClick={() =>
                  setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentImageIndex === 0}
              >
                <FaArrowLeft />
              </LeftArrow>
              <CarouselImage
                src={currentImages[currentImageIndex]}
                alt={`${t("order.image")} ${currentImageIndex + 1}`}
              />
              <RightArrow
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    Math.min(prev + 1, currentImages.length - 1)
                  )
                }
                disabled={currentImageIndex === currentImages.length - 1}
              >
                <FaArrowRight />
              </RightArrow>
            </ImageCarouselContainer>
          </ImageCarouselOverlay>
        )}
      </AnimatePresence>
    </>
  );
}