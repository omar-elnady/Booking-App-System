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

  const getCategories = async (page, size) => {
    try {
      const respose = await axios.get(
        `${import.meta.env.VITE_CATEGORIES_API}`,
        { headers: { "accept-language": i18n.language } }
      );
      setCategories(respose?.data?.categories);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };
  const createCategory = async (data) => {
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
      console.log(response?.data);
    } catch (error) {
      console.log(error?.response);
    }
  };
  const updateCategory = async (id, data) => {
    try {
      if (!data || !data.categoryEn || !data.categoryAr) {
        return toast.error("All fields are required");
      }
      const response = await axios.patch(
        `${import.meta.env.VITE_CATEGORIES_API}/${id}`,
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
      console.log(response?.data);
    } catch (error) {
      console.log(error?.response);
    }
  };
  const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_CATEGORIES_API}/${id}`,
        {
          headers: {
            "accept-language": i18n.language,
            authorization: import.meta.env.VITE_BEARER_TOKEN + userToken,
          },
        }
      );
      console.log(response?.data);
    } catch (error) {
      console.log(error?.response);
    }
  };
  useEffect(() => {
    getCategories();
  }, [i18n.language]);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        createCategory,
        getCategories,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
