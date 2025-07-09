// src/components/ui/Modal.tsx
import React, { ReactNode } from 'react';

interface ModalProps {
  open?: boolean;          // ← make this optional
  onClose: () => void;
  children: ReactNode;
}

export function Modal({
  open = true,             // ← default to `true`
  onClose,
  children,
}: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
