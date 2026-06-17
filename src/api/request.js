import axios from "axios";
import router from "../router";

// ─── Constants

const BASE_URL = "https://backend-oms.vercel.app/api/";
// const BASE_URL = "http://localhost:3000/api/";
const DEFAULT_TIMEOUT = 30_000;
const MAX_RETRY_ATTEMPTS = 2;
const RETRYABLE_STATUS_CODES = [502, 503, 504];
const NO_BODY_METHODS = ["get", "delete", "head", "options"];
const ALLOWED_METHODS = ["get", "post", "patch", "put", "delete"];

// ─── Axios Instance

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true,
});

// ─── Response Interceptor

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle Unauthorized
    if (error.response?.status === 401) {
      router.push({ name: "login" });
      return Promise.reject(error);
    }

    // Retry transient server errors
    const shouldRetry =
      RETRYABLE_STATUS_CODES.includes(error.response?.status) &&
      (originalRequest?._retryCount ?? 0) < MAX_RETRY_ATTEMPTS;

    if (shouldRetry) {
      originalRequest._retryCount =
        (originalRequest._retryCount ?? 0) + 1;

      const delay = 300 * originalRequest._retryCount;

      await new Promise((resolve) => setTimeout(resolve, delay));

      return axiosInstance(originalRequest);
    }

    handleError(error);
    return Promise.reject(error);
  }
);

// ─── Global Error Handler

const handleError = (error) => {
  if (axios.isCancel(error)) {
    console.warn("Request cancelled:", error.message);
    return;
  }

  if (!error.response) {
    console.error(
      "Network error:",
      error.message || "Unknown network error"
    );
    return;
  }

  const { status, statusText, data } = error.response;

  switch (status) {
    case 404:
      console.error(`Not found (404): ${error.config?.url}`);
      break;

    case 500:
    case 502:
    case 503:
      console.error(`Server error (${status}): ${statusText}`);
      break;

    default: {
      const message = data?.message;

      if (!message) {
        console.error("Unexpected error occurred");
        return;
      }

      if (typeof message === "object") {
        Object.entries(message).forEach(([field, messages]) => {
          const errors = Array.isArray(messages)
            ? messages
            : [messages];

          errors.forEach((msg) =>
            console.error(`Validation [${field}]:`, msg)
          );
        });
      } else {
        console.error("API error:", message);
      }
    }
  }
};

// ─── API Request Helper

const apiRequest = (
  method,
  url,
  {
    headers = {},
    params = {},
    data = {},
    look_up_key = null,
    onSuccess = null,
    onFailure = null,
    onFinally = null,
    responseType = "json",
    onUploadProgress = null,
    onDownloadProgress = null,
    signal = null,
    timeout = null,
  } = {}
) => {
  if (!ALLOWED_METHODS.includes(method)) {
    throw new Error(
      `Method "${method}" is not allowed. Use one of: ${ALLOWED_METHODS.join(
        ", "
      )}`
    );
  }

  if (!url) {
    throw new Error("URL is required");
  }

  if (look_up_key !== null && look_up_key !== undefined) {
    url = `${url.replace(/\/$/, "")}/${look_up_key}`;
  }

  const config = {
    method,
    url,
    headers,
    params,
    responseType,
    onUploadProgress,
    onDownloadProgress,
    ...(signal && { signal }),
    ...(timeout != null && { timeout }),
  };

  if (!NO_BODY_METHODS.includes(method)) {
    config.data = data;
  }

  return axiosInstance(config)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    })
    .catch((error) => {
      if (onFailure) {
        onFailure(error.response?.data ?? error);
        return;
      }

      throw error;
    })
    .finally(() => {
      if (onFinally) {
        onFinally();
      }
    });
};

export { axiosInstance };
export default apiRequest;