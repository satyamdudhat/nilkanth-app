import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  MenuItem,
  TextField,
  Stack,
  useTheme,
  alpha,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

// Import components
import MetricsCard from '../components/finance/MetricsCard';
import TransactionHistory from '../components/finance/TransactionHistory';

// Import services
import {
  addIncome,
  addCOGS,
  addExpense,
  getAllIncome,
  getAllCOGS,
  getAllExpenses,
  calculateFinancialMetrics,
} from '../services/financeService';

// Years for filtering
const years = [
  { value: 'all', label: 'All Years' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
];

// Months for filtering
const months = [
  { value: 'all', label: 'All Months' },
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

const FinancePage = () => {
  const theme = useTheme();
  
  // State for financial data
  const [income, setIncome] = useState([]);
  const [cogs, setCOGS] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
  });

  // Get current date info
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = currentDate.getMonth().toString();

  // State for date filters - default to current year and month
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Check if viewing current month/year
  const isViewingCurrentPeriod = () => {
    // If explicitly filtering for current month and year
    if (selectedYear === currentYear && selectedMonth === currentMonth) {
      return true;
    }
    
    // If viewing all data (no filters applied)
    if (selectedYear === 'all' && selectedMonth === 'all') {
      return true;
    }
    
    return false;
  };

  // Transaction form state
  const [transactionType, setTransactionType] = useState('income');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Load data on mount and when filters change
  useEffect(() => {
    loadFinancialData();
  }, [selectedYear, selectedMonth]);

  // Load all financial data
  const loadFinancialData = () => {
    // Get transaction data
    const incomeData = getAllIncome();
    const cogsData = getAllCOGS();
    const expenseData = getAllExpenses();

    // Filter data based on year and month
    const filteredIncome = filterDataByDate(incomeData, selectedYear, selectedMonth);
    const filteredCOGS = filterDataByDate(cogsData, selectedYear, selectedMonth);
    const filteredExpenses = filterDataByDate(expenseData, selectedYear, selectedMonth);

    // Update state
    setIncome(filteredIncome);
    setCOGS(filteredCOGS);
    setExpenses(filteredExpenses);

    // Calculate metrics based on filtered data
    const filteredMetrics = calculateFilteredMetrics(filteredIncome, filteredCOGS, filteredExpenses);
    setMetrics(filteredMetrics);
  };

  // Filter data by date
  const filterDataByDate = (data, year, month) => {
    if (year === 'all' && month === 'all') {
      // Show all data when both filters are set to 'all'
      return data;
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear().toString();
      const itemMonth = itemDate.getMonth().toString();
      
      const yearMatch = year === 'all' || itemYear === year;
      const monthMatch = month === 'all' || itemMonth === month;
      
      return yearMatch && monthMatch;
    });
  };

  // Calculate filtered metrics
  const calculateFilteredMetrics = (filteredIncome, filteredCOGS, filteredExpenses) => {
    const totalRevenue = filteredIncome.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalCOGS = filteredCOGS.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalExpenses = filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;
    
    return {
      revenue: totalRevenue,
      cogs: totalCOGS,
      grossProfit,
      expenses: totalExpenses,
      netProfit
    };
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Check if selected date is in current month and year
  const isCurrentMonthYear = (dateString) => {
    const selectedDate = new Date(dateString);
    return (
      selectedDate.getFullYear().toString() === currentYear &&
      selectedDate.getMonth().toString() === currentMonth
    );
  };

  // Handle transaction type change
  const handleTransactionTypeChange = (event, newValue) => {
    setTransactionType(newValue);
    // Reset category based on transaction type
    setFormData({
      ...formData,
      category: ''
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      alert('Please fill in all fields');
      return;
    }

    // Validate that the date is in current month and year
    if (!isCurrentMonthYear(formData.date)) {
      alert(`You can only add transactions for the current month (${months.find(m => m.value === currentMonth)?.label} ${currentYear})`);
      return;
    }
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    // Add transaction based on type
    if (transactionType === 'income') {
      addIncome(transactionData);
    } else if (transactionType === 'cogs') {
      addCOGS(transactionData);
    } else if (transactionType === 'expense') {
      addExpense(transactionData);
    }
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    
    // Reload data
    loadFinancialData();
  };

  // Get category options based on transaction type
  const getCategoryOptions = () => {
    if (transactionType === 'income') {
      return [
        { value: 'sales', label: 'Product Sales' },
        { value: 'service', label: 'Service Revenue' },
        { value: 'rent', label: 'Rental Income' },
        { value: 'interest', label: 'Interest Income' },
        { value: 'other', label: 'Other Income' },
      ];
    } else if (transactionType === 'cogs') {
      return [
        { value: 'raw_materials', label: 'Raw Materials' },
        { value: 'direct_labor', label: 'Direct Labor' },
        { value: 'packaging', label: 'Packaging' },
        { value: 'manufacturing', label: 'Manufacturing Costs' },
        { value: 'delivery', label: 'Delivery Costs' },
        { value: 'other', label: 'Other COGS' },
      ];
    } else {
      return [
        { value: 'rent', label: 'Rent/Lease' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'salary', label: 'Salaries & Wages' },
        { value: 'marketing', label: 'Marketing & Advertising' },
        { value: 'insurance', label: 'Insurance' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'office', label: 'Office Supplies' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'other', label: 'Other Expenses' },
      ];
    }
  };

  // Get timeframe label
  const getTimeframeLabel = () => {
    let yearText = selectedYear === 'all' ? 'All Years' : selectedYear;
    let monthText = selectedMonth === 'all' ? 'All Months' : months.find(m => m.value === selectedMonth)?.label;
    
    return `${yearText} - ${monthText}`;
  };

  // Format current month year for display
  const getCurrentMonthYearLabel = () => {
    const monthLabel = months.find(m => m.value === currentMonth)?.label;
    return `${monthLabel} ${currentYear}`;
  };

  return (
    <Box sx={{ 
      background: 'white',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        py: 2,
        px: { xs: 2, md: 3 },
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                color: theme.palette.primary.main,
                mr: 1.5
              }}
            >
              <AccountBalanceIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Financial Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor your business financial performance
              </Typography>
            </Box>
          </Box>
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              px: 2,
              py: 0.75,
              backgroundColor: '#f8fafc',
            }}
          >
            <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              {getTimeframeLabel()}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3 } }}>
        {/* Filter Controls */}
        <Box 
          sx={{ 
            p: 3, 
            mb: 4, 
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Select Year - Month
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                fullWidth
                label="Select Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                {years.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                fullWidth
                label="Select Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                {months.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedYear(currentYear);
                  setSelectedMonth(currentMonth);
                }}
                size="small"
                sx={{ borderRadius: 4 }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Financial Summary Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3
          }}>
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5
              }}
            >
              <PieChartOutlineIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight="600">
              Financial Summary
            </Typography>
          </Box>

          {/* Key Financial Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricsCard title="Revenue" value={metrics.revenue} type="revenue" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricsCard title="COGS" value={metrics.cogs} type="cogs" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricsCard title="Gross Profit" value={metrics.grossProfit} type="grossProfit" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricsCard title="Expenses" value={metrics.expenses} type="expenses" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <MetricsCard title="Net Profit" value={metrics.netProfit} type="netProfit" />
            </Grid>
          </Grid>
        </Box>

        {/* Quick Add Transaction Section - Only shown when viewing current period */}
        {isViewingCurrentPeriod() ? (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3
            }}>
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5
                }}
              >
                <AddIcon fontSize="small" />
              </Box>
              <Typography variant="h6" fontWeight="600">
                Quick Add Transaction
              </Typography>
            </Box>

            {/* Current Month Notice */}
            <Alert 
              severity="info" 
              icon={<InfoIcon />}
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: theme.palette.info.main
                }
              }}
            >
              Transactions can only be added for the current month: <strong>{getCurrentMonthYearLabel()}</strong>
            </Alert>

            {/* Transaction Form */}
            <Box 
              sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #e0e0e0',
              }}
            >
              <Tabs
                value={transactionType}
                onChange={handleTransactionTypeChange}
                variant="fullWidth"
                sx={{
                  mb: 3,
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    py: 1.5,
                  },
                  '& .Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <Tab 
                  value="income" 
                  label="Income" 
                  icon={<AttachMoneyIcon fontSize="small" />} 
                  iconPosition="start"
                />
                <Tab 
                  value="cogs" 
                  label="COGS" 
                  icon={<ShoppingCartIcon fontSize="small" />} 
                  iconPosition="start"
                />
                <Tab 
                  value="expense" 
                  label="Expense" 
                  icon={<AccountBalanceWalletIcon fontSize="small" />} 
                  iconPosition="start"
                />
              </Tabs>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Description"
                      value={formData.description}
                      onChange={handleFormChange}
                      variant="outlined"
                      placeholder="Enter description"
                      required
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      name="amount"
                      label="Amount (₹)"
                      type="number"
                      value={formData.amount}
                      onChange={handleFormChange}
                      variant="outlined"
                      placeholder="0.00"
                      required
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      select
                      name="category"
                      label="Category"
                      value={formData.category}
                      onChange={handleFormChange}
                      variant="outlined"
                      required
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    >
                      {getCategoryOptions().map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      name="date"
                      label="Date"
                      type="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      variant="outlined"
                      required
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                      InputProps={{
                        // Set min and max date to restrict to current month
                        inputProps: {
                          min: `${currentYear}-${(parseInt(currentMonth) + 1).toString().padStart(2, '0')}-01`,
                          max: new Date(currentYear, parseInt(currentMonth) + 1, 0).toISOString().split('T')[0],
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        py: 1,
                        borderRadius: 2,
                        backgroundColor: transactionType === 'income' 
                          ? '#4caf50'
                          : transactionType === 'cogs'
                          ? '#ff9800'
                          : '#f44336',
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Alert 
              severity="warning" 
              sx={{ 
                width: '100%', 
                borderRadius: 2,
                mb: 2
              }}
            >
              Transaction entry is only available when viewing the current month ({getCurrentMonthYearLabel()}).
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSelectedYear(currentYear);
                setSelectedMonth(currentMonth);
              }}
              startIcon={<AddIcon />}
            >
              Switch to Current Month to Add Transactions
            </Button>
          </Box>
        )}

        {/* Transaction History Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3
          }}>
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5
              }}
            >
              <CalendarTodayIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight="600">
              Transaction History
            </Typography>
          </Box>
          {/* Only display transaction history when NOT both "all" for year and month */}
          {!(selectedYear === 'all' && selectedMonth === 'all') ? (
            <TransactionHistory 
              incomeData={income} 
              cogsData={cogs} 
              expenseData={expenses} 
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          ) : (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center', 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              backgroundColor: 'white'
            }}>
              <Box sx={{ mb: 2 }}>
                <ReceiptLongIcon fontSize="large" sx={{ color: alpha(theme.palette.text.secondary, 0.5), mb: 1 }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select a specific time period to view transactions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                For better performance, transaction history is only displayed when you select a specific year, month, or both.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedYear(currentYear);
                  setSelectedMonth(currentMonth);
                }}
                startIcon={<CalendarTodayIcon />}
              >
                View Current Month
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinancePage; 