import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Typography,
  Button,
  useTheme,
  alpha,
  Chip,
  TableSortLabel,
  Stack,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import WifiIcon from '@mui/icons-material/Wifi';
import WorkIcon from '@mui/icons-material/Work';
import CampaignIcon from '@mui/icons-material/Campaign';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BuildIcon from '@mui/icons-material/Build';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { formatCurrency, formatDate } from '../../utils/formatters';
import NoTransactionsIcon from '@mui/icons-material/ReceiptLong';

const TransactionHistory = ({ 
  incomeData, 
  cogsData, 
  expenseData, 
  selectedYear = 'all', 
  selectedMonth = 'all' 
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Increased to 10 rows default
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'this-week', 'this-month'
  const [isYearMonthFilterActive, setIsYearMonthFilterActive] = useState(false);

  // Check if year/month filters are active
  useEffect(() => {
    setIsYearMonthFilterActive(selectedYear !== 'all' || selectedMonth !== 'all');
    // Reset to first page when filters change
    setPage(1);
  }, [selectedYear, selectedMonth]);

  // Reset active tab when component mounts to ensure consistent behavior
  useEffect(() => {
    setActiveTab('all');
  }, []);

  // Find latest transaction when data changes
  useEffect(() => {
    // Get all transactions
    const allTransactions = [
      ...incomeData.map(item => ({ ...item, type: 'income' })),
      ...cogsData.map(item => ({ ...item, type: 'cogs' })),
      ...expenseData.map(item => ({ ...item, type: 'expense' }))
    ];
    
    // Sort by date (newest first)
    const sorted = allTransactions.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    // Set latest transaction
    setLatestTransaction(sorted.length > 0 ? sorted[0] : null);
  }, [incomeData, cogsData, expenseData]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1); // Reset to first page on tab change
  };

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle date filter change
  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    setPage(1); // Reset to first page on filter change
  };

  // Filter transactions by year and month from parent component
  const filterTransactionsByYearMonth = (transactions) => {
    if (selectedYear === 'all' && selectedMonth === 'all') return transactions;
    
    return transactions.filter(item => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear().toString();
      const itemMonth = itemDate.getMonth().toString();
      
      const yearMatch = selectedYear === 'all' || itemYear === selectedYear;
      const monthMatch = selectedMonth === 'all' || itemMonth === selectedMonth;
      
      return yearMatch && monthMatch;
    });
  };

  // Filter transactions by date
  const filterTransactionsByDate = (transactions) => {
    if (dateFilter === 'all') return transactions;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(transaction => {
      const txDate = new Date(transaction.date);
      
      if (dateFilter === 'today') {
        // Today's transactions
        return txDate.getDate() === today.getDate() && 
               txDate.getMonth() === today.getMonth() && 
               txDate.getFullYear() === today.getFullYear();
      }
      
      if (dateFilter === 'this-week') {
        // This week's transactions
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return txDate >= oneWeekAgo;
      }
      
      if (dateFilter === 'this-month') {
        // This month's transactions
        return txDate.getMonth() === today.getMonth() && 
               txDate.getFullYear() === today.getFullYear();
      }
      
      if (dateFilter === 'this-year') {
        // This year's transactions
        return txDate.getFullYear() === today.getFullYear();
      }
      
      return true;
    });
  };

  // Get all transactions based on active tab
  const getVisibleTransactions = () => {
    // Get raw data based on selected tab
    let transactions = [];
    
    if (activeTab === 'all') {
      // For "All Transactions" tab, include all transaction types
      transactions = [
        ...incomeData.map(item => ({ ...item, type: 'income' })),
        ...cogsData.map(item => ({ ...item, type: 'cogs' })),
        ...expenseData.map(item => ({ ...item, type: 'expense' }))
      ];
    } else if (activeTab === 'income') {
      transactions = [...incomeData.map(item => ({ ...item, type: 'income' }))];
    } else if (activeTab === 'cogs') {
      transactions = [...cogsData.map(item => ({ ...item, type: 'cogs' }))];
    } else if (activeTab === 'expense') {
      transactions = [...expenseData.map(item => ({ ...item, type: 'expense' }))];
    }
    
    // Apply year/month filters from parent component first
    transactions = filterTransactionsByYearMonth(transactions);
    
    // Then apply date range filter if not using year/month filters
    if (!isYearMonthFilterActive) {
      transactions = filterTransactionsByDate(transactions);
    }
    
    // Sort transactions
    return sortTransactions(transactions);
  };

  // Get transactions with latest always included
  const getTransactionsWithLatest = () => {
    const visibleTransactions = getVisibleTransactions();
    
    // If we have a latest transaction and it's not already in the visible transactions
    // (because it doesn't match the active tab), add it to the list
    if (latestTransaction && !isYearMonthFilterActive) {
      const isLatestAlreadyIncluded = visibleTransactions.some(
        transaction => 
          transaction.id === latestTransaction.id && 
          transaction.type === latestTransaction.type
      );
      
      if (!isLatestAlreadyIncluded && activeTab !== 'all') {
        // Add the latest transaction to the top of the list
        return [latestTransaction, ...visibleTransactions];
      }
    }
    
    return visibleTransactions;
  };

  // Sort transactions based on orderBy and order
  const sortTransactions = (transactions) => {
    return transactions.sort((a, b) => {
      // For date sorting
      if (orderBy === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return (order === 'asc' ? dateA - dateB : dateB - dateA);
      }
      
      // For amount sorting
      if (orderBy === 'amount') {
        return (order === 'asc' ? a.amount - b.amount : b.amount - a.amount);
      }
      
      // For text-based fields (description, category, type)
      if (['description', 'category', 'type'].includes(orderBy)) {
        const valueA = a[orderBy].toLowerCase();
        const valueB = b[orderBy].toLowerCase();
        return (order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA));
      }
      
      return 0;
    });
  };

  // Get pagination slice
  const getPaginatedTransactions = () => {
    const sorted = getTransactionsWithLatest();
    const startIndex = (page - 1) * rowsPerPage;
    return sorted.slice(startIndex, startIndex + rowsPerPage);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1); // Reset to first page when changing rows per page
  };

  // Get total pages
  const transactions = getTransactionsWithLatest();
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  // Format date filter label
  const getDateFilterLabel = () => {
    if (selectedYear !== 'all' || selectedMonth !== 'all') {
      const yearLabel = selectedYear === 'all' ? 'All Years' : selectedYear;
      let monthLabel = 'All Months';
      
      if (selectedMonth !== 'all') {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthLabel = monthNames[parseInt(selectedMonth)];
      }
      
      return `${monthLabel} ${yearLabel}`;
    }
    
    return 'All Time';
  };

  // Get icon for transaction category
  const getCategoryIcon = (category, type) => {
    const iconProps = { fontSize: 'small', sx: { mr: 1 } };
    
    // Income categories
    if (type === 'income') {
      switch (category) {
        case 'sales': return <PaidIcon {...iconProps} />;
        case 'service': return <ReceiptIcon {...iconProps} />;
        case 'rent': return <HomeIcon {...iconProps} />;
        case 'interest': return <AttachMoneyIcon {...iconProps} />;
        default: return <HelpOutlineIcon {...iconProps} />;
      }
    }
    
    // COGS categories
    if (type === 'cogs') {
      switch (category) {
        case 'raw_materials': return <InventoryIcon {...iconProps} />;
        case 'direct_labor': return <WorkIcon {...iconProps} />;
        case 'packaging': return <InventoryIcon {...iconProps} />;
        case 'manufacturing': return <BuildIcon {...iconProps} />;
        case 'delivery': return <LocalShippingIcon {...iconProps} />;
        default: return <ShoppingCartIcon {...iconProps} />;
      }
    }
    
    // Expense categories
    if (type === 'expense') {
      switch (category) {
        case 'rent': return <HomeIcon {...iconProps} />;
        case 'utilities': return <WifiIcon {...iconProps} />;
        case 'salary': return <WorkIcon {...iconProps} />;
        case 'marketing': return <CampaignIcon {...iconProps} />;
        case 'insurance': return <HealthAndSafetyIcon {...iconProps} />;
        case 'maintenance': return <BuildIcon {...iconProps} />;
        case 'office': return <LocalPrintshopIcon {...iconProps} />;
        case 'transportation': return <DirectionsCarIcon {...iconProps} />;
        default: return <AccountBalanceWalletIcon {...iconProps} />;
      }
    }
    
    return <CategoryIcon {...iconProps} />;
  };

  // Get transaction type icon and color
  const getTransactionTypeInfo = (type) => {
    if (type === 'income') {
      return {
        icon: <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />,
        color: theme.palette.success.main,
        lightColor: alpha(theme.palette.success.main, 0.1),
        label: 'Income'
      };
    } else if (type === 'cogs') {
      return {
        icon: <ShoppingCartIcon fontSize="small" sx={{ mr: 1 }} />,
        color: theme.palette.warning.main,
        lightColor: alpha(theme.palette.warning.main, 0.1),
        label: 'COGS'
      };
    } else {
      return {
        icon: <AccountBalanceWalletIcon fontSize="small" sx={{ mr: 1 }} />,
        color: theme.palette.error.main,
        lightColor: alpha(theme.palette.error.main, 0.1),
        label: 'Expense'
      };
    }
  };

  // Format category label
  const formatCategoryLabel = (category) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Check if transaction is the latest
  const isLatestTransaction = (transaction) => {
    return latestTransaction && transaction.id === latestTransaction.id && transaction.type === latestTransaction.type;
  };

  const displayedTransactions = getPaginatedTransactions();

  return (
    <Box sx={{ bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 1 }}>
      {/* Tabs and Filters Header */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        px: 2,
        flexWrap: {xs: 'wrap', md: 'nowrap'},
      }}>
        {/* Transaction Type Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            minHeight: 'auto',
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            },
            '& .MuiTab-root': {
              minHeight: '48px',
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 'normal',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 500,
              },
            }
          }}
        >
          <Tab 
            value="all"
            icon={<AllInclusiveIcon sx={{ fontSize: 18 }} />} 
            iconPosition="start" 
            label="All Transactions" 
          />
          <Tab 
            value="income"
            icon={<AttachMoneyIcon sx={{ fontSize: 18 }} />} 
            iconPosition="start" 
            label="Income" 
          />
          <Tab 
            value="cogs"
            icon={<ShoppingCartIcon sx={{ fontSize: 18 }} />} 
            iconPosition="start" 
            label="COGS" 
          />
          <Tab 
            value="expense"
            icon={<AccountBalanceWalletIcon sx={{ fontSize: 18 }} />} 
            iconPosition="start" 
            label="Expenses" 
          />
        </Tabs>
        
        {/* Date Range Filter */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Date Range
            </Typography>
            <Box 
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 0.5
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body2">All Time</Typography>
              <Box component="span" sx={{ color: '#9e9e9e', ml: 1 }}>▼</Box>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Transactions Table */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedTransactions.length > 0 ? (
              displayedTransactions.map((transaction, index) => {
                const typeInfo = getTransactionTypeInfo(transaction.type);
                const isLatest = isLatestTransaction(transaction);
                
                return (
                  <TableRow 
                    key={`${transaction.type}-${transaction.id}-${index}`}
                    sx={{ 
                      backgroundColor: isLatest ? alpha(theme.palette.primary.main, 0.05) : 'inherit',
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ whiteSpace: 'nowrap', position: 'relative' }}>
                      {isLatest && !isYearMonthFilterActive && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 3,
                            backgroundColor: theme.palette.primary.main,
                          }}
                        />
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isLatest && !isYearMonthFilterActive && (
                          <NewReleasesIcon 
                            fontSize="small" 
                            sx={{ 
                              color: theme.palette.primary.main, 
                              mr: 1,
                              animation: 'pulse 1.5s infinite',
                              '@keyframes pulse': {
                                '0%': { opacity: 0.6 },
                                '50%': { opacity: 1 },
                                '100%': { opacity: 0.6 }
                              }
                            }} 
                          />
                        )}
                        {formatDate(transaction.date)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>{transaction.description}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getCategoryIcon(transaction.category, transaction.type)}
                        {formatCategoryLabel(transaction.category)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      color: transaction.type === 'income' ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: isLatest && !isYearMonthFilterActive ? 600 : 500,
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={typeInfo.icon}
                        label={typeInfo.label}
                        sx={{
                          backgroundColor: typeInfo.lightColor,
                          color: typeInfo.color,
                          fontWeight: 500,
                          '& .MuiChip-icon': {
                            color: typeInfo.color,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                    <NoTransactionsIcon fontSize="large" sx={{ color: alpha(theme.palette.text.secondary, 0.5), mb: 1 }} />
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No transactions found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isYearMonthFilterActive 
                        ? `Try selecting a different time period or reset filters`
                        : `Try selecting a different transaction type or time period`}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Improved Pagination Controls */}
      {transactions.length > 0 && (
        <Box 
          sx={{
            display: 'flex',
            flexDirection: {xs: 'column', sm: 'row'},
            justifyContent: 'space-between',
            alignItems: {xs: 'stretch', sm: 'center'},
            px: 2,
            py: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {Math.min(transactions.length, page * rowsPerPage)} of {transactions.length} transactions
            </Typography>
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
              <InputLabel>Rows</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                label="Rows"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
            size="medium"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 1,
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default TransactionHistory; 