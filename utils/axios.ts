import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://registryapi-dev.azurewebsites.net/api", // correct API base
  headers: {
    "Content-Type": "application/json",
    "x-session-key": "hXL5iocF99"
  },
});

export default apiClient;
