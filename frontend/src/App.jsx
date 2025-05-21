import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

function App() {
   const { user, checkAuth, isCheckingAuth } = useAuthStore();
   const { theme } = useThemeStore();

   useEffect(() => {
      checkAuth();
   }, [checkAuth]);

   if (isCheckingAuth && !user)
      return (
         <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin" />
         </div>
      );

   const ProtectedRoute = ({ children }) => {
      if (!user) {
         return <Navigate to={"/login"} replace />;
      }
      return children;
   };

   const RedirectAuthenticatedUser = ({ children }) => {
      if (user) {
         return <Navigate to={"/"} replace />;
      }
      return children;
   };

   return (
      <div data-theme={theme}>
         <Navbar />
         <Routes>
            <Route
               path="/"
               element={
                  <ProtectedRoute>
                     <HomePage />
                  </ProtectedRoute>
               }
            />
            <Route
               path="/signup"
               element={
                  <RedirectAuthenticatedUser>
                     <SignupPage />
                  </RedirectAuthenticatedUser>
               }
            />
            <Route
               path="/login"
               element={
                  <RedirectAuthenticatedUser>
                     <LoginPage />
                  </RedirectAuthenticatedUser>
               }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
               path="/profile"
               element={
                  <ProtectedRoute>
                     <ProfilePage />
                  </ProtectedRoute>
               }
            />
         </Routes>
         <Toaster />
      </div>
   );
}

export default App;
