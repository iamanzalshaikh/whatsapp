import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const AuthContext = createContext();
let socket; // Keep socket reference

const AuthProvider = ({ children }) => {
  const serverUrl = "http://localhost:8001";
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      console.log("Current user response:", res.data);
      setCurrentUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to get current user:", err.response?.data || err.message);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${serverUrl}/api/auth/login`, { email, password }, {
        withCredentials: true,
      });
      console.log("Login response:", res.data);
      setCurrentUser(res.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const signup = async (userName, email, password) => {
    try {
      const res = await axios.post(`${serverUrl}/api/auth/signup`, { userName, email, password }, {
        withCredentials: true,
      });
      setCurrentUser(res.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Signup failed" };
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log("Logout response:", res.data);
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      if (socket) socket.disconnect();
      console.log("User state after logout:", { currentUser: null, isAuthenticated: false });
    }
  };

  // 🔹 Connect socket when currentUser changes
  // useEffect(() => {
  //   if (currentUser?._id) {
  //     socket = io(serverUrl, {
  //       auth: { userId: currentUser._id },
  //       withCredentials: true,
  //     });

  //     socket.on("connect", () => {
  //       console.log("✅ Socket connected:", socket.id);
  //     });

  //     socket.on("disconnect", () => {
  //       console.log("❌ Socket disconnected");
  //     });
  //   }
  // }, [currentUser]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      serverUrl,
      currentUser,
      loading,
      isAuthenticated,
      login,
      signup,
      logout,
      getCurrentUser,
      socket // 🔹 Expose socket if needed
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
