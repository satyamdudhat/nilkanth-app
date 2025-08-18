import React from 'react';
import { Box, Card, Typography, alpha, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoneyIcon from '@mui/icons-material/Money';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';

const MetricsCard = ({ title, value, type }) => {
  const theme = useTheme();
  
  // Configuration for different card types
  const cardConfig = {
    revenue: {
      color: '#4caf50',
      darkColor: '#2e7d32',
      icon: <MoneyIcon />,
      label: 'Total Income',
      tag: 'Income'
    },
    cogs: {
      color: '#ff9800',
      darkColor: '#e65100',
      icon: <LocalMallIcon />,
      label: 'Product Costs',
      tag: 'COGS'
    },
    grossProfit: {
      color: '#2196f3',
      darkColor: '#0d47a1',
      icon: <TrendingUpIcon />,
      label: 'Before Expenses',
      tag: 'GP'
    },
    expenses: {
      color: '#f44336',
      darkColor: '#b71c1c',
      icon: <ReceiptIcon />,
      label: 'Operating Costs',
      tag: 'Expenses'
    },
    netProfit: {
      color: '#9c27b0',
      darkColor: '#4a148c',
      icon: <AccountBalanceWalletIcon />,
      label: 'Final Profit',
      tag: 'Profit'
    }
  };
  
  const config = cardConfig[type] || cardConfig.revenue;
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        border: `1px solid ${alpha(config.color, 0.2)}`,
        boxShadow: 'none',
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: config.color,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: -10,
          right: 16,
          backgroundColor: alpha(config.color, 0.1),
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: config.color,
          border: `1px solid ${alpha(config.color, 0.2)}`,
        }}
      >
        {config.icon}
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          gutterBottom
        >
          {title}
        </Typography>
        
        <Typography 
          variant="h5" 
          component="div"
          fontWeight="bold" 
          sx={{ 
            mb: 1,
            color: config.darkColor,
          }}
        >
          ₹{value.toLocaleString()}
        </Typography>
        
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component="span" 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: config.color,
                display: 'inline-block',
                mr: 1
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500, 
                fontSize: '0.75rem',
              }}
            >
              {config.label}
            </Typography>
          </Box>
          
          <Box
            sx={{
              ml: 'auto',
              backgroundColor: alpha(config.color, 0.1),
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: config.color,
                fontWeight: 'medium',
                fontSize: '0.7rem',
              }}
            >
              {config.tag}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default MetricsCard; 