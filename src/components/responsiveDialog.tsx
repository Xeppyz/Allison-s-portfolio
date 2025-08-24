import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ResponsiveModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function ResponsiveModal({
  open,
  onClose,
  title,
  children,
}: ResponsiveModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // breakpoint md
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Contenedor modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white shadow-xl transition-all duration-300 
          ${isMobile 
            ? "fixed bottom-0 left-0 right-0 rounded-t-2xl animate-slideUp" 
            : "rounded-2xl w-full max-w-lg mx-4 animate-fadeIn"}
        `}
      >
        {/* Header */}
        {title && (
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 rounded-full p-1 transition-colors"
              style={{ backgroundColor: "#F7F7F7", color: "#1E3A5F" }}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
