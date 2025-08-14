// /lib/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://registryapi-dev.azurewebsites.net/api/v1",
  headers: {
    "Content-Type": "application/json",
    "x-session-key": "hXL5iocF99", // you can make this dynamic for doctor/nurse roles
  },
});

export default apiClient;
