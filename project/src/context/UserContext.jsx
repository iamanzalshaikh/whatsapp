import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { serverUrl, currentUser, isAuthenticated } = useContext(AuthContext);
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOtherUsers = async () => {
    if (!isAuthenticated || !currentUser) {
      setOtherUsers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/user/others`, {
        withCredentials: true,
      });
      setOtherUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch other users:", err);
      setOtherUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) return [];
    
    try {
      const res = await axios.get(`${serverUrl}/api/user/search?query=${query}`, {
        withCredentials: true,
      });
      return res.data || [];
    } catch (err) {
      console.error("Failed to search users:", err);
      return [];
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOtherUsers();
    }
  }, [isAuthenticated, currentUser]);

  return (
    <UserContext.Provider value={{ 
      otherUsers, 
      loading, 
      fetchOtherUsers,
      searchUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;