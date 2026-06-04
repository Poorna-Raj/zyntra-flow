import ProductCard from "./ProductCard";
import { Product } from "../../types/product.types";

interface ProductGridProps {
  products: Product[];
  darkMode: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductGrid({
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