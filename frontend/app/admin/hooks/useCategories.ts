"use client";

import {
  useEffect,
  useState,
} from "react";

export default function useCategories() {
  const defaultCategories = [
  "Beverages",
  "Dairy",
  "Bakery",
  "Groceries",
];
const [categories, setCategories] =
  useState<string[]>([]);
 /* Load Categories */
useEffect(() => {
  const savedCategories =
    localStorage.getItem(
      "forecast-categories"
    );

  if (savedCategories) {
    setCategories(
      JSON.parse(savedCategories)
    );
  } else {
    setCategories(defaultCategories);
  }
}, []);
/* Save Categories */
useEffect(() => {
  localStorage.setItem(
    "forecast-categories",
    JSON.stringify(categories)
  );
}, [categories]);

  const addCategory = (
    categoryName: string
  ) => {
    const trimmedName =
      categoryName.trim();

    if (!trimmedName) return false;

    const exists =
      categories.some(
        (category) =>
          category.toLowerCase() ===
          trimmedName.toLowerCase()
      );

    if (exists) {
      return false;
    }

    setCategories((prev) => [
      ...prev,
      trimmedName,
    ]);

    return true;
  };

  const deleteCategory = (
    categoryName: string
  ) => {
    setCategories((prev) =>
      prev.filter(
        (category) =>
          category !== categoryName
      )
    );
  };

  const categoryExists = (
    categoryName: string
  ) => {
    return categories.some(
      (category) =>
        category.toLowerCase() ===
        categoryName.toLowerCase()
    );
  };

  return {
    categories,

    addCategory,
    deleteCategory,
    categoryExists,
  };
}