import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  useTheme,
  alpha,
  Divider,
  Stack
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import CategoryIcon from '@mui/icons-material/Category';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Import services
import {
  getAllIncome,
  getAllCOGS,
  getAllExpenses,
  calculateFinancialMetrics,
} from '../services/financeService';

import {
  getAllItemsSummary
} from '../services/inventoryService';

// Add product service import
import {
  getAllProducts,
  getProductCategories
} from '../services/productService';

// Import logo using Vite's public asset handling
const logoUrl = new URL('/nilkanth-logo.png', import.meta.url).href;

const Dashboard = () => {
  const theme = useTheme();
  
  // State for dashboard data
  const [financialMetrics, setFinancialMetrics] = useState({
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
  });
  
  const [inventorySummary, setInventorySummary] = useState({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0
  });
  
  // Add products state
  const [productsSummary, setProductsSummary] = useState({
    totalProducts: 0,
    categories: 0,
    topSellingProduct: null
  });
  
  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  // Load all dashboard data
  const loadDashboardData = () => {
    // Load financial data
    const incomeData = getAllIncome();
    const cogsData = getAllCOGS();
    const expenseData = getAllExpenses();
    
    // Calculate financial metrics
    const metrics = calculateFinancialMetrics(incomeData, cogsData, expenseData);
    setFinancialMetrics(metrics);
    
    // Load inventory data
    const inventoryItems = getAllItemsSummary();
    
    // Calculate inventory summary
    const lowStockItems = inventoryItems.filter(item => 
      item.minLevel && item.remaining > 0 && item.remaining <= parseFloat(item.minLevel)
    );
    
    const outOfStockItems = inventoryItems.filter(item => 
      item.remaining <= 0
    );
    
    // Calculate estimated inventory value (using cost from purchase data)
    const totalValue = inventoryItems.reduce((sum, item) => {
      // Simplified calculation - in a real app you might use average cost or FIFO
      const avgCost = item.totalCost ? item.totalCost / item.totalPurchased : 0;
      return sum + (avgCost * item.remaining);
    }, 0);
    
    setInventorySummary({
      totalItems: inventoryItems.length,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue
    });
    
    // Load products data (for demo, we'll use mock data)
    try {
      const products = getAllProducts();
      const categories = getProductCategories();
      
      // Find top selling product
      const topSelling = [...products].sort((a, b) => b.sales - a.sales)[0];
      
      setProductsSummary({
        totalProducts: products.length,
        categories: categories.length,
        topSellingProduct: topSelling
      });
    } catch (error) {
      console.error('Error loading products data:', error);
    }
  };
  
  return (
    <Container maxWidth="xl">
      {/* Header with Welcome Text */}
      <Box 
        sx={{ 
          mb: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pt: 4,
          pb: 3
        }}
      >
        {/* Welcome Text */}
        <Box sx={{ maxWidth: '800px', px: 2 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="600"
            sx={{ 
              color: theme.palette.primary.main,
              mb: 2
            }}
          >
            Welcome to Nilkanth Dashboard
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            Your comprehensive business management system for monitoring sales, inventory, and financial metrics at a glance.
          </Typography>
        </Box>
      </Box>
      
      {/* Financial Overview */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <AccountBalanceWalletIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h5" fontWeight="600">
            Financial Overview
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#4caf50', 0.08)} 0%, ${alpha('#4caf50', 0.01)} 100%)`,
              border: `1px solid ${alpha('#4caf50', 0.1)}`,
              borderLeft: `4px solid #4caf50`,
              boxShadow: `0 4px 12px ${alpha('#4caf50', 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha('#4caf50', 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#2e7d32' }}>
                  ₹{financialMetrics.revenue.toLocaleString()}
                </Typography>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon fontSize="small" sx={{ color: '#4caf50', mr: 0.5 }} />
                  <Typography variant="body2" color="#4caf50">
                    Income from all sales
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#f44336', 0.08)} 0%, ${alpha('#f44336', 0.01)} 100%)`,
              border: `1px solid ${alpha('#f44336', 0.1)}`,
              borderLeft: `4px solid #f44336`,
              boxShadow: `0 4px 12px ${alpha('#f44336', 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha('#f44336', 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#c62828' }}>
                  ₹{(financialMetrics.cogs + financialMetrics.expenses).toLocaleString()}
                </Typography>
                <Box display="flex" alignItems="center">
                  <ShoppingCartIcon fontSize="small" sx={{ color: '#f44336', mr: 0.5 }} />
                  <Typography variant="body2" color="#f44336">
                    COGS + Operating expenses
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Net Profit
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.primary.dark }}>
                  ₹{financialMetrics.netProfit.toLocaleString()}
                </Typography>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon fontSize="small" sx={{ color: theme.palette.primary.main, mr: 0.5 }} />
                  <Typography variant="body2" color={theme.palette.primary.main}>
                    Revenue minus all expenses
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#ff9800', 0.08)} 0%, ${alpha('#ff9800', 0.01)} 100%)`,
              border: `1px solid ${alpha('#ff9800', 0.1)}`,
              borderLeft: `4px solid #ff9800`,
              boxShadow: `0 4px 12px ${alpha('#ff9800', 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha('#ff9800', 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Profit Margin
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#e65100' }}>
                  {financialMetrics.revenue > 0 
                    ? `${((financialMetrics.netProfit / financialMetrics.revenue) * 100).toFixed(1)}%` 
                    : '0%'}
                </Typography>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon fontSize="small" sx={{ color: '#ff9800', mr: 0.5 }} />
                  <Typography variant="body2" color="#ff9800">
                    Net profit as % of revenue
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Inventory Overview */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <InventoryIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h5" fontWeight="600">
            Inventory Overview
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Items
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.primary.dark }}>
                  {inventorySummary.totalItems}
                </Typography>
                <Box display="flex" alignItems="center">
                  <InventoryIcon fontSize="small" sx={{ color: theme.palette.primary.main, mr: 0.5 }} />
                  <Typography variant="body2" color={theme.palette.primary.main}>
                    Active inventory items
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#ff9800', 0.08)} 0%, ${alpha('#ff9800', 0.01)} 100%)`,
              border: `1px solid ${alpha('#ff9800', 0.1)}`,
              borderLeft: `4px solid #ff9800`,
              boxShadow: `0 4px 12px ${alpha('#ff9800', 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha('#ff9800', 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Low Stock Items
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#e65100' }}>
                  {inventorySummary.lowStockItems}
                </Typography>
                <Box display="flex" alignItems="center">
                  <WarningIcon fontSize="small" sx={{ color: '#ff9800', mr: 0.5 }} />
                  <Typography variant="body2" color="#ff9800">
                    Items below minimum level
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#f44336', 0.08)} 0%, ${alpha('#f44336', 0.01)} 100%)`,
              border: `1px solid ${alpha('#f44336', 0.1)}`,
              borderLeft: `4px solid #f44336`,
              boxShadow: `0 4px 12px ${alpha('#f44336', 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha('#f44336', 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Out of Stock
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#c62828' }}>
                  {inventorySummary.outOfStockItems}
                </Typography>
                <Box display="flex" alignItems="center">
                  <WarningIcon fontSize="small" sx={{ color: '#f44336', mr: 0.5 }} />
                  <Typography variant="body2" color="#f44336">
                    Items with zero stock
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#4caf50', 0.08)} 0%, ${alpha('#4caf50', 0.01)} 100%)`,
              border: `1px solid ${alpha('#4caf50', 0.1)}`,
              borderLeft: `4px solid #4caf50`,
              boxShadow: `0 4px 12px ${alpha('#4caf50', 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha('#4caf50', 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Inventory Value
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#2e7d32' }}>
                  ₹{inventorySummary.totalValue.toLocaleString()}
                </Typography>
                <Box display="flex" alignItems="center">
                  <AccountBalanceWalletIcon fontSize="small" sx={{ color: '#4caf50', mr: 0.5 }} />
                  <Typography variant="body2" color="#4caf50">
                    Estimated value of stock
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Products Overview */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <StorefrontIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h5" fontWeight="600">
            Products Overview
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Products
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.primary.dark }}>
                  {productsSummary.totalProducts}
                </Typography>
                <Box display="flex" alignItems="center">
                  <ShoppingCartIcon fontSize="small" sx={{ color: theme.palette.primary.main, mr: 0.5 }} />
                  <Typography variant="body2" color={theme.palette.primary.main}>
                    Active product catalog
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#ff9800', 0.08)} 0%, ${alpha('#ff9800', 0.01)} 100%)`,
              border: `1px solid ${alpha('#ff9800', 0.1)}`,
              borderLeft: `4px solid #ff9800`,
              boxShadow: `0 4px 12px ${alpha('#ff9800', 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha('#ff9800', 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Product Categories
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#e65100' }}>
                  {productsSummary.categories}
                </Typography>
                <Box display="flex" alignItems="center">
                  <CategoryIcon fontSize="small" sx={{ color: '#ff9800', mr: 0.5 }} />
                  <Typography variant="body2" color="#ff9800">
                    Distinct product categories
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#4caf50', 0.08)} 0%, ${alpha('#4caf50', 0.01)} 100%)`,
              border: `1px solid ${alpha('#4caf50', 0.1)}`,
              borderLeft: `4px solid #4caf50`,
              boxShadow: `0 4px 12px ${alpha('#4caf50', 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 24px ${alpha('#4caf50', 0.1)}`,
              }
            }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Top Selling Product
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#2e7d32', height: '60px', overflow: 'hidden' }}>
                  {productsSummary.topSellingProduct?.name || 'N/A'}
                </Typography>
                <Box display="flex" alignItems="center">
                  <LocalOfferIcon fontSize="small" sx={{ color: '#4caf50', mr: 0.5 }} />
                  <Typography variant="body2" color="#4caf50">
                    {productsSummary.topSellingProduct ? `${productsSummary.topSellingProduct.sales} units sold` : 'No sales data'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 