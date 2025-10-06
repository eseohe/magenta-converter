import type { UnitCategory, CustomCategory } from "../types";

// Import all category collections
import { measurementCategories } from "./measurement";
import { scienceCategories } from "./science";
import { electronicsCategories } from "./electronics";
import { fitnessCategories, fitnessCustomCategories } from "./fitness-health";
import { digitalCategories, digitalCustomCategories } from "./digital";
import { transportCategories } from "./transport";
import { specialtyCategories, specialtyCustomCategories } from "./specialty";
import { financeCategories, financeCustomCategories } from "./finance";
import { mathCategories } from "./math";

// Combine all unit categories
export const unitCategories: UnitCategory[] = [
  ...measurementCategories,
  ...scienceCategories,
  ...electronicsCategories,
  ...fitnessCategories,
  ...digitalCategories,
  ...transportCategories,
  ...specialtyCategories,
  ...financeCategories,
];

// Combine all custom categories
export const customCategories: CustomCategory[] = [
  ...digitalCustomCategories,
  ...fitnessCustomCategories,
  ...specialtyCustomCategories,
  ...financeCustomCategories,
  ...mathCategories,
];

// Export the combined list (for backward compatibility)
export const allCategories = [...unitCategories, ...customCategories];

// Export individual category collections for targeted imports
export {
  measurementCategories,
  scienceCategories,
  electronicsCategories,
  fitnessCategories,
  fitnessCustomCategories,
  digitalCategories,
  digitalCustomCategories,
  transportCategories,
  specialtyCategories,
  specialtyCustomCategories,
  financeCategories,
  financeCustomCategories,
  mathCategories,
};
