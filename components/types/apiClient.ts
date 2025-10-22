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
  Reklama,
  RegisterPayload,
  OTPVerifyResponse,
  LoginPayload,
} from "./apiTypes";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.myprofy.uz/api";

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
    if (attempt < retries && (!err.response || (err.response.status >= 500 && err.response.status !== 401 && err.response.status !== 403))) {
      const nextDelay = delay * Math.pow(2, attempt - 1);
      console.warn(`Attempt ${attempt} failed. Retrying in ${nextDelay}ms...`);
      await new Promise((res) => setTimeout(res, nextDelay));
      return withRetry(fn, retries, delay, attempt + 1);
    }
    throw err;
  }
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached to request:", config.url);
    } else {
      console.warn("No token found for request:", config.url);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = typeof window !== "undefined"
            ? localStorage.getItem("refresh_token")
            : null;

          if (refreshToken) {
            console.log("Refreshing token...");
            const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
              refresh: refreshToken
            });

            const newAccessToken = response.data.access;

            if (typeof window !== "undefined") {
              localStorage.setItem("access_token", newAccessToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      if (error.response.status === 403) {
        console.error(" 403 Forbidden - недостаточно прав или токен невалидный");
      }
    } else if (error.request) {
      console.error(" API No Response:", error.request);
      console.error(" Возможные причины:");
      console.error("   - CORS не настроен на бэкенде");
      console.error("   - Сервер не доступен");
      console.error("   - Неправильный URL:", API_BASE_URL);
    } else {
      console.error(" API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  login: async (credentials: LoginPayload): Promise<{ token: string; user: User }> => {
    try {
      console.log("🔐 Logging in:", credentials.phone);
      const response = await api.post("/auth/login/", credentials);
      console.log("✅ Login response:", response.data);

      const token = response.data.access;
      const refreshToken = response.data.refresh; // Добавьте это

      if (!token) {
        throw new Error("No access token in response");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
      }

      const user: User = {
        id: response.data.id || response.data.user?.id || 0,
        phone: response.data.phone || credentials.phone,
        name: response.data.name || credentials.phone,
        email: response.data.email || "",
        avatar: response.data.avatar || "",
        role: response.data.role || "",
        is_active: response.data.is_active || false
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { token, user };
    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data || error.message);
      throw error;
    }
  },

  register: async (userData: RegisterPayload): Promise<any> => {
    const { confirm_password, ...dataToSend } = userData;

    try {
      console.log("📝 Registering user:", dataToSend.phone);
      const response = await api.post("/auth/register/", dataToSend);

      const token = response.data.access;

      if (token && typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
      }

      return {
        success: true,
        user: response.data?.user || { name: userData.name, phone: userData.phone },
        token: token,
        data: response.data
      };

    } catch (error: any) {
      console.error("❌ Register error:", error.response?.data || error.message);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    console.log("👤 Getting current user");
    try {
      // Получаем ID пользователя из localStorage
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;

      if (!userStr) {
        throw new Error("User data not found in localStorage");
      }

      const user = JSON.parse(userStr);

      if (!user.id) {
        throw new Error("User ID not found");
      }

      // Используем backticks для интерполяции ID
      const response = await api.get(`/users/${user.id}/`);
      console.log("✅ Current user:", response.data);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error: any) {
      console.error("❌ Get current user error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateProfile: async (userId: number, data: Partial<User>): Promise<User> => {
    console.log("📝 Updating user profile:", userId);
    try {
      const response = await api.put(`/users/${userId}/`, data);
      console.log("✅ Profile updated:", response.data);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error: any) {
      console.error("❌ Update profile error:", error.response?.data || error.message);
      throw error;
    }
  },

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

  getOrders: async (): Promise<Order[]> =>
    (await withRetry(() => api.get("/orders/"))).data,

  getOrderById: async (id: number): Promise<Order> =>
    (await withRetry(() => api.get(`/orders/${id}/`))).data,

  createOrder: async (data: OrderData): Promise<Order> =>
    (await api.post("/orders/", data)).data,

  getExecutorReviews: async (): Promise<ExecutorReview[]> => {
    try {
      const response = await withRetry(() => api.get<ExecutorReview[]>("/executor-reviews/"));
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> =>
    (await withRetry(() => api.get(`/users/${id}/`))).data,

  getExecutorReviewById: async (id: number): Promise<ExecutorReview> =>
    (await withRetry(() => api.get(`/executor-reviews/${id}/`))).data,

  createExecutorReview: async (data: Omit<ExecutorReview, "id">): Promise<ExecutorReview> =>
    (await api.post("/executor-reviews/", data)).data,

  getClientReviews: async (): Promise<ClientReview[]> =>
    (await withRetry(() => api.get("/client-reviews/"))).data,

  getClientReviewById: async (id: number): Promise<ClientReview> =>
    (await withRetry(() => api.get(`/client-reviews/${id}/`))).data,

  createClientReview: async (data: Omit<ClientReview, "id">): Promise<ClientReview> =>
    (await api.post("/client-reviews/", data)).data,

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

  getReklamas: async (params?: Record<string, any>): Promise<Reklama[]> =>
    (await withRetry(() => api.get("/reklamas/", { params }))).data,

  getReklamaById: async (id: number): Promise<Reklama> =>
    (await withRetry(() => api.get(`/reklamas/${id}/`))).data,
};

export function getAPIClient() {
  return apiClient;
}

export default apiClient;