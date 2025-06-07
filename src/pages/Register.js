import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/LoginRegister.css";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [public_id, setpublic_id] = useState("");
    const [sector, setSector] = useState("");
    const [proofDocument, setProofDocument] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("sector", sector);
        formData.append("proof_document", proofDocument);

        try {
            const data = await register(formData); // Adjust backend to accept FormData if not already
            if (data?.username) {
                navigate("/login");
            }
        } catch (error) {
            if (error.response?.data?.username) {
                setErrorMessage("Username already exists. Please choose another.");
            } else if (error.response?.data?.email) {
                setErrorMessage("User with this email already exists.");
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="form-box">
                <h2>Register</h2>
                <form onSubmit={handleRegister} encType="multipart/form-data">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Authority Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Public ID"
                        value={public_id}
                        onChange={(e) => setpublic_id(e.target.value)}
                        required
                    />    
                    <input
                        type="text"
                        placeholder="Sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setProofDocument(e.target.files[0])}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default Register;
