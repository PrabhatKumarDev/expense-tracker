import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const registerUser = async (formData) => {
  const response = await authApi.post("/register", formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await authApi.post("/login", formData);
  return response.data;
};