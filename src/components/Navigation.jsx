import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Button,
  Divider,
  Avatar,
  useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';

// Import logo using Vite's public asset handling
const logoUrl = new URL('/nilkanth-logo.png', import.meta.url).href;

const drawerWidth = 190;

const Navigation = () => {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const currentPath = location.pathname;
  
  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <HomeIcon />, 
      path: '/' 
    },
    { 
      text: 'Finance', 
      icon: <AccountBalanceIcon />, 
      path: '/finance' 
    },
    { 
      text: 'Inventory', 
      icon: <InventoryIcon />, 
      path: '/inventory' 
    },
    { 
      text: 'Products', 
      icon: <ShoppingCartIcon />, 
      path: '/products' 
    },
    { 
      text: 'Bills & Salary', 
      icon: <ReceiptIcon />, 
      path: '/bills-salary' 
    },
    {
      text: 'Generate Bill',
      icon: <ReceiptLongIcon />,
      path: '/bill-generator'
    }
  ];

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return '?';
    
    if (currentUser.username) {
      return currentUser.username.charAt(0).toUpperCase();
    }
    
    if (currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    
    return '?';
  };
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: '#1976d2',
          backgroundImage: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        },
      }}
    >
      <Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 3,
          pb: 4,
        }}>
          <Box
            sx={{
              width: '120px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)', // Makes the logo white
                transition: 'transform 0.3s ease'
              },
              '&:hover img': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <img
              src={logoUrl}
              alt="Nilkanth Logo"
            />
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
            Business Dashboard
          </Typography>
        </Box>
        
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => {
            const isActive = (
              (item.path === '/' && currentPath === '/') || 
              (item.path !== '/' && currentPath.startsWith(item.path))
            );
            
            return (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                disablePadding
                sx={{
                  pl: 3,
                  py: 2,
                  color: 'white',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  borderLeft: isActive ? '4px solid white' : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textDecoration: 'none'
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 35 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body2" fontWeight={isActive ? 500 : 400}>
                      {item.text}
                    </Typography>
                  } 
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
      
      {/* User profile and sign out section */}
      <Box sx={{ mt: 'auto', mb: 2, mx: 2 }}>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 2 }} />
        
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                color: theme.palette.primary.main,
                width: 32,
                height: 32,
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Box sx={{ ml: 1, overflow: 'hidden' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {currentUser.username || currentUser.email}
              </Typography>
              {currentUser.email && currentUser.username && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.7,
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentUser.email}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
};

export default Navigation; 