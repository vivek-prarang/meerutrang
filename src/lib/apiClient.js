import axios from "axios";
import axiosCurlirize from 'axios-curlirize';

// Attach curlirize to axios
axiosCurlirize(axios);

// Two axios instances, one for each platform
export const prarangApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PRARANG_API_BASE_URL || "https://www.prarang.in/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

export const analyticsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_ANALYTICS || "https://api.prarang.in/api/v1/",
  headers: {
    "Content-Type": "application/json",
    "api-auth-token": process.env.NEXT_PUBLIC_API_AUTH_TOKEN || "",
    "api-auth-type": process.env.NEXT_PUBLIC_API_AUTH_TYPE || "WEB",
  },
  timeout: 8000,
});

// Generic wrappers that return { data, error }
export async function apiGet(client, path, body, config) {
  try {
    const res = await client.get(path, { ...config, data: body });
    return { data: res.data, error: null };
  } catch (err) {
    return { data: null, error: normalizeError(err) };
  }
}

export async function apiPost(client, path, body, config) {
  try {
    const res = await client.post(path, body, config);
    return { data: res.data, error: null };
  } catch (err) {
    return { data: null, error: normalizeError(err) };
  }
}

function normalizeError(err) {
  if (err.response) {
    return {
      status: err.response.status,
      message: err.response.data || err.message,
    };
  }
  return { status: null, message: err.message };
}
