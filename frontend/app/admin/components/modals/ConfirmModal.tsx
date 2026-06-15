interface ConfirmModalProps {
  isOpen: boolean;
  darkMode: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  darkMode,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const subTxt = darkMode ? "#94A3B8" : "#64748B";
  const borderClr = darkMode ? "#334155" : "#ECEAF3";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: darkMode ? "#1E293B" : "#FFFFFF",
          borderRadius: 24,
          padding: "32px 36px",
          width: 360,
          textAlign: "center",
          border: `1px solid ${borderClr}`,
          boxShadow: "0 25px 60px rgba(0,0,0,.3)",
        }}
      >
        <div
          style={{
            fontSize: 52,
            marginBottom: 16,
          }}
        >
          👋
        </div>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: mainTxt,
            marginBottom: 8,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: subTxt,
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 14,
              border: `1.5px solid ${borderClr}`,
              background: "transparent",
              color: subTxt,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 14,
              border: "none",
              background:
                "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow:
                "0 4px 14px rgba(239,68,68,0.35)",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}