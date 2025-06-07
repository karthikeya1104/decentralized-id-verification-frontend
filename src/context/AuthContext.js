import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Remove curly braces
import { getToken, logout } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const handleLogout = (logoutCallback) => {
        logout();
        setUser(null);
        if (logoutCallback) {
            logoutCallback(); 
        }
    };

    const [user, setUser] = useState(() => {
        const token = getToken();
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                if (decodedUser.exp && decodedUser.exp < Date.now() / 1000) {
                    console.warn("Token expired, logging out...");
                    logout();
                    return null;
                }
                return decodedUser;
            } catch (error) {
                logout();
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const decodedUser = jwtDecode(token);
            if (decodedUser.exp && decodedUser.exp < Date.now() / 1000) {
                handleLogout();
            } else {
                setUser(decodedUser);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            handleLogout();
        }
    }, []); // Re-run when token changes

    return (
        <AuthContext.Provider value={{ user, setUser, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
