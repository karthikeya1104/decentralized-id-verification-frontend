import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // If the user is not authenticated, redirect them to the login page
        return <Navigate to="/login" />;
    }

    return children;  // Return the protected route's component if authenticated
};

export default PrivateRoute;
