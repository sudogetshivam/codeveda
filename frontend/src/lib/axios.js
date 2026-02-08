import axios from "axios";
import { getAuthToken } from "./authToken.js";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Attach Clerk JWT so backend can authenticate (required when frontend and API are different origins, e.g. localhost:5173 vs 3000)
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;

/*

 Pehle (Bina instance ke)
await axios.get("http://localhost:5173/api/books", { withCredentials: true })

Ab (Instance ke saath) 
await axiosInstance.get("/books") 
(BaseURL aur Cookies apne aap piche se lag gayi!)

*/