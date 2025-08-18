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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WorkIcon from '@mui/icons-material/Work';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaidIcon from '@mui/icons-material/Paid';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TodayIcon from '@mui/icons-material/Today';
import DoneIcon from '@mui/icons-material/Done';
import Snackbar from '@mui/material/Snackbar';

// Import services
import {
  addBill,
  addSalary,
  getAllBills,
  getAllSalaries,
  getPurchaseHistory,
  getBillsSummary,
  getSalariesSummary,
  getPurchasesSummary,
  deleteBill,
  deleteSalary
} from '../services/billsSalaryService';

const BillsSalaryPage = () => {
  const theme = useTheme();
  
  // State for bills and salaries
  const [bills, setBills] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [addBillDialogOpen, setAddBillDialogOpen] = useState(false);
  const [addSalaryDialogOpen, setAddSalaryDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  
  // Form state
  const [billFormData, setBillFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    paymentMethod: 'unpaid',
    paymentStatus: 'unpaid'
  });
  
  const [salaryFormData, setSalaryFormData] = useState({
    employeeName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    role: '',
    paymentMethod: 'cash',
    paymentStatus: 'unpaid'
  });
  
  // State for summaries
  const [billsSummary, setBillsSummary] = useState({
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    partiallyPaidAmount: 0,
    count: 0
  });
  
  const [salariesSummary, setSalariesSummary] = useState({
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    count: 0
  });
  
  const [purchasesSummary, setPurchasesSummary] = useState({
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    count: 0
  });
  
  // Add state for payment history dialog
  const [paymentHistoryDialogOpen, setPaymentHistoryDialogOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentHistoryType, setPaymentHistoryType] = useState('all'); // 'bills', 'salaries', 'all'
  
  // Add these new state variables to the component
  const [historyType, setHistoryType] = useState('');
  const [historyItems, setHistoryItems] = useState([]);
  const [historyTitle, setHistoryTitle] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'past', 'future'
  
  // Add these new state variables to handle loading
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Add function to filter unique bills by category, keeping only the latest
  const getUniqueLatestBills = (bills) => {
    // Group bills by category
    const billsByCategory = {};
    
    // Sort bills by date (newest first) before grouping
    const sortedBills = [...bills].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create groups of bills by category, keeping only the most recent one
    sortedBills.forEach(bill => {
      if (!billsByCategory[bill.category]) {
        billsByCategory[bill.category] = bill;
      }
    });
    
    // Convert the grouped bills back to an array
    return Object.values(billsByCategory);
  };
  
  // Add function to filter unique salaries by employee, keeping only the latest
  const getUniqueLatestSalaries = (salaries) => {
    // Group salaries by employee
    const salariesByEmployee = {};
    
    // Sort salaries by date (newest first) before grouping
    const sortedSalaries = [...salaries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create groups of salaries by employee, keeping only the most recent one
    sortedSalaries.forEach(salary => {
      if (!salariesByEmployee[salary.employeeName]) {
        salariesByEmployee[salary.employeeName] = salary;
      }
    });
    
    // Convert the grouped salaries back to an array
    return Object.values(salariesByEmployee);
  };
  
  // Add a function to check if a date is today
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.setHours(0,0,0,0) === today.setHours(0,0,0,0);
  };
  
  // Update loadData function to filter current day bills and salaries
  const loadData = () => {
    // Load bills using services - get all bills but only display today's
    const allBills = getAllBills();
    const todayBills = allBills.filter(bill => isToday(bill.date));
    const uniqueTodayBills = getUniqueLatestBills(todayBills);
    setBills(uniqueTodayBills);
    
    // Load salaries using services - get all salaries but only display today's
    const allSalaries = getAllSalaries();
    const todaySalaries = allSalaries.filter(salary => isToday(salary.date));
    const uniqueTodaySalaries = getUniqueLatestSalaries(todaySalaries);
    setSalaries(uniqueTodaySalaries);
    
    // Load purchase history using service
    const purchasesData = getPurchaseHistory();
    setPurchaseHistory(purchasesData);
    
    // Load summaries
    const billsSummaryData = getBillsSummary();
    setBillsSummary(billsSummaryData);
    
    const salariesSummaryData = getSalariesSummary();
    setSalariesSummary(salariesSummaryData);
    
    const purchasesSummaryData = getPurchasesSummary();
    setPurchasesSummary(purchasesSummaryData);
  };
  
  // Categories for bills
  const billCategories = [
    { value: 'rent', label: 'Rent/Lease' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'supplies', label: 'Office Supplies' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'taxes', label: 'Taxes' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Other' }
  ];
  
  // Employment roles
  const employmentRoles = [
    { value: 'manager', label: 'Manager' },
    { value: 'worker', label: 'Worker' },
    { value: 'helper', label: 'Helper' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'other', label: 'Other' }
  ];
  
  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'online', label: 'Online Transfer' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'unpaid', label: 'Unpaid' }
  ];
  
  // Payment statuses
  const paymentStatuses = [
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'partial', label: 'Partially Paid' }
  ];
  
  // Handle form change for bills
  const handleBillFormChange = (e) => {
    const { name, value } = e.target;
    setBillFormData({
      ...billFormData,
      [name]: value
    });
  };
  
  // Handle form change for salaries
  const handleSalaryFormChange = (e) => {
    const { name, value } = e.target;
    setSalaryFormData({
      ...salaryFormData,
      [name]: value
    });
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Add bill
  const handleAddBill = () => {
    try {
      // Validate form
      if (!billFormData.description || !billFormData.amount || !billFormData.date || !billFormData.category) {
        alert("Please fill in all required fields");
        return;
      }
      
      // Add bill using service
      addBill(billFormData);
      
      // Reset form and close dialog
      setBillFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        paymentMethod: 'unpaid',
        paymentStatus: 'unpaid'
      });
      setAddBillDialogOpen(false);
      
      // Reload data
      loadData();
    } catch (error) {
      alert(`Error adding bill: ${error.message}`);
    }
  };
  
  // Add salary
  const handleAddSalary = () => {
    try {
      // Validate form
      if (!salaryFormData.employeeName || !salaryFormData.amount || !salaryFormData.date || !salaryFormData.role) {
        alert("Please fill in all required fields");
        return;
      }
      
      // Add salary using service
      addSalary(salaryFormData);
      
      // Reset form and close dialog
      setSalaryFormData({
        employeeName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        role: '',
        paymentMethod: 'cash',
        paymentStatus: 'unpaid'
      });
      setAddSalaryDialogOpen(false);
      
      // Reload data
      loadData();
    } catch (error) {
      alert(`Error adding salary: ${error.message}`);
    }
  };
  
  // Get payment status chip
  const getPaymentStatusChip = (status) => {
    let color;
    let icon;
    
    switch (status) {
      case 'paid':
        color = 'success';
        icon = <PaidIcon fontSize="small" />;
        break;
      case 'unpaid':
        color = 'error';
        icon = <MoneyOffIcon fontSize="small" />;
        break;
      case 'partial':
        color = 'warning';
        icon = <CreditCardIcon fontSize="small" />;
        break;
      default:
        color = 'default';
        icon = <MoneyOffIcon fontSize="small" />;
    }
    
    return (
      <Chip
        icon={icon}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={color}
        size="small"
        variant="outlined"
      />
    );
  };
  
  // Modify the formatDate function to indicate if a date is in the future
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formatted = date.toLocaleDateString(undefined, options);
    
    // If date is future, add indicator
    if (date > today) {
      return `${formatted} (Upcoming)`;
    }
    
    return formatted;
  };
  
  // Modify the function to handle viewing history for an item (bill or salary)
  const handleViewHistory = (item, type) => {
    setSelectedHistoryItem({ ...item, type });
    setHistoryDialogOpen(true);
  };
  
  // Add function to handle viewing history for a specific item
  const handleViewItemHistory = (item, type) => {
    if (type === 'bill') {
      // Get all bills that match this bill's category
      const allBills = getAllBills();
      const filteredBills = allBills.filter(b => b.category === item.category);
      setHistoryItems(filteredBills);
      setHistoryType('bills');
      setHistoryTitle(`Bill History - ${billCategories.find(cat => cat.value === item.category)?.label || item.category}`);
      setHistoryDialogOpen(true);
    } else if (type === 'salary') {
      // Get all salaries for this employee
      const allSalaries = getAllSalaries();
      const filteredSalaries = allSalaries.filter(s => s.employeeName === item.employeeName);
      setHistoryItems(filteredSalaries);
      setHistoryType('salaries');
      setHistoryTitle(`Salary History - ${item.employeeName}`);
      setHistoryDialogOpen(true);
    }
  };
  
  // Add this function to handle viewing all payment history
  const handleViewPaymentHistory = (type) => {
    let items = [];
    let title = '';
    
    if (type === 'bills') {
      // Get all bills from service without date filter
      getAllBills()
        .then(data => {
          setHistoryItems(data);
          setHistoryType('bills');
          setHistoryTitle('All Bills History');
          setHistoryDialogOpen(true);
        })
        .catch(error => {
          console.error('Error fetching bills history:', error);
          setSnackbar({
            open: true,
            message: 'Failed to load bills history',
            severity: 'error'
          });
        });
    } else if (type === 'salaries') {
      // Get all salaries from service without date filter
      getAllSalaries()
        .then(data => {
          setHistoryItems(data);
          setHistoryType('salaries');
          setHistoryTitle('All Salaries History');
          setHistoryDialogOpen(true);
        })
        .catch(error => {
          console.error('Error fetching salaries history:', error);
          setSnackbar({
            open: true,
            message: 'Failed to load salaries history',
            severity: 'error'
          });
        });
    }
  };
  
  // Update the filterItemsByDate function to better handle date comparison
  const filterItemsByDate = (items) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to beginning of the day for comparison

    if (dateFilter === 'all') {
      return items;
    } else if (dateFilter === 'past') {
      return items.filter(item => {
        const itemDate = new Date(item.date || item.dueDate || item.paymentDate);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate < now;
      });
    } else if (dateFilter === 'future') {
      return items.filter(item => {
        const itemDate = new Date(item.date || item.dueDate || item.paymentDate);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= now;
      });
    }
    return items;
  };
  
  // Add function to handle edit button click
  const handleEditItem = (item, type) => {
    if (type === 'bill') {
      setBillFormData(item);
      setAddBillDialogOpen(true);
    } else if (type === 'salary') {
      setSalaryFormData(item);
      setAddSalaryDialogOpen(true);
    }
    setHistoryDialogOpen(false);
  };

  // Add function to handle delete button click
  const handleDeleteItem = (item, type) => {
    if (type === 'bill') {
      try {
        deleteBill(item.id);
        loadData();
        setHistoryDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Bill deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting bill:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete bill',
          severity: 'error'
        });
      }
    } else if (type === 'salary') {
      try {
        deleteSalary(item.id);
        loadData();
        setHistoryDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Salary record deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting salary:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete salary record',
          severity: 'error'
        });
      }
    }
  };
  
  // Add a function to always return the current date for display
  const getCurrentDate = () => {
    const today = new Date();
    return formatDate(today);
  };
  
  // Add helper function to determine if a date is today
  function isDateToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }
  
  // Add these functions to handle marking items as paid
  const handleMarkBillAsPaid = async (bill) => {
    try {
      setLoading(true);
      const updatedBill = { ...bill, paid: true };
      await BillsService.updateBill(bill.id, updatedBill);
      
      // Update bills list
      loadBills();
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Bill marked as paid successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      setSnackbar({
        open: true,
        message: 'Failed to mark bill as paid. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSalaryAsPaid = async (salary) => {
    try {
      setLoading(true);
      const updatedSalary = { ...salary, paymentStatus: 'paid' };
      await SalaryService.updateSalary(salary.id, updatedSalary);
      
      // Update salaries list
      loadSalaries();
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Salary marked as paid successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error marking salary as paid:', error);
      setSnackbar({
        open: true,
        message: 'Failed to mark salary as paid. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Bills & Salary Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track bills, employee salaries, and purchase payments
        </Typography>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderLeft: `4px solid ${theme.palette.error.main}`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceiptIcon 
                sx={{ 
                  fontSize: 40, 
                  color: theme.palette.error.main,
                  p: 1,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  mr: 2
                }} 
              />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Bills
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ₹{billsSummary.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Paid
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    ₹{billsSummary.paidAmount.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Unpaid
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="error.main">
                    ₹{billsSummary.unpaidAmount.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Entries
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {billsSummary.count}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon 
                sx={{ 
                  fontSize: 40, 
                  color: theme.palette.primary.main,
                  p: 1,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  mr: 2
                }} 
              />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Salaries
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ₹{salariesSummary.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Paid
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    ₹{salariesSummary.paidAmount.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Unpaid
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="error.main">
                    ₹{salariesSummary.unpaidAmount.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Employees
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {salariesSummary.count}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderLeft: `4px solid ${theme.palette.warning.main}`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingCartIcon 
                sx={{ 
                  fontSize: 40, 
                  color: theme.palette.warning.main,
                  p: 1,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  mr: 2
                }} 
              />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Purchases
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ₹{purchasesSummary.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Paid
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    ₹{purchasesSummary.paidAmount.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Unpaid
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="error.main">
                    ₹{purchasesSummary.unpaidAmount.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Entries
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {purchasesSummary.count}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tab Navigation */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="bills and salary tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<ReceiptIcon />} iconPosition="start" label="Bills" />
          <Tab icon={<WorkIcon />} iconPosition="start" label="Salaries" />
          <Tab icon={<ReceiptIcon />} iconPosition="start" label="Purchase History" />
        </Tabs>
        
        {/* Bills Tab with updated date display and history access */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Today's Bills</Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddBillDialogOpen(true)}
                >
                  Add Bill
                </Button>
              </Stack>
            </Box>
            
            {bills.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>{formatDate(bill.date)}</TableCell>
                        <TableCell>{bill.description}</TableCell>
                        <TableCell>
                          {billCategories.find(cat => cat.value === bill.category)?.label || bill.category}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditItem(bill, 'bill')}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewItemHistory(bill, 'bill')}
                            title="History"
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteItem(bill, 'bill')}
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ReceiptLongIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Bills For Today
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add a bill for today
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddBillDialogOpen(true)}
                >
                  Add Bill
                </Button>
              </Box>
            )}
          </Box>
        )}
        
        {/* Salaries Tab with updated date display and history access */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Today's Employee Salaries</Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddSalaryDialogOpen(true)}
                >
                  Add Salary
                </Button>
              </Stack>
            </Box>
            
            {salaries.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salaries.map((salary) => (
                      <TableRow key={salary.id}>
                        <TableCell>{formatDate(salary.date)}</TableCell>
                        <TableCell>{salary.employeeName}</TableCell>
                        <TableCell>
                          {employmentRoles.find(role => role.value === salary.role)?.label || salary.role}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditItem(salary, 'salary')}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewItemHistory(salary, 'salary')}
                            title="History"
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteItem(salary, 'salary')}
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Salaries For Today
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add a salary for today
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddSalaryDialogOpen(true)}
                >
                  Add Salary
                </Button>
              </Box>
            )}
          </Box>
        )}
        
        {/* Purchase History Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Purchase Payment History</Typography>
            
            {purchaseHistory.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell>Payment Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseHistory.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{formatDate(purchase.date)}</TableCell>
                        <TableCell>{purchase.itemName}</TableCell>
                        <TableCell>{purchase.supplier || 'Not specified'}</TableCell>
                        <TableCell align="right">{purchase.quantity}</TableCell>
                        <TableCell align="right">₹{purchase.cost ? parseFloat(purchase.cost).toFixed(2) : '0.00'}</TableCell>
                        <TableCell>
                          {purchase.paymentMethod ? 
                            paymentMethods.find(method => method.value === purchase.paymentMethod)?.label || purchase.paymentMethod
                            : 'Unpaid'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ReceiptLongIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Purchase History
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Stock purchases will automatically appear here
                </Typography>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/inventory"
                  startIcon={<InventoryIcon />}
                >
                  Inventory
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Add Bill Dialog */}
      <Dialog
        open={addBillDialogOpen}
        onClose={() => setAddBillDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Bill</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Description"
              name="description"
              value={billFormData.description}
              onChange={handleBillFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              label="Amount"
              name="amount"
              type="number"
              value={billFormData.amount}
              onChange={handleBillFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              label="Date"
              name="date"
              type="date"
              value={billFormData.date}
              onChange={handleBillFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={billFormData.category}
                label="Category"
                onChange={handleBillFormChange}
              >
                {billCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={billFormData.paymentMethod}
                label="Payment Method"
                onChange={handleBillFormChange}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="paymentStatus"
                value={billFormData.paymentStatus}
                label="Payment Status"
                onChange={handleBillFormChange}
              >
                {paymentStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddBillDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddBill} variant="contained">Add Bill</Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Salary Dialog */}
      <Dialog
        open={addSalaryDialogOpen}
        onClose={() => setAddSalaryDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Employee Salary</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Employee Name"
              name="employeeName"
              value={salaryFormData.employeeName}
              onChange={handleSalaryFormChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={salaryFormData.role}
                label="Role"
                onChange={handleSalaryFormChange}
              >
                {employmentRoles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Amount"
              name="amount"
              type="number"
              value={salaryFormData.amount}
              onChange={handleSalaryFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              label="Date"
              name="date"
              type="date"
              value={salaryFormData.date}
              onChange={handleSalaryFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={salaryFormData.paymentMethod}
                label="Payment Method"
                onChange={handleSalaryFormChange}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="paymentStatus"
                value={salaryFormData.paymentStatus}
                label="Payment Status"
                onChange={handleSalaryFormChange}
              >
                {paymentStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSalaryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSalary} variant="contained">Add Salary</Button>
        </DialogActions>
      </Dialog>
      
      {/* Add the history dialog component */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {historyTitle}
          <IconButton
            aria-label="close"
            onClick={() => setHistoryDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">Filter by date:</Typography>
            <ToggleButtonGroup
              value={dateFilter}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) {
                  setDateFilter(newValue);
                }
              }}
              aria-label="date filter"
              size="small"
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="past">Past</ToggleButton>
              <ToggleButton value="future">Future</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="history table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>{historyType === 'bills' ? 'Description' : 'Employee'}</TableCell>
                  <TableCell>{historyType === 'bills' ? 'Category' : 'Role'}</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterItemsByDate(historyItems).length > 0 ? (
                  filterItemsByDate(historyItems).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatDate(item.date || item.dueDate || item.paymentDate)}</TableCell>
                      <TableCell>{item.description || item.employeeName}</TableCell>
                      <TableCell>{item.category || item.role}</TableCell>
                      <TableCell align="right">₹{parseFloat(item.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        {getPaymentStatusChip(item.paymentStatus || (item.paid ? 'paid' : 'unpaid'))}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditItem(item, historyType === 'bills' ? 'bill' : 'salary')}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteItem(item, historyType === 'bills' ? 'bill' : 'salary')}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No {historyType} found matching the selected date filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BillsSalaryPage; 