import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [authPrompt, setAuthPrompt] = useState(null);

  // Restore session
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const persistSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/register`, {
        name,
        email,
        password,
      });
      if (res.data.success) {
        persistSession(res.data.token, res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Could not reach the server. Is the backend running?",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/login`, {
        email,
        password,
      });
      if (res.data.success) {
        persistSession(res.data.token, res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Could not reach the server. Is the backend running?",
      };
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateStoredUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const updateName = async (name) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/user/update-name`,
        { name },
        { headers: { token } }
      );
      if (res.data.success) {
        updateStoredUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: "Could not reach the server." };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/user/update-password`,
        { currentPassword, newPassword },
        { headers: { token } }
      );
      return { success: res.data.success, message: res.data.message };
    } catch (error) {
      return { success: false, message: "Could not reach the server." };
    }
  };

  const updateAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        `${API_URL}/api/user/update-avatar`,
        formData,
        { headers: { token } }
      );
      if (res.data.success) {
        updateStoredUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: "Could not reach the server." };
    }
  };

  const showAuthPrompt = (title, message) => {
    setAuthPrompt({ title, message });
  };
  const hideAuthPrompt = () => setAuthPrompt(null);

  const contextValue = {
    user,
    token,
    isLoggedIn: !!user,
    register,
    login,
    logout,
    updateName,
    updatePassword,
    updateAvatar,
    authPrompt,
    showAuthPrompt,
    hideAuthPrompt,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
