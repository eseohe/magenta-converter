import type { Category } from "../types";
import {
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
} from "./categories";

export interface Section {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: Category[];
}

export const sections: Section[] = [
  {
    id: "measurement",
    name: "Measurement",
    description: "Length, weight, volume, area, and temperature conversions",
    icon: "📏",
    categories: [...measurementCategories],
  },
  {
    id: "science",
    name: "Science",
    description: "Energy, power, pressure, and scientific unit conversions",
    icon: "⚗️",
    categories: [...scienceCategories],
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Voltage, current, resistance, capacitance, and electrical units",
    icon: "⚡",
    categories: [...electronicsCategories],
  },
  {
    id: "fitness-health",
    name: "Fitness & Health",
    description: "Body measurements, calories, heart rate, workout metrics, and health units",
    icon: "💪",
    categories: [...fitnessCategories, ...fitnessCustomCategories],
  },
  {
    id: "digital",
    name: "Digital",
    description: "Data storage, transfer rates, and digital conversions",
    icon: "💻",
    categories: [...digitalCategories, ...digitalCustomCategories],
  },
  {
    id: "transport",
    name: "Transport",
    description: "Speed, distance, fuel efficiency, and transportation units",
    icon: "🚗",
    categories: [...transportCategories],
  },
  {
    id: "specialty",
    name: "Specialty",
    description: "Photography, printing, colors, and specialized conversions",
    icon: "🎨",
    categories: [...specialtyCategories, ...specialtyCustomCategories],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Currency, loans, investments, and financial calculations",
    icon: "💰",
    categories: [...financeCategories, ...financeCustomCategories],
  },
];

export function getSectionById(sectionId: string): Section | undefined {
  return sections.find(section => section.id === sectionId);
}

export function getSectionByCategory(categoryId: string): Section | undefined {
  return sections.find(section => 
    section.categories.some(category => category.id === categoryId)
  );
}