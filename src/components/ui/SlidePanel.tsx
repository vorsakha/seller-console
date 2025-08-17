import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlidePanel({
  isOpen,
  onClose,
  title,
  children,
}: SlidePanelProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [renderOpen, setRenderOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setRenderOpen(false);
    } else {
      setRenderOpen(false);

      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setShouldRender(false);
        timeoutRef.current = null;
      }, 300);
    }

    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);

        timeoutRef.current = null;
      }
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen && shouldRender) {
      const timer = setTimeout(() => {
        setRenderOpen(true);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gray-500/50 transition-opacity duration-300 ${
            renderOpen ? "opacity-75" : "opacity-0"
          }`}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClose();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close panel"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div
            className={`pointer-events-auto w-screen max-w-md transition ease-in-out duration-300 ${
              renderOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                <h2 id={title} className="text-lg font-medium text-gray-900">
                  {title}
                </h2>
                <button
                  type="button"
                  className="rounded-md bg-white cursor-pointer text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={onClose}
                  aria-label="Close dialog"
                >
                  Close
                </button>
              </div>

              <div className="relative flex-1 px-4 py-6 sm:px-6 overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
