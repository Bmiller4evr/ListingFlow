import { VALID_VIEWS } from "./constants";
import { View } from "../types/app";

// Helper to validate view names
export const isValidView = (view: string): boolean => {
  return VALID_VIEWS.includes(view);
};

// Type guard for View type
export const isView = (view: string): view is View => {
  return isValidView(view);
};