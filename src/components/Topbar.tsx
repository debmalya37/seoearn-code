// src/components/Topbar.tsx
'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaBars } from 'react-icons/fa';
import NotificationBell from './NotificationBell';
import LanguageToggle from './LanguageToggle';

export interface TopbarProps {
  /** Called when the “hamburger” button is clicked */
  onToggleSidebar: () => void;
}

export default function Topbar() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-[#081530] backdrop-blur-lg border-b border-white/20 z-50 flex items-center px-4 text-white shadow-md">
      {/* Left: hamburger */}
      {/* <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-md text-white hover:bg-white/20 transition"
        aria-label="Toggle sidebar"
      >
        <FaBars className="w-5 h-5" />
      </button> */}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: notifications & language */}
      <div className="flex items-center space-x-4">
        <NotificationBell />
        <LanguageToggle />
      </div>
    </header>
  );
}
