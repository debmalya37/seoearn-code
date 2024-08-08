// types/NotificationTypes.ts

export interface Notifications {
    id: string;
    message: string;
    timestamp: string;
    type: 'info' | 'warning' | 'success' | 'error'; // Example types
    user: {
      id: string;
      name: string;
      avatar?: string; // URL to the user's avatar image
    };
  }
  
  export interface NotificationProps {
    notifications: Notification[];
  }
  