"use client";

import { useState } from "react";

import ProductForm from "../components/products/ProductForm";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilters from "../components/products/ProductFilters";
import CategoryManager from "../components/products/CategoryManager";

import useProducts from "../hooks/useProducts";
import useFilters from "../hooks/useFilters";

import {
  Product,
  ProductFormData,
} from "../types/admin.types";

export default function ProductsPage() {
  const [darkMode] = useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const {
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
  } = useFilters(products);

  const handleAddProduct = (
    data: ProductFormData
  ) => {
    addProduct(data);
    setShowForm(false);
  };

  const handleUpdateProduct = (
    data: ProductFormData
  ) => {
    if (!editingProduct) return;

    updateProduct(
      editingProduct.id,
      data
    );

    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (
    product: Product
  ) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (
    productId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    deleteProduct(productId);
  };

  return (
    <div
      style={{
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
            }}
          >
            Product Management
          </h1>

          <p
            style={{
              color: "#64748B",
              marginTop: 8,
            }}
          >
            Manage products,
            categories and inventory.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          style={{
            padding:
              "12px 20px",
            border: "none",
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#38BDF8,#2563EB)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <ProductFilters
        darkMode={darkMode}
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          setSelectedCategory
        }
        selectedProvince={
          selectedProvince
        }
        setSelectedProvince={
          setSelectedProvince
        }
        selectedDemand={
          selectedDemand
        }
        setSelectedDemand={
          setSelectedDemand
        }
        sortBy={sortBy}
        setSortBy={setSortBy}
        clearFilters={
          clearFilters
        }
      />

      {/* Product Form */}
      {showForm && (
        <div
          style={{
            marginBottom: "2rem",
          }}
        >
          <ProductForm
            darkMode={darkMode}
            initialData={
              editingProduct
            }
            onSubmit={
              editingProduct
                ? handleUpdateProduct
                : handleAddProduct
            }
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(
                null
              );
            }}
          />
        </div>
      )}

      {/* Products */}
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <ProductGrid
          products={
            filteredProducts
          }
          darkMode={darkMode}
          onEdit={handleEdit}
          onDelete={
            handleDelete
          }
        />
      </div>

      {/* Categories */}
      <CategoryManager
        darkMode={darkMode}
      />
    </div>
  );
}