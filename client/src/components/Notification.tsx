// Enterprise Mall - Notification Component
// Global toast notification display using shared Zustand store
// Lightweight design: white bg + colored left border strip (Notion/Linear style)

import React from 'react';
import { Box, Typography, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotificationStore } from '../stores/notificationStore';

/** Color map for notification severity — used for left border strip */
const severityColors: Record<string, string> = {
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
};

/** Icon labels for notification severity */
const severityIcons: Record<string, string> = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
};

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', top: 80, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {notifications.map((notification) => {
        const borderColor = severityColors[notification.type] || severityColors.info;
        const iconLabel = severityIcons[notification.type] || severityIcons.info;
        return (
          <Fade key={notification.id} in={true}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#ffffff',
                borderLeft: `3px solid ${borderColor}`,
                borderRadius: 2,
                px: 2,
                py: 1.25,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                minWidth: 280,
                maxWidth: 400,
                transition: 'all 0.3s ease',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: borderColor,
                  fontSize: '0.9rem',
                  minWidth: 16,
                }}
              >
                {iconLabel}
              </Typography>
              <Typography variant="body2" sx={{ flex: 1, color: '#333' }}>
                {notification.message}
              </Typography>
              <IconButton
                size="small"
                onClick={() => removeNotification(notification.id)}
                sx={{
                  p: 0.25,
                  color: '#999',
                  '&:hover': {
                    color: '#666',
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Fade>
        );
      })}
    </Box>
  );
};

export default Notification;
