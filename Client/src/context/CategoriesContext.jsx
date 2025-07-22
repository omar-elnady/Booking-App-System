import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const { userToken } = useAuth();

  const getEvents = async (page, size) => {
    try {
      const respose = await axios.get(
        `${import.meta.env.VITE_CATEGORIES_GET}`,
        { headers: { "accept-language": i18n.language } }
      );
      setCategories(respose?.data);
      console.log(respose);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };
  const createCategory = async (data) => {
    console.log(data);
    console.log(userToken)
    try {
      if (!data || !data.categoryEn || !data.categoryAr) {
        return toast.error("All fields are required");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_CATEGORIES_API}`,
        {
          name: {
            ar: data.categoryAr,
            en: data.categoryEn,
          },
        },
        {
          headers: {
            "accept-language": i18n.language,
            authorization: import.meta.env.VITE_BEARER_TOKEN + userToken,
          },
        }
      );
    } catch (error) {
      console.log(error?.response);
    }
  };
  useEffect(() => {
    // getEvents(page, size);
  }, [i18n.language]);

  return (
    <CategoriesContext.Provider
      value={{ categories, setCategories, createCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
