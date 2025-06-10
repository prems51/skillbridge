import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import { ProtectedRoute, PublicRoute, AuthRedirect } from "./components/ProtectedRoute";
import MyProfilePage from "./pages/MyProfilePage";
import UserProfile from "./pages/UserProfile";
import Connections from "./pages/Connections";




function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><AuthPage /></PublicRoute>} />
          {/* Protected routes */}
          <Route path="/user/:userId"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>} />
          <Route path="/connections"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suggestions"
            element={
              <ProtectedRoute>
                <SuggestionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch all routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
