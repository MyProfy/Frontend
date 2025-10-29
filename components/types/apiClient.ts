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
  Review,
} from "./apiTypes";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.myprofy.uz/api";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

// Функция для работы с cookies
const cookieManager = {
  setCookie(name: string, value: string, days: number = 7): void {
    if (typeof window === "undefined") return;

    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
  },

  getCookie(name: string): string | null {
    if (typeof window === "undefined") return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  removeCookie(name: string): void {
    if (typeof window === "undefined") return;
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
  },

  setUser(user: User): void {
    if (typeof window === "undefined") return;
    this.setCookie('user', JSON.stringify(user));
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = this.getCookie('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

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
  timeout: 15000, // Увеличено до 15 секунд
  withCredentials: true, // Включена отправка cookies
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const publicEndpoints = ['/auth/register/', '/auth/login/', '/auth/otp/request/', '/auth/otp/verify/'];
    const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (!isPublic) {
      const token = cookieManager.getCookie("access_token");

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
          const refreshToken = cookieManager.getCookie("refresh_token");

          if (refreshToken) {
            console.log("Refreshing token...");
            const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
              refresh: refreshToken
            }, {
              withCredentials: true // Важно для cookies
            });

            const newAccessToken = response.data.access;

            cookieManager.setCookie("access_token", newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);

          cookieManager.removeCookie("access_token");
          cookieManager.removeCookie("refresh_token");
          cookieManager.removeCookie("user");

          if (typeof window !== "undefined") {
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
      const response = await api.post("/auth/login/", credentials, {
        withCredentials: true
      });
      console.log("✅ Login response:", response.data);

      const token = response.data.access;
      const refreshToken = response.data.refresh;

      if (!token) {
        throw new Error("No access token in response");
      }

      cookieManager.setCookie("access_token", token);
      if (refreshToken) {
        cookieManager.setCookie("refresh_token", refreshToken);
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

      cookieManager.setUser(user);

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
      const response = await api.post("/auth/register/", userData, {
        withCredentials: true
      });
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
      // console.log("📱 Requesting OTP for:", phone);
      const response = await api.post("/auth/otp/request/", { phone }, {
        withCredentials: true
      });
      // console.log("✅ OTP requested:", response.data);
      return response.data;
    } catch (error: any) {
      // console.error("❌ Request OTP error:", error.response?.data || error.message);
      // throw error;
    }
  },

  verifyOTP: async (data: { phone: string; code: string }): Promise<OTPVerifyResponse> => {
    try {
      // console.log("🔑 Verifying OTP for:", data.phone);
      const response = await api.post("/auth/otp/verify/", data, {
        withCredentials: true
      });
      // console.log("✅ OTP verified:", response.data);
      return response.data;
    } catch (error: any) {
      // console.error("❌ Verify OTP error:", error.response?.data || error.message);
      // throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    // console.log("👤 Getting current user");
    try {
      const user = cookieManager.getUser();

      if (!user) {
        throw new Error("User data not found in cookies");
      }

      if (!user.id) {
        throw new Error("User ID not found");
      }

      const response = await api.get(`/users/${user.id}/`);
      // console.log("✅ Current user:", response.data);

      cookieManager.setUser(response.data);

      return response.data;
    } catch (error: any) {
      // console.error("❌ Get current user error:", error.response?.data || error.message);
      // throw error;
    }
  },

  updateProfile: async (userId: number, data: Partial<User>): Promise<User> => {
    console.log("📝 Updating user profile:", userId);
    try {
      const response = await api.put(`/users/${userId}/`, data);
      console.log("✅ Profile updated:", response.data);

      cookieManager.setUser(response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Update profile error:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      cookieManager.removeCookie("access_token");
      cookieManager.removeCookie("refresh_token");
      cookieManager.removeCookie("user");

      console.log("✅ Logout successful");
    } catch (error: any) {
      console.error("❌ Logout error:", error);
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
      // console.error("❌ Get services error:", error);
      // throw error;
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
      // console.error("❌ Get vacancies error:", error.response?.data || error.message);
      // throw error;
    }
  },

  getVacancyById: async (id: number): Promise<Vacancy> => {
    try {
      const response = await withRetry(() => api.get(`/vacancies/${id}/`));
      console.log("✅ Vacancy loaded:", response.data);
      return response.data;
    } catch (error: any) {
      // console.error("❌ Get vacancy error:", error.response?.data || error.message);
      // throw error;
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

  checkServicesEndpoint: async (): Promise<any> => {
    try {
      console.log("🔍 Checking services endpoint...");
      const response = await api.get("/services/");
      console.log("✅ Services endpoint available:", response.status);
      return response.data;
    } catch (error: any) {
      console.error("❌ Services endpoint check failed:", error);

      if (error.response?.status === 500) {
        console.error("💥 Services endpoint returns 500 error");
        throw new Error("SERVICE_ENDPOINT_500_ERROR");
      } else if (error.response?.status === 404) {
        console.error("💥 Services endpoint not found (404)");
        throw new Error("SERVICE_ENDPOINT_NOT_FOUND");
      } else if (error.request) {
        console.error("💥 No response from services endpoint");
        throw new Error("SERVICE_ENDPOINT_NO_RESPONSE");
      }

      throw error;
    }
  },

  createService: async (
    data: {
      executor: number;
      category: number;
      sub_categories?: number[];
      title: string;
      description: string;
      price?: number;
      moderation?: string;
      boost?: number;
    }
  ): Promise<Service> => {
    try {
      // console.log("📝 Creating service:", data);

      const payload = {
        executor: data.executor,
        category: data.category,
        sub_categories: data.sub_categories || [],
        title: data.title,
        description: data.description,
        price: data.price || 0,
        moderation: data.moderation || "Pending",
        boost: data.boost || 1,
      };

      console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

      const response = await api.post("/services/", payload);
      // console.log("✅ Service created:", response.data);
      return response.data;
    } catch (error: any) {
      // console.error("❌ Create service error:", error);

      if (error.response) {
        // console.error("📊 Error details:");
        // console.error("Status:", error.response.status);
        // console.error("Status Text:", error.response.statusText);
        // console.error("Headers:", error.response.headers);
        // console.error("Data:", error.response.data);

        // if (error.response.status === 500) {
        //   console.error("🔧 Server 500 Error - Possible causes:");
        //   console.error("  - Database connection issue");
        //   console.error("  - Backend code error");
        //   console.error("  - Missing required fields on server");
        //   console.error("  - Serializer validation failed");
        // }
      } else if (error.request) {
        // console.error("🌐 Network error - No response received");
      } else {
        // console.error("⚡ Request setup error:", error.message);
      }

      throw error;
    }
  },

  getExecuterReviews: async (params?: Record<string, any>): Promise<ExecutorReview[]> => {
    try {
      const response = await withRetry(() => api.get("/reviews/", { params }));
      console.log("✅ Reviews loaded:", response.data);
      return extractData(response.data);
    } catch (error: any) {
      // console.error("❌ Get reviews error:", error.response?.data || error.message);
      // throw error;
    }
  },

  getOrders: async (params?: Record<string, any>): Promise<Order[]> => {
    try {
      const response = await withRetry(() => api.get("/orders/", { params }));
      console.log("✅ Orders loaded:", response.data);
      return extractData(response.data);
    } catch (error: any) {
      // console.error("❌ Get orders error:", error.response?.data || error.message);
      // throw error;
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await withRetry(() => api.get(`/users/${id}/`));
      console.log("✅ User loaded:", response.data);
      return response.data;
    } catch (error: any) {
      // console.error("❌ Get user error:", error.response?.data || error.message);
      // throw error;
    }
  }
};

export function getAPIClient() {
  return apiClient;
}

export default apiClient;