// utils/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { User } from "../store/useAuthStore";

const PROXY_URL = "/api/proxy"; // Use Next.js proxy

// Get token/session_id from localStorage (safe check for server-side)
const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const sessionId = localStorage.getItem("session_id");
    const userId = localStorage.getItem("user_id");

    return {
      "x-user-id": userId || "",
      "x-session-id": sessionId || "",
    };
  }
  return {};
};

// Generic request with axios through Next.js proxy
const request = async (
  method: AxiosRequestConfig["method"],
  endpoint: string,
  body?: any,
  withToken: boolean = false
) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (withToken) {
      Object.assign(headers, getAuthHeaders());
    }

    // Call proxy with endpoint as query param
    const res = await axios({
      method,
      url: `${PROXY_URL}?endpoint=${encodeURIComponent(endpoint)}`,
      data: body,
      headers,
    });

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "API request failed");
    }
    throw new Error(error.message || "Network error");
  }
};

// Exported helpers
export const getRequest = (endpoint: string, withToken = false) =>
  request("GET", endpoint, null, withToken);

export const postRequest = (endpoint: string, body: any, withToken = false) =>
  request("POST", endpoint, body, withToken);

export const putRequest = (endpoint: string, body: any, withToken = false) =>
  request("PUT", endpoint, body, withToken);

export const deleteRequest = (endpoint: string, withToken = false) =>
  request("DELETE", endpoint, null, withToken);

// Profile upload API
export const uploadProfileImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(
    `/api/proxy-upload?endpoint=${encodeURIComponent('/account/upload')}`,
    formData
  );

  return response.data;
};
