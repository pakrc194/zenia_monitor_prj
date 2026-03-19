import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request 인터셉터 ───────────────────────────────
// 모든 요청에 Access Token 자동 첨부
api.interceptors.request.use(
  (config) => {
    // 로그인 요청은 토큰 첨부 제외
    if (config.url === "/auth/login") {
      return config;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response 인터셉터 ──────────────────────────────
let isRefreshing = false;           // 재발급 중복 방지 플래그
let failedQueue = [];               // 재발급 대기 중인 요청 목록

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // 401 + 재시도 아닌 경우 → Refresh Token으로 재발급
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 재발급 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) throw new Error("Refresh Token 없음");

        // 새 Access Token 요청
        const { accessToken } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);   // 대기 중인 요청 재시도
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh Token도 만료 → 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    console.error(`[API Error] ${status} - ${message}`);
    return Promise.reject(error);
  }
);

export default api;