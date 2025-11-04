// utils/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { User } from "../store/useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // keep base url in .env

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

// Generic request with axios
const request = async (
  method: AxiosRequestConfig["method"],
  endpoint: string,
  body?: any,
  withToken: boolean = false
) => {
  try {
    const headers: Record<string, string> = {};

    if (withToken) {
      Object.assign(headers, getAuthHeaders());
    }

    const res = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
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
export async function uploadProfileImage(file: File, user: User) {
  const formData = new FormData();
  formData.append("device", "android");
  formData.append("app_version", "1.0.5");
  formData.append("sess_id", user.sess_id);
  formData.append("user_id", user.user_id);
  formData.append("file", file);

  const res = await axios.post(
    `${BASE_URL}/account/upload-profile-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data; // should include the uploaded image URL
}
