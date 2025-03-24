import type React from 'react';

import { theme } from '../../style';

type NotificationProps = {
  message: string;
};

export const Notification: React.FC<NotificationProps> = ({ message }) => (
  <div
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: theme.noticeBackground || '#4CAF50',
      color: theme.noticeText || 'white',
      padding: '10px',
      borderRadius: '4px',
      zIndex: 1000,
    }}
  >
    {message}
  </div>
);
