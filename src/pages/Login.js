import { useState, useContext } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/LoginRegister.css"; 
import { jwtDecode } from "jwt-decode";
 
const Login = () => {
    const [PublicID, setPublicID] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const data = await login(PublicID, password);
            if (data?.access && data?.refresh) {
                localStorage.setItem("accessToken", data.access);
                const decodedUser = jwtDecode(data.access);
                setUser(decodedUser);
                if (data.user.role === "authority")
                    navigate("/authority/");
                else
                    navigate("/user/");
            } else {
                setErrorMessage("Invalid credentials. Please try again.");
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="form-box">
                <h2>Login</h2>
                <br></br>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="PublicID"
                        onChange={(e) => setPublicID(e.target.value)}
                        value={PublicID}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>Don't have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    );
};

export default Login;
