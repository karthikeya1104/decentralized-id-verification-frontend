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

export const getAuthorityDashboard = async () => {
  const response = await fetch(`${BACKEND_URL}/documents/authority/document-stats/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch dashboard data");
  return await response.json();
};

export const getUserDashboard = async () => {
  try {
    const response = await fetch(`${API_URL}/documents/user/document-stats/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user dashboard data");

    return await response.json();
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    throw error;
  }
};