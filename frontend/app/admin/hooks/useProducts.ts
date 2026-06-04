"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Product,
  ProductFormData,
} from "../types/admin.types";

const initialProducts: Product[] = [
  {
    id: "P001",
    name: "Coca Cola",
    category: "Beverages",
    price: 450,
    stock: 120,
    image:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e",
    province: "Western",
    demandLevel: "High",
    createdAt: new Date().toISOString(),
  },
  {
    id: "P002",
    name: "Milk Powder",
    category: "Dairy",
    price: 1800,
    stock: 80,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    province: "Central",
    demandLevel: "Medium",
    createdAt: new Date().toISOString(),
  },
];

export default function useProducts() {
  const [products, setProducts] =
  useState<Product[]>([]);
  /* Load Products */
useEffect(() => {
  const savedProducts =
    localStorage.getItem(
      "forecast-products"
    );

  if (savedProducts) {
    setProducts(
      JSON.parse(savedProducts)
    );
  } else {
    setProducts(initialProducts);
  }
}, []);

  const [searchTerm, setSearchTerm] =
    useState("");
    /* Save Products */
useEffect(() => {
  if (products.length > 0) {
    localStorage.setItem(
      "forecast-products",
      JSON.stringify(products)
    );
  }
}, [products]);

  /* Add Product */
  const addProduct = (
    productData: ProductFormData
  ) => {
    const newProduct: Product = {
      id: `P${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [
      newProduct,
      ...prev,
    ]);
  };

  /* Update Product */
  const updateProduct = (
    productId: string,
    productData: ProductFormData
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...productData,
            }
          : product
      )
    );
  };

  /* Delete Product */
  const deleteProduct = (
    productId: string
  ) => {
    setProducts((prev) =>
      prev.filter(
        (product) =>
          product.id !== productId
      )
    );
  };

  /* Search */
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    return products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );
  }, [products, searchTerm]);

  return {
    products,
    filteredProducts,

    searchTerm,
    setSearchTerm,

    addProduct,
    updateProduct,
    deleteProduct,
  };
}