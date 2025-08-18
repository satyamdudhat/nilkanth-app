import React from 'react';
import { Box } from '@mui/material';
import Navigation from '../components/Navigation';

const drawerWidth = 190;

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          ml: 0,
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: 'white',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 