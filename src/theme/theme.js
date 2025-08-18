import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976d2',
    accent: '#f50057',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#334155',
    disabled: '#64748b',
    placeholder: '#94a3b8',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  },
  roundness: 12,
};