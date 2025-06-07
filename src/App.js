import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToHashElement from "./components/ScrollToHashElement";
import UserDashboard from "./user/UserDashboard";
import AuthorityDashboard from "./authority/AuthorityDashboard";
import MyDocuments from "./user/MyDocuments";
import IssuedDocuments from "./authority/IssuedDocuments";
import DocumentDetailPage from "./pages/DocumentDetailPage";
import UploadDocumentPage from "./user/UploadDocumentPage";
import IssueDocumentPage from "./authority/IssueDocumentPage";
import FlagDocumentPage from "./user/FlagDocumentPage";
import VerifyDocumentPage from "./authority/VerifyDocumentPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToHashElement />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
            <Route path="/documents/:id" element={<PrivateRoute><DocumentDetailPage /></PrivateRoute>} />  
            {/* User Routes */}
            <Route path="/user/" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/user/my-documents" element={<PrivateRoute><MyDocuments /></PrivateRoute>} />
            <Route path="/user/upload" element={<PrivateRoute><UploadDocumentPage /></PrivateRoute>} />
            <Route path="/user/flag" element={<PrivateRoute><FlagDocumentPage /></PrivateRoute>} />

            {/* Authority Routes */}
            <Route path="/authority/" element={<PrivateRoute><AuthorityDashboard /></PrivateRoute>} />
            <Route path="/authority/issued-documents" element={<PrivateRoute><IssuedDocuments /></PrivateRoute>} />
            <Route path="/authority/issue" element={<PrivateRoute><IssueDocumentPage /></PrivateRoute>} />
            <Route path="/authority/verify" element={<PrivateRoute><VerifyDocumentPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
