"use client";

import { useEffect, useState } from "react";
import {
  Product,
  ProductFormData,
} from "../../types/admin.types";

interface ProductFormProps {
  darkMode: boolean;
  initialData?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export default function ProductForm({
  darkMode,
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const cardBg = darkMode ? "#1E293B" : "#FFFFFF";
  const borderClr = darkMode ? "#334155" : "#E2E8F0";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const inputBg = darkMode ? "#0F172A" : "#FFFFFF";

  const [formData, setFormData] =
    useState<ProductFormData>({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      image: "",
      province: "",
      demandLevel: "Medium",
    });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        stock: initialData.stock,
        image: initialData.image,
        province: initialData.province,
        demandLevel: initialData.demandLevel,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.province
    ) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit(formData);
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
      <h2
        style={{
          color: mainTxt,
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      >
        {initialData
          ? "Edit Product"
          : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "1rem",
          }}
        >
          {/* Product Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: mainTxt,
                fontWeight: 600,
              }}
            >
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              style={inputStyle(
                inputBg,
                borderClr,
                mainTxt
              )}
            />
          </div>

          {/* Category */}
          <div>
            <label
              style={labelStyle(mainTxt)}
            >
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Beverages"
              style={inputStyle(
                inputBg,
                borderClr,
                mainTxt
              )}
            />
          </div>

          {/* Price */}
          <div>
            <label
              style={labelStyle(mainTxt)}
            >
              Price (Rs.)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={inputStyle(
                inputBg,
                borderClr,
                mainTxt
              )}
            />
          </div>

          {/* Stock */}
          <div>
            <label
              style={labelStyle(mainTxt)}
            >
              Stock Quantity
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              style={inputStyle(
                inputBg,
                borderClr,
                mainTxt
              )}
            />
          </div>

          {/* Province */}
          <div>
            <label
              style={labelStyle(mainTxt)}
            >
              Province
            </label>

            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              style={inputStyle(
                inputBg,
                borderClr,
                mainTxt
              )}
            >
              <option value="">
                Select Province
              </option>
              <option value="Western">
                Western
              </option>
              <option value="Central">
                Central
              </option>
              <option value="Southern">
                Southern
              </option>
              <option value="Northern">
                Northern
              </option>
            </select>
          </div>

          {/* Demand */}
          <div>
            <label
              style={labelStyle(mainTxt)}
            >
              Demand Level
            </label>

            <select
              name="demandLevel"
              value={formData.demandLevel}
              onChange={handleChange}
              style={inputStyle(
                inputBg,
                borderClr,
                mainTxt
              )}
            >
              <option value="High">
                High
              </option>
              <option value="Medium">
                Medium
              </option>
              <option value="Low">
                Low
              </option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div
          style={{
            marginTop: "1rem",
          }}
        >
          <label
            style={labelStyle(mainTxt)}
          >
            Image URL
          </label>

          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
            style={inputStyle(
              inputBg,
              borderClr,
              mainTxt
            )}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#38BDF8,#2563EB)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {initialData
              ? "Update Product"
              : "Add Product"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: `1px solid ${borderClr}`,
              background: "transparent",
              color: mainTxt,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = (
  color: string
): React.CSSProperties => ({
  display: "block",
  marginBottom: 6,
  color,
  fontWeight: 600,
});

const inputStyle = (
  bg: string,
  border: string,
  color: string
): React.CSSProperties => ({
  width: "100%",
  padding: "12px",
  borderRadius: 12,
  border: `1px solid ${border}`,
  background: bg,
  color,
  outline: "none",
});