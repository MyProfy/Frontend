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
  ChangePasswordPayload,
  ChangePasswordResponse,
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
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const publicEndpoints = ['/auth/register/', '/auth/login/', '/auth/otp/request/', '/auth/otp/verify/'];
    const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (!isPublic) {
      const token = cookieManager.getCookie("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
            const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
              refresh: refreshToken
            }, {
              withCredentials: true
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
      const response = await api.post("/auth/login/", credentials, {
        withCredentials: true
      });

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
    try {
      const response = await api.post("/auth/register/", userData, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Registration error:", error.response?.data);
      throw error;
    }
  },

  requestOTP: async (phone: string): Promise<any> => {
    try {
      const response = await api.post("/auth/otp/request/", { phone }, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ OTP request error:", error.response?.data);
      throw error;
    }
  },

  verifyOTP: async (data: { phone: string; code: string }): Promise<OTPVerifyResponse> => {
    try {
      const response = await api.post("/auth/otp/verify/", data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ OTP verification error:", error.response?.data);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const user = cookieManager.getUser();

      if (!user) {
        throw new Error("User data not found in cookies");
      }

      if (!user.id) {
        throw new Error("User ID not found");
      }

      const response = await api.get(`/users/${user.id}/`);
      cookieManager.setUser(response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Get current user error:", error.response?.data);
      throw error;
    }
  },

  updateProfile: async (userId: number, data: Partial<User>): Promise<User> => {
    try {
      const response = await api.put(`/users/${userId}/`, data);
      cookieManager.setUser(response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Update profile error:", error.response?.data);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      cookieManager.removeCookie("access_token");
      cookieManager.removeCookie("refresh_token");
      cookieManager.removeCookie("user");
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
      console.error("❌ Get services error:", error);
      return [];
    }
  },

  getServiceById: async (id: number): Promise<Service> =>
    (await withRetry(() => api.get(`/services/${id}/`))).data,

  // Improved Vacancy Methods
  getVacancies: async (params?: Record<string, any>): Promise<Vacancy[]> => {
    try {
      const response = await withRetry(() => api.get("/vacancies/", { params }));

      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object' && 'results' in response.data) {
        return response.data.results;
      } else {
        console.warn("Unexpected vacancies response format:", response.data);
        return [];
      }
    } catch (error: any) {
      console.error("❌ Get vacancies error:", error.response?.data || error.message);
      return [];
    }
  },

  getVacanciesByClient: async (clientId: number): Promise<Vacancy[]> => {
    try {
      const response = await api.get("/vacancies/", {
        params: { client: clientId }
      });

      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      return [];
    } catch (error: any) {
      console.error("❌ Get client vacancies error:", error.response?.data || error.message);
      return [];
    }
  },

  getVacancyById: async (id: number): Promise<Vacancy> => {
    try {
      const response = await withRetry(() => api.get(`/vacancies/${id}/`));
      return response.data;
    } catch (error: any) {
      console.error("❌ Get vacancy error:", error.response?.data || error.message);
      throw error;
    }
  },

  createVacancy: async (
    data: {
      title: string;
      description: string;
      price: number;
      category: number;
      client: number;
      sub_category?: number;
      images?: string;
    }
  ): Promise<Vacancy> => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        client: data.client,
        ...(data.sub_category && { sub_category: data.sub_category }),
        ...(data.images && { images: data.images }),
        moderation: "pending",
        boost: 0,
      };

      const response = await api.post("/vacancies/", payload);
      return response.data;
    } catch (error: any) {
      console.error("❌ Create vacancy error:", error);
      if (error.response?.data) {
        console.error("Validation errors:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  },

  updateVacancy: async (id: number, data: any): Promise<Vacancy> => {
    try {
      console.log("📝 Updating vacancy:", id, data);

      const response = await api.put(`/vacancies/${id}/`, data);
      console.log("✅ Vacancy updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Update vacancy error:", error.response?.data || error.message);
      throw error;
    }
  },
  deleteVacancy: async (id: number): Promise<void> => {
    try {
      await api.delete(`/vacancies/${id}/`);
    } catch (error: any) {
      console.error("❌ Delete vacancy error:", error.response?.data || error.message);
      throw error;
    }
  },

  checkServicesEndpoint: async (): Promise<any> => {
    try {
      const response = await api.get("/services/");
      return response.data;
    } catch (error: any) {
      console.error("❌ Services endpoint check failed:", error);
      if (error.response?.status === 500) {
        throw new Error("SERVICE_ENDPOINT_500_ERROR");
      } else if (error.response?.status === 404) {
        throw new Error("SERVICE_ENDPOINT_NOT_FOUND");
      } else if (error.request) {
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

      const response = await api.post("/services/", payload);
      return response.data;
    } catch (error: any) {
      console.error("❌ Create service error:", error);
      throw error;
    }
  },

  getExecuterReviews: async (params?: Record<string, any>): Promise<ExecutorReview[]> => {
    try {
      const response = await withRetry(() => api.get("/client-reviews/", { params }));
      return extractData(response.data);
    } catch (error: any) {
      console.error("❌ Get reviews error:", error.response?.data || error.message);
      return [];
    }
  },

  getOrders: async (params?: Record<string, any>): Promise<Order[]> => {
    try {
      const response = await withRetry(() => api.get("/orders/", { params }));
      return extractData(response.data);
    } catch (error: any) {
      console.error("❌ Get orders error:", error.response?.data || error.message);
      return [];
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await withRetry(() => api.get(`/users/${id}/`));
      return response.data;
    } catch (error: any) {
      console.error("❌ Get user error:", error.response?.data || error.message);
      throw error;
    }
  },

  changePassword: async (data: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    try {
      const currentUser = await apiClient.getCurrentUser();
      const response = await api.put(`/users/${currentUser.id}/change-password/`, data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Change password error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export function getAPIClient() {
  return apiClient;
}

export default apiClient;