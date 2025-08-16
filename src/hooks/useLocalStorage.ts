import { useCallback, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { StorageService } from "../services";

export default function useLocalStorage() {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const savedFilters = StorageService.loadFilters();
    const savedSort = StorageService.loadSort();

    if (savedFilters) {
      dispatch({ type: "SET_FILTERS", payload: savedFilters });
    }

    if (savedSort) {
      dispatch({ type: "SET_SORT", payload: savedSort });
    }
  }, [dispatch]);

  const clearStoredPreferences = useCallback(() => {
    try {
      localStorage.removeItem("seller-console-filters");
      localStorage.removeItem("seller-console-sort");
    } catch (error) {
      console.warn("Failed to clear stored preferences:", error);
    }
  }, []);

  return {
    clearStoredPreferences,
  };
}
