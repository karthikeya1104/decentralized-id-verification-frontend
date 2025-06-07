import axios from "axios";
import { BACKEND_URL } from "../Config";

const API_URL = BACKEND_URL; // Use config file

export const login = async (public_id, password) => {
    const response = await axios.post(`${API_URL}/users/login/`, { public_id, password });
    if (response.data.access) {
        localStorage.setItem("token", response.data.access);
    }
    return response.data;
};

export const register = async (formData) => {
    const response = await axios.post(`${API_URL}/users/authority/register/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");
