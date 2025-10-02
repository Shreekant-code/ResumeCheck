import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const API_BASE_URL = "http://localhost:3000";

  // Refresh token on app load
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/refresh-token`,
          {},
          { withCredentials: true }
        );
        setAccessToken(res.data.accessToken);
      } catch (err) {
        setAccessToken(null);
      }
    };
    refreshAccessToken();
  }, []);

  const axiosInstance = axios.create({ baseURL: API_BASE_URL });
  axiosInstance.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, axiosInstance, API_BASE_URL }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
