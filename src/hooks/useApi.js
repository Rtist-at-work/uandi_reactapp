import axios from "axios";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

const useApi = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { startLoading, stopLoading, setAuthCardPopUp } = useAppContext();

  // 🔥 Reusable request handler
  const handleRequest = async (request) => {
    let toastId = null; // create only when needed

    try {
      startLoading();
      const response = await request();

      const successMessage = response?.data?.message;
      
      // 👉 Show loader ONLY if message exists
      if (successMessage) {
        toastId = toast.loading("Processing...");
      }

      if (successMessage) {
        toast.success(successMessage, {
          id: toastId,
          duration: 2500,
        });
      }

      return response;
    } catch (err) {
      console.error("API Error:", err);
      stopLoading();

      if (err?.response?.status === 401) {
        setAuthCardPopUp(true);
      }

      const errorMessage = err?.response?.data?.message || err?.message || null;

      // 👉 Only show loader + error toast if message exists
      if (errorMessage) {
        toastId = toast.loading("Processing...");
        toast.error(errorMessage, {
          id: toastId,
          duration: 3000,
        });
      }

      return null;
    } finally {
      stopLoading();
    }
  };

  // ============================
  //      Helper: Headers
  // ============================

  const getHeader = (contentType) => ({
    "Content-Type": contentType,
    Accept: "application/json",
  });

  // ============================
  //          GET
  // ============================

  const GETAPI = async (path, contentType) =>
    handleRequest(() =>
      axios.get(`${API_URL}/${path}`, {
        headers: getHeader(contentType),
        withCredentials: true,
      })
    );

  // ============================
  //          POST
  // ============================

  const POSTAPI = async (path, data, contentType) =>
    handleRequest(() =>
      axios.post(`${API_URL}/${path}`, data, {
        headers: getHeader(contentType),
        withCredentials: true,
      })
    );

  // ============================
  //         PATCH
  // ============================

  const PATCHAPI = async (path, data, contentType) =>
    handleRequest(() =>
      axios.patch(`${API_URL}/${path}`, data, {
        headers: getHeader(contentType),
        withCredentials: true,
      })
    );

  // ============================
  //         DELETE
  // ============================

  const DELETEAPI = async (path, data, contentType) =>
    handleRequest(() =>
      axios.delete(`${API_URL}/${path}`, {
        headers: getHeader(contentType),
        withCredentials: true,
        data,
      })
    );

  return {
    getJsonApi: GETAPI,
    postJsonApi: POSTAPI,
    patchApi: PATCHAPI,
    deleteApi: DELETEAPI,
  };
};

export default useApi;
