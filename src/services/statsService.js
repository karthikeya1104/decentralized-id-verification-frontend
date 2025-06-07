import axios from "axios";
import { BACKEND_URL } from "../Config";

const API_URL = BACKEND_URL;

export const getStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/stats/`);
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch stats", error);
    return null;
  }
};
