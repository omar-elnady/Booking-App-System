import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";

const UserContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const { t, i18n } = useTranslation();
  const [loadingLoginBtn, setLoadingLoginBtn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        setUserData(jwtDecode(token));
        setUserToken(token);
        setIsLogin(true);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("userToken");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("userToken");
    setUserData(null);
    setIsLogin(false);
    setUserToken(null);
    // navigate("/login");
  };

  const prodectedRoute = ({ children }) => {
    if (!localStorage.getItem("userToken")) {
      // return <Navigate to="/login" />;
    }
    return children;
  };
  const ProductAuthLayout = ({ children }) => {
    if (localStorage.getItem("userToken")) {
      // return <Navigate to="/" />;
    }
    return children;
  };
  const loginSumbit = async (data, setIsLoading) => {
    console.log(data);
    setLoadingLoginBtn(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_LOGIN}`,
        data,
        { headers: { "accept-language": i18n.language } }
      );
      const token = response.data.access_token;
      if (!token) throw new Error("No token in response");
      localStorage.setItem("userToken", token);
      const decoded = jwtDecode(token);
      setUserData(decoded);
      toast.success(response.data.message);
      setIsLogin(true);
      navigate("/");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoadingLoginBtn(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        isLogin,
        logout,
        setIsLogin,
        setUserData,
        userToken,
        loginSumbit,
        loadingLoginBtn,
        ProductAuthLayout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  return useContext(UserContext);
}
