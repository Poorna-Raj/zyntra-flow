"use client";

import { useState } from "react";

interface CategoryManagerProps {
  darkMode: boolean;
}

export default function CategoryManager({
  darkMode,
}: CategoryManagerProps) {
  const [categories, setCategories] =
    useState<string[]>([
      "Beverages",
      "Dairy",
      "Bakery",
      "Groceries",
    ]);

  const [newCategory, setNewCategory] =
    useState("");

  const cardBg = darkMode ? "#1E293B" : "#FFFFFF";
  const borderClr = darkMode ? "#334155" : "#E2E8F0";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const subTxt = darkMode ? "#94A3B8" : "#64748B";

  const addCategory = () => {
    if (!newCategory.trim()) return;

    if (
      categories.includes(
        newCategory.trim()
      )
    ) {
      alert("Category already exists");
      return;
    }

    setCategories((prev) => [
      ...prev,
      newCategory.trim(),
    ]);

    setNewCategory("");
  };

  const deleteCategory = (
    category: string
  ) => {
    const confirmed = window.confirm(
      `Delete "${category}" category?`
    );

    if (!confirmed) return;

    setCategories((prev) =>
      prev.filter(
        (item) => item !== category
      )
    );
  };

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 24,
        padding: "2rem",
        border: `1px solid ${borderClr}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            color: mainTxt,
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Category Manager
        </h2>

        <p
          style={{
            color: subTxt,
            fontSize: 14,
          }}
        >
          Manage product categories
        </p>
      </div>

      {/* Add Category */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          value={newCategory}
          placeholder="New category name"
          onChange={(e) =>
            setNewCategory(
              e.target.value
            )
          }
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 12,
            border: `1px solid ${borderClr}`,
            background: darkMode
              ? "#0F172A"
              : "#FFFFFF",
            color: mainTxt,
            outline: "none",
          }}
        />

        <button
          onClick={addCategory}
          style={{
            padding:
              "12px 20px",
            border: "none",
            borderRadius: 12,
            background:
              "linear-gradient(135deg,#38BDF8,#2563EB)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        {categories.map(
          (category) => (
            <div
              key={category}
              style={{
                padding:
                  "12px 16px",
                borderRadius: 14,
                border: `1px solid ${borderClr}`,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: mainTxt,
                  fontWeight: 600,
                }}
              >
                {category}
              </span>

              <button
                onClick={() =>
                  deleteCategory(
                    category
                  )
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color: "#EF4444",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Delete
              </button>
            </div>
          )
        )}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding:
              "2rem 1rem",
            color: subTxt,
          }}
        >
          No categories available.
        </div>
      )}
    </div>
  );
}