import { Product } from "../../types/product.types";

interface ProductCardProps {
  product: Product;
  darkMode: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductCard({
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