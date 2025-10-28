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
  PaginatedResponse,
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
  timeout: 4000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const publicEndpoints = ['/auth/register/', '/auth/login/', '/auth/otp/request/', '/auth/otp/verify/'];
    const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (!isPublic) {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token attached to request:", config.url);
      } else {
        console.warn("No token found for request:", config.url);
      }
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
        console.error("403 Forbidden - недостаточно прав или токен невалидный");
      }
    } else if (error.request) {
      console.error("API No Response:", error.request);
      console.error("Возможные причины:");
      console.error("  - CORS не настроен на бэкенде");
      console.error("  - Сервер не доступен");
      console.error("  - Неправильный URL:", API_BASE_URL);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Вспомогательная функция для извлечения данных из пагинированного ответа
const extractData = <T>(data: T | PaginatedResponse<T>): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object' && 'results' in data) {
    return (data as PaginatedResponse<T>).results;
  }
  return [] as T[];
};

export const apiClient = {
  login: async (credentials: LoginPayload): Promise<{ token: string; user: User }> => {
    try {
      console.log("🔐 Logging in:", credentials.phone);
      const response = await api.post("/auth/login/", credentials);
      console.log("✅ Login response:", response.data);

      const token = response.data.access;
      const refreshToken = response.data.refresh;

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
        region: response.data.region || "",
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
    console.log("РЕГИСТРАЦИЯ - отправляемые данные:");
    console.log("URL:", `${API_BASE_URL}/auth/register/`);
    console.log("Данные:", JSON.stringify(userData, null, 2));

    try {
      const response = await api.post("/auth/register/", userData);
      console.log("Успешная регистрация - ответ сервера:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ ОШИБКА РЕГИСТРАЦИИ:");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Data:", error.response?.data);
      console.error("Headers:", error.response?.headers);
      console.error("Request URL:", error.config?.url);
      console.error("Request Method:", error.config?.method);
      console.error("Request Data:", error.config?.data);

      if (error.response?.data && Object.keys(error.response.data).length === 0) {
        console.error("Backend returned empty 400 response. Possible causes:");
        console.error("  - Backend validation failed but didn't return error details");
        console.error("  - CORS issue preventing error response");
        console.error("  - Backend expects different payload format");
        console.error("  - Missing or invalid authentication header");
      }

      throw error;
    }
  },

  requestOTP: async (phone: string): Promise<any> => {
    try {
      console.log("📱 Requesting OTP for:", phone);
      const response = await api.post("/auth/otp/request/", { phone });
      console.log("✅ OTP requested:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Request OTP error:", error.response?.data || error.message);
      throw error;
    }
  },

  verifyOTP: async (data: { phone: string; code: string }): Promise<OTPVerifyResponse> => {
    try {
      console.log("🔑 Verifying OTP for:", data.phone);
      const response = await api.post("/auth/otp/verify/", data);
      console.log("✅ OTP verified:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Verify OTP error:", error.response?.data || error.message);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    console.log("👤 Getting current user");
    try {
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;

      if (!userStr) {
        throw new Error("User data not found in localStorage");
      }

      const user = JSON.parse(userStr);

      if (!user.id) {
        throw new Error("User ID not found");
      }

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

  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await withRetry(() => api.get("/categories/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get categories error:", error);
      throw error;
    }
  },

  getCategoryById: async (id: number): Promise<Category> =>
    (await withRetry(() => api.get(`/categories/${id}/`))).data,

  getSubcategories: async (params?: Record<string, any>): Promise<SubCategory[]> => {
    try {
      const response = await withRetry(() => api.get("/subcategories/", { params }));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get subcategories error:", error);
      throw error;
    }
  },

  getSubcategoryById: async (id: number): Promise<SubCategory> =>
    (await withRetry(() => api.get(`/subcategories/${id}/`))).data,

  getServices: async (page = 1, limit = 50, params?: Record<string, any>): Promise<Service[]> => {
    try {
      const response = await withRetry(() => api.get("/services/", { params: { page, limit, ...params } }));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get services error:", error);
      throw error;
    }
  },

  getServiceById: async (id: number): Promise<Service> =>
    (await withRetry(() => api.get(`/services/${id}/`))).data,

  getVacancies: async (params?: Record<string, any>): Promise<Vacancy[]> => {
    try {
      const response = await withRetry(() => api.get("/vacancies/", { params }));
      console.log("✅ Vacancies loaded:", response.data);
      return extractData(response.data);
    } catch (error: any) {
      console.error("❌ Get vacancies error:", error.response?.data || error.message);
      throw error;
    }
  },

  getVacancyById: async (id: number): Promise<Vacancy> => {
    try {
      const response = await withRetry(() => api.get(`/vacancies/${id}/`));
      console.log("✅ Vacancy loaded:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Get vacancy error:", error.response?.data || error.message);
      throw error;
    }
  },

  createVacancy: async (
    data: Omit<Vacancy, "id" | "moderation" | "moderation_display" | "boost"> & {
      images?: File | string | (File | string)[];
    }
  ): Promise<Vacancy> => {
    try {
      console.log("📝 Creating vacancy:", data);

      let payload: any;
      let headers: Record<string, string>;

      if (
        data.images instanceof File ||
        (Array.isArray(data.images) && data.images.some(img => img instanceof File))
      ) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("category", String(data.category));
        formData.append("client", String(data.client));
        if (data.sub_category)
          formData.append("sub_category", String(data.sub_category));

        if (Array.isArray(data.images)) {
          data.images.forEach(img => {
            if (img instanceof File) formData.append("images", img);
          });
        } else if (data.images instanceof File) {
          formData.append("images", data.images);
        }

        payload = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        payload = {
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          client: data.client,
          ...(data.sub_category && { sub_category: data.sub_category }),
          ...(data.images && { images: Array.isArray(data.images) ? data.images : [data.images] }),
        };
        headers = { "Content-Type": "application/json" };
      }

      const response = await api.post("/vacancies/", payload, { headers });
      console.log("✅ Vacancy created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Create vacancy error:", error.response?.data || error.message);
      if (error.response?.data) {
        console.error("Validation errors:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  },


  updateVacancy: async (id: number, data: Partial<Vacancy>): Promise<Vacancy> => {
    try {
      console.log("📝 Updating vacancy:", id, data);
      const response = await api.patch(`/vacancies/${id}/`, data);
      console.log("✅ Vacancy updated:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Update vacancy error:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteVacancy: async (id: number): Promise<void> => {
    try {
      console.log("🗑️ Deleting vacancy:", id);
      await api.delete(`/vacancies/${id}/`);
      console.log("✅ Vacancy deleted");
    } catch (error: any) {
      console.error("❌ Delete vacancy error:", error.response?.data || error.message);
      throw error;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const response = await withRetry(() => api.get("/users/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get users error:", error);
      throw error;
    }
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await withRetry(() => api.get("/orders/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get orders error:", error);
      throw error;
    }
  },

  getOrderById: async (id: number): Promise<Order> =>
    (await withRetry(() => api.get(`/orders/${id}/`))).data,

  createOrder: async (data: OrderData): Promise<Order> =>
    (await api.post("/orders/", data)).data,

  getExecutorReviews: async (): Promise<ExecutorReview[]> => {
    try {
      const response = await withRetry(() => api.get<ExecutorReview[]>("/executor-reviews/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get executor reviews error:", error);
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> =>
    (await withRetry(() => api.get(`/users/${id}/`))).data,

  getExecutorReviewById: async (id: number): Promise<ExecutorReview> =>
    (await withRetry(() => api.get(`/executor-reviews/${id}/`))).data,

  createExecutorReview: async (data: Omit<ExecutorReview, "id">): Promise<ExecutorReview> =>
    (await api.post("/executor-reviews/", data)).data,

  getClientReviews: async (): Promise<ClientReview[]> => {
    try {
      const response = await withRetry(() => api.get("/client-reviews/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get client reviews error:", error);
      throw error;
    }
  },

  getClientReviewById: async (id: number): Promise<ClientReview> =>
    (await withRetry(() => api.get(`/client-reviews/${id}/`))).data,

  createClientReview: async (data: Omit<ClientReview, "id">): Promise<ClientReview> =>
    (await api.post("/client-reviews/", data)).data,

  getOrderReviews: async (): Promise<OrderReview[]> => {
    try {
      const response = await withRetry(() => api.get("/order-reviews/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get order reviews error:", error);
      throw error;
    }
  },

  getOrderReviewById: async (id: number): Promise<OrderReview> =>
    (await withRetry(() => api.get(`/order-reviews/${id}/`))).data,

  createOrderReview: async (data: Omit<OrderReview, "id">): Promise<OrderReview> =>
    (await api.post("/order-reviews/", data)).data,

  getPayments: async (): Promise<Payment[]> => {
    try {
      const response = await withRetry(() => api.get("/payments/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get payments error:", error);
      throw error;
    }
  },

  getPaymentById: async (id: number): Promise<Payment> =>
    (await withRetry(() => api.get(`/payments/${id}/`))).data,

  createPayment: async (data: Omit<Payment, "id">): Promise<Payment> =>
    (await api.post("/payments/", data)).data,

  getBoosts: async (): Promise<Boost[]> => {
    try {
      const response = await withRetry(() => api.get("/boosts/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get boosts error:", error);
      throw error;
    }
  },

  getBoostById: async (id: number): Promise<Boost> =>
    (await withRetry(() => api.get(`/boosts/${id}/`))).data,

  createBoost: async (data: Omit<Boost, "id">): Promise<Boost> =>
    (await api.post("/boosts/", data)).data,

  getServiceBoosts: async (): Promise<ServiceBoost[]> => {
    try {
      const response = await withRetry(() => api.get("/service-boosts/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get service boosts error:", error);
      throw error;
    }
  },

  getServiceBoostById: async (id: number): Promise<ServiceBoost> =>
    (await withRetry(() => api.get(`/service-boosts/${id}/`))).data,

  createServiceBoost: async (data: Omit<ServiceBoost, "id">): Promise<ServiceBoost> =>
    (await api.post("/service-boosts/", data)).data,

  getVacancyBoosts: async (): Promise<VacancyBoost[]> => {
    try {
      const response = await withRetry(() => api.get("/vacancy-boosts/"));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get vacancy boosts error:", error);
      throw error;
    }
  },

  getVacancyBoostById: async (id: number): Promise<VacancyBoost> =>
    (await withRetry(() => api.get(`/vacancy-boosts/${id}/`))).data,

  createVacancyBoost: async (data: Omit<VacancyBoost, "id">): Promise<VacancyBoost> =>
    (await api.post("/vacancy-boosts/", data)).data,

  getReklamas: async (params?: Record<string, any>): Promise<Reklama[]> => {
    try {
      const response = await withRetry(() => api.get("/reklamas/", { params }));
      return extractData(response.data);
    } catch (error) {
      console.error("❌ Get reklamas error:", error);
      throw error;
    }
  },

  getReklamaById: async (id: number): Promise<Reklama> =>
    (await withRetry(() => api.get(`/reklamas/${id}/`))).data,
};

export function getAPIClient() {
  return apiClient;
}

export default apiClient;