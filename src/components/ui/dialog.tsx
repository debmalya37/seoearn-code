// src/components/ui/dialog.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  );
}

export function DialogContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="px-6 py-4 border-b dark:border-gray-700">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{children}</h2>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="px-6 py-4 border-t dark:border-gray-700 flex justify-end space-x-2">{children}</div>;
}
