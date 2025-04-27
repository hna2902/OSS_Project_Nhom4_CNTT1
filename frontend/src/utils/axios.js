// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // Thay bằng URL backend của bạn nếu khác
  withCredentials: true,
});

export default instance;
