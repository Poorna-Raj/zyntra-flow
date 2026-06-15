import { useEffect, useState } from "react";
import { Product, ProductFormData } from "../../types/admin.types";
import {
  categoryOptions,
  provinceOptions,
  demandOptions,
  sortOptions,
} from "../../constants/admin.data";



interface ProductCardProps {
  product: Product;
  darkMode: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductCard({
  product,
  darkMode,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const cardBg = darkMode ? "#1E293B" : "#FFFFFF";
  const borderClr = darkMode ? "#334155" : "#ECEAF3";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const subTxt = darkMode ? "#94A3B8" : "#64748B";

  const getDemandColor = () => {
    switch (product.demandLevel) {
      case "High":
        return {
          bg: "rgba(34,197,94,0.12)",
          color: "#16A34A",
        };

      case "Medium":
        return {
          bg: "rgba(250,204,21,0.15)",
          color: "#CA8A04",
        };

      default:
        return {
          bg: "rgba(239,68,68,0.12)",
          color: "#DC2626",
        };
    }
  };

  const demandStyle = getDemandColor();

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${borderClr}`,
        transition: "all .2s ease",
        boxShadow: darkMode
          ? "0 10px 30px rgba(0,0,0,0.25)"
          : "0 10px 25px rgba(15,23,42,0.06)",
      }}
    >
      {/* Product Image */}
      <div
        style={{
          height: 220,
          overflow: "hidden",
          background: "#F8FAFC",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Product Content */}
      <div
        style={{
          padding: "1.3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.8rem",
          }}
        >
          <h3
            style={{
              color: mainTxt,
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            {product.name}
          </h3>

          <span
            style={{
              padding: "6px 12px",
              borderRadius: 99,
              background: demandStyle.bg,
              color: demandStyle.color,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {product.demandLevel}
          </span>
        </div>

        <p
          style={{
            color: subTxt,
            fontSize: 14,
            marginBottom: "1rem",
          }}
        >
          {product.category}
        </p>

        <div
          style={{
            display: "grid",
            gap: 8,
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: subTxt }}>
              Price
            </span>

            <strong
              style={{
                color: mainTxt,
              }}
            >
              Rs. {product.price.toLocaleString()}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: subTxt }}>
              Stock
            </span>

            <strong
              style={{
                color: mainTxt,
              }}
            >
              {product.stock}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: subTxt }}>
              Province
            </span>

            <strong
              style={{
                color: mainTxt,
              }}
            >
              {product.province}
            </strong>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={() => onEdit(product)}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#38BDF8,#2563EB)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(product.id)}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#EF4444,#DC2626)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


interface ProductGridProps {
  products: Product[];
  darkMode: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductGrid({
  products,
  darkMode,
  onEdit,
  onDelete,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          borderRadius: 24,
          border: `1px dashed ${
            darkMode ? "#334155" : "#CBD5E1"
          }`,
          color: darkMode ? "#94A3B8" : "#64748B",
        }}
      >
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
          }}
        >
          📦
        </div>

        <h3
          style={{
            marginBottom: "0.5rem",
          }}
        >
          No Products Found
        </h3>

        <p>
          Try changing your filters or add a new
          product.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          darkMode={darkMode}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}


interface ProductFiltersProps {
  darkMode: boolean;

  selectedCategory: string;
  setSelectedCategory: (value: string) => void;

  selectedProvince: string;
  setSelectedProvince: (value: string) => void;

  selectedDemand: string;
  setSelectedDemand: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  clearFilters: () => void;
}

export function ProductFilters({
  darkMode,
  selectedCategory,
  setSelectedCategory,
  selectedProvince,
  setSelectedProvince,
  selectedDemand,
  setSelectedDemand,
  sortBy,
  setSortBy,
  clearFilters,
}: ProductFiltersProps) {
  const cardBg = darkMode ? "#1E293B" : "#FFFFFF";
  const borderClr = darkMode ? "#334155" : "#E2E8F0";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";

  const selectStyle: React.CSSProperties = {
    padding: "12px",
    borderRadius: 12,
    border: `1px solid ${borderClr}`,
    background: cardBg,
    color: mainTxt,
    minWidth: 180,
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 24,
        padding: "1.5rem",
        border: `1px solid ${borderClr}`,
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            All Categories
          </option>

          {categoryOptions.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        {/* Province */}
        <select
          value={selectedProvince}
          onChange={(e) =>
            setSelectedProvince(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            All Provinces
          </option>

          {provinceOptions.map((province) => (
            <option
              key={province}
              value={province}
            >
              {province}
            </option>
          ))}
        </select>

        {/* Demand */}
        <select
          value={selectedDemand}
          onChange={(e) =>
            setSelectedDemand(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            All Demand Levels
          </option>

          {demandOptions.map((demand) => (
            <option
              key={demand}
              value={demand}
            >
              {demand}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            Sort By
          </option>

          {sortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Button */}
        <button
          onClick={clearFilters}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background:
              "linear-gradient(135deg,#EF4444,#DC2626)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}



interface ProductFormProps {
  darkMode: boolean;
  categories: string[];
  initialData?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({
  darkMode,
  categories,
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

            <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  style={inputStyle(
    inputBg,
    borderClr,
    mainTxt
  )}
>
  <option value="">
    Select Category
  </option>

  {categories.map((category) => (
    <option
      key={category}
      value={category}
    >
      {category}
    </option>
  ))}
</select>
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




interface CategoryManagerProps {
  darkMode: boolean;
}

export function CategoryManager({
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