import { TFunction } from "i18next";

export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface User extends BaseEntity {
  name: string;
  gender?: string | null;
  executor_rating?: number;
  client_rating?: number;
  work_experience?: string | null;
  region?: string | null;
  phone?: string | null;
  email?: string | null;
  telegram_username?: string | null;
  avatar?: string | null;
}

export const normalizeUser = (entity: number | User | null | undefined, t: TFunction): User => {
  if (!entity || typeof entity === "number") {
    return {
      id: typeof entity === "number" ? entity : 0,
      name: t("order.notSpecified"),
      region: null,
      executor_rating: 0,
      client_rating: 0,
      gender: null,
      work_experience: null,
      phone: null,
      email: null,
      telegram_username: null,
      avatar: null,
    };
  }

  return {
    id: entity.id ?? 0,
    name: entity.name ?? t("order.notSpecified"),
    gender: entity.gender ?? null,
    executor_rating: entity.executor_rating ?? 0,
    client_rating: entity.client_rating ?? 0,
    work_experience: entity.work_experience ?? null,
    created_at: entity.created_at ?? "",
    region: entity.region ?? null,
    phone: entity.phone ?? null,
    email: entity.email ?? null,
    telegram_username: entity.telegram_username ?? null,
    avatar: entity.avatar ?? null,
  };
};

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
  id?: number;
  rating: number;
  review?: string;
  created_at: string;
  reviewer?: User;
  executor: number | User;
  vacancy: number | Vacancy;
  order: number | Order;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    link?: string;
    expires_at?: string;
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

export interface Vacancy extends BaseEntity {
  id?: number;
  title?: string;
  price: number;
  description?: string;
  category: number | Category;
  sub_categories?: (number | SubCategory)[];
  client: number | User;
  images?: Image[];
  boosts?: Boost[];
  reviews?: Review[];
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
  role: "client" | "executor";
  region: string;
  gender: "male" | "female"; 
  telegram_id?: number; 
  telegram_username: string; 
  confirm_password?: string; 
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

