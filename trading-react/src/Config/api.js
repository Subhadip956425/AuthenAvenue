import axios from "axios";

export const API_BASE_URL = "http://localhost:5454";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

export default api;