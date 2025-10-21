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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error("🚨 API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("🚨 API No Response:", error.request);
    } else {
      console.error("🚨 API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const apiClient = {

  login: async (credentials: { phone: string; password: string }): Promise<{ token: string; user: User }> => {
    console.log("🔐 Login request:", { phone: credentials.phone });
    try {
      const response = await api.post("auth/login/", credentials);
      console.log("✅ Login response:", response.data);

      const token = response.data?.token ||
        response.data?.access_token ||
        response.data?.accessToken ||
        response.data?.auth_token ||
        response.data?.data?.token ||
        response.data?.data?.access_token;

      const user = response.data?.user ||
        response.data?.data?.user ||
        response.data?.data ||
        response.data;

      if (!token) {
        console.error("❌ Token not found in response:", Object.keys(response.data || {}));
        throw new Error("Token not found in server response");
      }

      return {
        token,
        user: user || { name: credentials.phone, phone: credentials.phone }
      };
    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data || error.message);
      throw error;
    }
  },

  register: async (userData: RegisterPayload): Promise<any> => {
    const { confirm_password, ...dataToSend } = userData;

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📝 РЕГИСТРАЦИЯ - ПОЛНЫЙ DEBUG");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🌐 API URL:", API_BASE_URL);
    console.log("📍 Endpoint:", `${API_BASE_URL}auth/register/`);
    console.log("\n📦 Данные для отправки:");
    console.log(JSON.stringify(dataToSend, null, 2));
    console.log("\n🔍 Валидация данных:");
    console.log("  ✓ Phone:", dataToSend.phone);
    console.log("  ✓ Password length:", dataToSend.password?.length);
    console.log("  ✓ Name:", dataToSend.name);
    console.log("  ✓ Role:", dataToSend.role);
    console.log("  ✓ Region:", dataToSend.region);
    console.log("  ✓ Gender:", dataToSend.gender);
    console.log("  ✓ Telegram ID:", dataToSend.telegram_id);
    console.log("  ✓ Telegram Username:", dataToSend.telegram_username);

    try {
      console.log("\n⏳ Отправка запроса...");
      const response = await api.post("auth/register/", dataToSend);

      console.log("\n✅ РЕГИСТРАЦИЯ УСПЕШНА");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 Response Status:", response.status);
      console.log("📄 Response Data:", JSON.stringify(response.data, null, 2));
      console.log("🔑 Доступные ключи:", Object.keys(response.data || {}));

      console.log("\n💡 Регистрация завершена. Токен НЕ возвращается сервером.");
      console.log("   Пользователь будет перенаправлен на вход.");

      return {
        success: true,
        user: response.data?.user || { name: userData.name, phone: userData.phone },
        data: response.data
      };

    } catch (error: any) {
      console.error("\n❌ ОШИБКА РЕГИСТРАЦИИ");
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("📊 Status:", error.response?.status);
      console.error("📄 Status Text:", error.response?.statusText);

      if (error.response?.data) {
        console.error("🚨 Error Data:", JSON.stringify(error.response.data, null, 2));

        if (typeof error.response.data === 'object') {
          console.error("\n🔍 Ошибки по полям:");
          Object.keys(error.response.data).forEach(key => {
            const value = error.response.data[key];
            console.error(`  ❌ ${key}:`, Array.isArray(value) ? value[0] : value);
          });
        }
      }

      throw error;
    }
  },

  requestOTP: async (
    phone: string
  ): Promise<{ message: string; data?: { link?: string; expires_at?: string } }> => {
    console.log("📱 Отправка OTP request для:", phone);

    if (!phone) throw new Error("Phone number is required");

    try {
      const response = await api.post("auth/otp/request/", { phone }, { timeout: 10000 });

      if (!response.data?.message) {
        throw new Error("Invalid server response");
      }

      return response.data;
    } catch (error: any) {
      console.error("❌ OTP request ошибка:", error?.response?.data || error);

      if (error.code === "ECONNABORTED" || !error.response) {
        return {
          message: "Сервер не отвечает. Откройте бота вручную",
          data: { link: "https://t.me/myprofy_bot" },
        };
      }

      throw error;
    }
  },


  verifyOTP: async (data: { phone: string; code: string }): Promise<{
    success: boolean;
    message: string;
    data?: {
      link?: string;
      expires_at?: string;
    };
  }> => {
    console.log("🔐 Отправка OTP verify:", { phone: data.phone, code: data.code });

    if (!data.phone || !data.code) {
      console.error("❌ Некорректные данные для верификации:", data);
      throw new Error("Phone and code are required");
    }

    try {
      // ✅ Отправляем phone и code в теле запроса
      const response = await api.post("auth/otp/verify/", {
        phone: data.phone,
        code: data.code
      });

      console.log("✅ OTP verify успешен:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ OTP verify ошибка:");
      console.error("  Status:", error.response?.status);
      console.error("  Data:", error.response?.data);

      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const response = await api.post("auth/logout/");
      console.log("✅ Logout success");
      return response.data;
    } catch (error: any) {
      console.error("❌ Logout error:", error.response?.data || error.message);
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

  getUserById: async (id: string | number): Promise<User> =>
    (await withRetry(() => api.get(`/users/${id}/`))).data,

  getOrders: async (): Promise<Order[]> =>
    (await withRetry(() => api.get("/orders/"))).data,

  getOrderById: async (id: number): Promise<Order> =>
    (await withRetry(() => api.get(`/orders/${id}/`))).data,

  createOrder: async (data: OrderData): Promise<Order> =>
    (await api.post("/orders/", data)).data,

  getExecutorReviews: async (): Promise<ExecutorReview[]> => {
    try {
      const response = await withRetry(() => api.get<ExecutorReview[]>("/executor-reviews/"));

      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.warn("⚠️ Неожиданный формат данных при загрузке отзывов:", response.data);
      return [];
    } catch (error) {
      console.error("❌ Ошибка загрузки отзывов:", error);
      throw error;
    }
  },


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