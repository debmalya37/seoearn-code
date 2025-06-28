// src/components/NotificationBell.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useToast } from '@src/components/ui/use-toast';

interface Notification {
  _id: string;
  message: string;
  fromUsername: string;
  date: string;
  read: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/notifications');
        if (response.data.success) {
          setNotifications(response.data.notifications);
          // Show a toast for each unread notification
          response.data.notifications.forEach((notif: Notification) => {
            if (!notif.read) {
              toast({
                title: 'New Referral!',
                description: notif.message,
                variant: 'default',
              });
            }
          });
        }
      } catch (err) {
        const axiosErr = err as AxiosError;
        console.error('Error fetching notifications:', axiosErr.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark all as read (client-side only)
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block z-[9999]" 
      /* Very high z-index so it floats above all content */
    >
      {/* Bell Icon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-1 focus:outline-none"
      >
        <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors" />
        {loading && (
          <Loader2 className="absolute top-0 right-0 h-4 w-4 text-indigo-500 animate-spin" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-full max-w-xs sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999]">
          {/* 
            - left-0 aligns the dropdown’s left edge to the bell icon, 
              so it opens “to the right” of the bell.
            - max-w-xs ensures on very narrow screens it doesn’t overflow 
            - sm:w-64 fixes width to 16rem (256px) on sm+ 
            - z-[9999] to keep it atop all other content 
          */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-indigo-100 text-xs hover:underline focus:outline-none"
              >
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`px-4 py-3 border-b last:border-b-0 ${
                    !notif.read
                      ? 'bg-indigo-50 dark:bg-gray-700'
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <p
                    className={`text-sm ${
                      !notif.read ? 'font-semibold' : 'font-normal'
                    } text-gray-800 dark:text-gray-100`}
                  >
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(notif.date).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
