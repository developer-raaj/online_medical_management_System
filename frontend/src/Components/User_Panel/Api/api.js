import axios from "axios";

const API = axios.create({ baseURL: "https://online-medical-management-system.onrender.com/api/medicines" });

export default API;
