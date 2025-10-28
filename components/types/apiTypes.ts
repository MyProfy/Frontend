import { TFunction } from "i18next";

export type Region =
  | "Город Ташкент"
  | "Ташкентская область"
  | "Андижанская область"
  | "Бухарская область"
  | "Ферганская область"
  | "Джизакская область"
  | "Наманганская область"
  | "Навоийская область"
  | "Кашкадарьинская область"
  | "Самаркандская область"
  | "Сырдарьинская область"
  | "Сурхандарьинская область"
  | "Хорезмская область"
  | "Республика Каракалпакстан";

export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

  export interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
  region: string;
  email: string;
  about_user?: string;
  executor_rating?: number;
  work_experience?: number;
  client_rating?: number;
  telegram_username?: string;
  telegram_id?: number;
  gender?: "male" | "female" | string;
  avatar?: string;
  birthday?: string;
  lang?: "ru" | "uz" | "en";
  created_at?: string;
  orders_count?: number;
  is_trusted?: boolean;
  is_active?: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  display_ru?: string;
  display_uz?: string;
  service_count?: number;
}

export interface SubCategory extends BaseEntity {
  name: string;
  display_ru?: string;
  display_uz?: string;
  category: number | Category;
}

export interface Reklama extends BaseEntity {
  image: string;
  link: string;
  start_date: string;
  end_date: string;
}

export interface Boost extends BaseEntity {
  is_active: boolean;
  end_date: string;
  boost_data: {
    boost_type: "Turbo" | "Top";
  };
}

export interface Image extends BaseEntity {
  image: string;
}

export interface ExecutorReview extends BaseEntity {
  id: number;
  created_at: string;
  rating: number;
  review: string;
  order: number;
  vacancy: number;
  executor: number;
  client: number;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    link?: string;
    expires_at?: string;
    telegram_id?: number;  
  };
}

export interface ClientReview extends BaseEntity {
  rating: number;
  review?: string;
  created_at: string;
  reviewer?: User;
  client: number | User;
}

export interface OrderReview extends BaseEntity {
  rating: number;
  comment?: string;
  created_at: string;
  order: number | Order;
  reviewer?: User;
}

export type Review = ExecutorReview | ClientReview | OrderReview;

export interface Order extends BaseEntity {
  client: number | User;
  executor: number | User;
  service?: number | Service;
  vacancy?: number | Vacancy;
  amount: number;
  price: number;
  status: "Awaiting" | "InProgress" | "Completed" | "Cancelled";
}

export interface Payment extends BaseEntity {
  order: number | Order;
  amount: number;
  method: "Card" | "Cash" | "Transfer";
  status: "Pending" | "Completed" | "Failed";
}

export interface Service extends BaseEntity {
  name: string;
  price: number;
  description?: string;
  category: number | Category;
  sub_categories?: (number | SubCategory)[];
  executor: number | User;
  images?: Image[];
  boosts?: Boost[];
  reviews?: Review[];
}

export interface VacancyImage {
  url: string;
  id?: number;
}

export interface Vacancy {
  id: number;
  title: string;
  price: number;
  description: string;
  category: number;
  sub_category: number;
  client: number;
  images?: (VacancyImage | string)[];
  moderation: 'pending' | 'approved' | 'rejected';
  moderation_display: string;
  boost: number;
}

export interface PaginatedReviewsResponse {
  results: ExecutorReview[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export interface OrderData {
  client: number;
  executor: number;
  service?: number;
  vacancy?: number;
  amount: number;
  price: number;
  status: "Awaiting" | "InProgress" | "Completed" | "Cancelled";
}

export interface ServiceBoost extends BaseEntity {
  service: number | Service;
  boost: number | Boost;
}

export interface VacancyBoost extends BaseEntity {
  vacancy: number | Vacancy;
  boost: number | Boost;
}

export interface SchemaInfo {
  name: string;
  version: string;
  description?: string;
  endpoints: string[];
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface OTPRequestResponse {
  message: string;
  data?: {
    link?: string;
    expires_at?: string;
  };
}

export interface RegisterPayload {
  phone: string;
  password: string;
  name: string;
  role: "клиент"; 
  region: Region;
  gender: string;  
}



export interface OTPRequestPayload {
  phone: string;
}

export interface OTPVerifyPayload {
  phone: string;
  code: string;
}

export type SearchResult = Service | Vacancy;

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: number;
  error?: string;
}