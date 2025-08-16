import type { LeadFilters, LeadSort } from "../types";
import { STORAGE_KEYS } from "../utils/storage";

const StorageService = {
  saveFilters(filters: LeadFilters): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
    } catch (error) {
      console.warn("Failed to save filters to localStorage:", error);
    }
  },

  loadFilters(): LeadFilters | null {
    try {
      const storedFilters = localStorage.getItem(STORAGE_KEYS.FILTERS);
      return storedFilters ? JSON.parse(storedFilters) : null;
    } catch (error) {
      console.warn("Failed to load filters from localStorage:", error);
      return null;
    }
  },

  saveSort(sort: LeadSort): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SORT, JSON.stringify(sort));
    } catch (error) {
      console.warn("Failed to save sort to localStorage:", error);
    }
  },

  loadSort(): LeadSort | null {
    try {
      const storedSort = localStorage.getItem(STORAGE_KEYS.SORT);
      return storedSort ? JSON.parse(storedSort) : null;
    } catch (error) {
      console.warn("Failed to load sort from localStorage:", error);
      return null;
    }
  },
};

export default StorageService;
