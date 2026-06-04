"use client";

import { useMemo, useState } from "react";
import { Product } from "../types/admin.types";

export default function useFilters(
  products: Product[]
) {
  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedProvince, setSelectedProvince] =
    useState("");

  const [selectedDemand, setSelectedDemand] =
    useState("");

  const [sortBy, setSortBy] =
    useState("");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* Category Filter */
    if (selectedCategory) {
      result = result.filter(
        (product) =>
          product.category ===
          selectedCategory
      );
    }

    /* Province Filter */
    if (selectedProvince) {
      result = result.filter(
        (product) =>
          product.province ===
          selectedProvince
      );
    }

    /* Demand Filter */
    if (selectedDemand) {
      result = result.filter(
        (product) =>
          product.demandLevel ===
          selectedDemand
      );
    }

    /* Sorting */
    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case "stock-low":
        result.sort(
          (a, b) =>
            a.stock - b.stock
        );
        break;

      case "stock-high":
        result.sort(
          (a, b) =>
            b.stock - a.stock
        );
        break;

      case "name":
        result.sort((a, b) =>
          a.name.localeCompare(
            b.name
          )
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedProvince,
    selectedDemand,
    sortBy,
  ]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedProvince("");
    setSelectedDemand("");
    setSortBy("");
  };

  return {
    filteredProducts,

    selectedCategory,
    setSelectedCategory,

    selectedProvince,
    setSelectedProvince,

    selectedDemand,
    setSelectedDemand,

    sortBy,
    setSortBy,

    clearFilters,
  };
}