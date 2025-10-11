import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  Boost,
  Category,
  ClientReview,
  ExecutorReview,
  OrderReview,
  Order,
  Payment,
  ServiceBoost,
  Service,
  SubCategory,
  User,
  Vacancy,
  VacancyBoost,
  OrderData,
  Reklama, // Make sure this is imported from apiTypes
} from "./apiTypes";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.myprofy.uz/api/";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

const withRetry = async <T>(
  fn: () => Promise<AxiosResponse<T>>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY_MS,
  attempt = 1
): Promise<AxiosResponse<T>> => {
  try {
    return await fn();
  } catch (error) {
    const err = error as AxiosError;
    if (attempt < retries && (!err.response || err.response.status >= 500)) {
      const nextDelay = delay * Math.pow(2, attempt - 1);
      console.warn(`⚠️ Attempt ${attempt} failed. Retrying in ${nextDelay}ms...`);
      await new Promise((res) => setTimeout(res, nextDelay));
      return withRetry(fn, retries, delay, attempt + 1);
    }
    throw err;
  }
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiClient = {
  getCategories: async (): Promise<Category[] | { results: Category[]; count: number }> =>
    (await withRetry(() => api.get("/categories/"))).data,

  getCategoryById: async (id: number): Promise<Category> =>
    (await withRetry(() => api.get(`/categories/${id}/`))).data,

  getSubcategories: async (params?: Record<string, any>): Promise<SubCategory[]> =>
    (await withRetry(() => api.get("/subcategories/", { params }))).data,

  getSubcategoryById: async (id: number): Promise<SubCategory> =>
    (await withRetry(() => api.get(`/subcategories/${id}/`))).data,

  getServices: async (page = 1, limit = 50, params?: Record<string, any>): Promise<any> =>
    (await withRetry(() => api.get("/services/", { params: { page, limit, ...params } }))).data,

  getServiceById: async (id: number): Promise<Service> =>
    (await withRetry(() => api.get(`/services/${id}/`))).data,

  getVacancies: async (page = 1, limit = 50, params?: Record<string, any>): Promise<any> =>
    (await withRetry(() => api.get("/vacancies/", { params: { page, limit, ...params } }))).data,

  getVacancyById: async (id: number): Promise<Vacancy> =>
    (await withRetry(() => api.get(`/vacancies/${id}/`))).data,

  getUsers: async (): Promise<User[]> =>
    (await withRetry(() => api.get("/users/"))).data,

  getUserById: async (id: string | number): Promise<User> =>
    (await withRetry(() => api.get(`/users/${id}/`))).data,

  getOrders: async (): Promise<Order[]> =>
    (await withRetry(() => api.get("/orders/"))).data,

  getOrderById: async (id: number): Promise<Order> =>
    (await withRetry(() => api.get(`/orders/${id}/`))).data,

  createOrder: async (data: OrderData): Promise<Order> =>
    (await api.post("/orders/", data)).data,

  getExecutorReviews: async (): Promise<ExecutorReview[]> =>
    (await withRetry(() => api.get("/executor-reviews/"))).data,

  getClientReviews: async (): Promise<ClientReview[]> =>
    (await withRetry(() => api.get("/client-reviews/"))).data,

  getClientReviewById: async (id: number): Promise<ClientReview> =>
    (await withRetry(() => api.get(`/client-reviews/${id}/`))).data,

  createClientReview: async (data: Omit<ClientReview, "id">): Promise<ClientReview> =>
    (await api.post("/client-reviews/", data)).data,

  getExecutorReviewById: async (id: number): Promise<ExecutorReview> =>
    (await withRetry(() => api.get(`/executor-reviews/${id}/`))).data,

  createExecutorReview: async (data: Omit<ExecutorReview, "id">): Promise<ExecutorReview> =>
    (await api.post("/executor-reviews/", data)).data,

  getOrderReviews: async (): Promise<OrderReview[]> =>
    (await withRetry(() => api.get("/order-reviews/"))).data,

  getOrderReviewById: async (id: number): Promise<OrderReview> =>
    (await withRetry(() => api.get(`/order-reviews/${id}/`))).data,

  createOrderReview: async (data: Omit<OrderReview, "id">): Promise<OrderReview> =>
    (await api.post("/order-reviews/", data)).data,

  getPayments: async (): Promise<Payment[]> =>
    (await withRetry(() => api.get("/payments/"))).data,

  getPaymentById: async (id: number): Promise<Payment> =>
    (await withRetry(() => api.get(`/payments/${id}/`))).data,

  createPayment: async (data: Omit<Payment, "id">): Promise<Payment> =>
    (await api.post("/payments/", data)).data,

  getBoosts: async (): Promise<Boost[]> =>
    (await withRetry(() => api.get("/boosts/"))).data,

  getBoostById: async (id: number): Promise<Boost> =>
    (await withRetry(() => api.get(`/boosts/${id}/`))).data,

  createBoost: async (data: Omit<Boost, "id">): Promise<Boost> =>
    (await api.post("/boosts/", data)).data,

  getServiceBoosts: async (): Promise<ServiceBoost[]> =>
    (await withRetry(() => api.get("/service-boosts/"))).data,

  getServiceBoostById: async (id: number): Promise<ServiceBoost> =>
    (await withRetry(() => api.get(`/service-boosts/${id}/`))).data,

  createServiceBoost: async (data: Omit<ServiceBoost, "id">): Promise<ServiceBoost> =>
    (await api.post("/service-boosts/", data)).data,

  getVacancyBoosts: async (): Promise<VacancyBoost[]> =>
    (await withRetry(() => api.get("/vacancy-boosts/"))).data,

  getVacancyBoostById: async (id: number): Promise<VacancyBoost> =>
    (await withRetry(() => api.get(`/vacancy-boosts/${id}/`))).data,

  createVacancyBoost: async (data: Omit<VacancyBoost, "id">): Promise<VacancyBoost> =>
    (await api.post("/vacancy-boosts/", data)).data,

  // Add the getReklamas method
  getReklamas: async (params?: Record<string, any>): Promise<Reklama[]> =>
    (await withRetry(() => api.get("/reklamas/", { params }))).data,

  getReklamaById: async (id: number): Promise<Reklama> =>
    (await withRetry(() => api.get(`/reklamas/${id}/`))).data,

  // Add authentication methods
  checkAuth: async (): Promise<User> =>
    (await withRetry(() => api.get("/auth/me/"))).data,

  login: async (credentials: { phone: string; password: string }): Promise<{ token: string; user: User }> =>
    (await api.post("/auth/login/", credentials)).data,

  logout: async (): Promise<void> =>
    (await api.post("/auth/logout/")).data,

  register: async (userData: Partial<User>): Promise<{ token: string; user: User }> =>
    (await api.post("/auth/register/", userData)).data,


};

export function getAPIClient() {
  return apiClient;
}

export default apiClient;