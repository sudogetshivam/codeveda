import axios from "axios";

const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
    withCredentials : true // browser will send coookies to server automatically on every single req
})

export default axiosInstance

/*

 Pehle (Bina instance ke)
await axios.get("http://localhost:5173/api/books", { withCredentials: true })

Ab (Instance ke saath) 
await axiosInstance.get("/books") 
(BaseURL aur Cookies apne aap piche se lag gayi!)

*/