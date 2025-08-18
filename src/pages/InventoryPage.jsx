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
  InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AlertIcon from '@mui/icons-material/Warning';
import TableViewIcon from '@mui/icons-material/TableView';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';

// Import services
import {
  addInventoryItem,
  getActiveInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
  addPurchase,
  addUsage,
  getAllItemsSummary,
  getItemSummary,
  getPurchasesForItem,
  getUsageForItem,
  deletePurchase,
  deleteUsage
} from '../services/inventoryService';

const InventoryPage = () => {
  const theme = useTheme();
  
  // State for inventory data
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Dialog states
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [addPurchaseDialogOpen, setAddPurchaseDialogOpen] = useState(false);
  const [addUsageDialogOpen, setAddUsageDialogOpen] = useState(false);
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [viewAllStockDialogOpen, setViewAllStockDialogOpen] = useState(false);
  const [itemHistoryDialogOpen, setItemHistoryDialogOpen] = useState(false);
  const [historyType, setHistoryType] = useState('purchase'); // 'purchase' or 'usage'
  const [usageManagementDialogOpen, setUsageManagementDialogOpen] = useState(false);
  
  // Form state
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: '',
    companyName: ''
  });
  
  const [purchaseFormData, setPurchaseFormData] = useState({
    itemId: '',
    quantity: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    paymentMethod: 'unpaid',
    unit: ''
  });
  
  const [usageFormData, setUsageFormData] = useState({
    itemId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    notes: ''
  });
  
  // Add state for company filter
  const [selectedCompany, setSelectedCompany] = useState('all');
  
  // Add state for company overview page
  const [companyOverviewOpen, setCompanyOverviewOpen] = useState(false);
  const [selectedCompanyForOverview, setSelectedCompanyForOverview] = useState(null);
  
  // State for usage history dialog
  const [usageHistoryDialogOpen, setUsageHistoryDialogOpen] = useState(false);
  
  // Load data on mount
  useEffect(() => {
    loadInventoryData();
  }, []);
  
  // Load all inventory data
  const loadInventoryData = () => {
    const items = getActiveInventoryItems();
    const summary = getAllItemsSummary();
    
    setInventoryItems(items);
    setInventorySummary(summary);
  };
  
  // Categories for inventory items
  const itemCategories = [
    { value: 'raw_materials', label: 'Raw Materials' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'finished_goods', label: 'Finished Goods' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' }
  ];
  
  // Units for inventory items
  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'l', label: 'Liters (L)' },
    { value: 'ml', label: 'Milliliters (mL)' },
    { value: 'pcs', label: 'Pieces' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'units', label: 'Units' }
  ];
  
  // Payment method options
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'online', label: 'Online Transfer' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'unpaid', label: 'Unpaid' }
  ];
  
  // Handle form change for new/edit item
  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setItemFormData({
      ...itemFormData,
      [name]: value
    });
  };
  
  // Handle form change for purchase
  const handlePurchaseFormChange = (e) => {
    const { name, value } = e.target;
    setPurchaseFormData({
      ...purchaseFormData,
      [name]: value
    });
  };
  
  // Handle form change for usage
  const handleUsageFormChange = (e) => {
    const { name, value } = e.target;
    setUsageFormData({
      ...usageFormData,
      [name]: value
    });
  };
  
  // Check for duplicate item
  const isDuplicateItem = (name, company, category) => {
    // Handle null or undefined values to prevent toLowerCase errors
    if (!name || !company || !category) return false;
    
    return inventoryItems.some(
      item => 
        item.name && item.companyName && 
        item.name.toLowerCase() === name.toLowerCase() &&
        item.companyName.toLowerCase() === company.toLowerCase() &&
        item.category === category
    );
  };
  
  // Handle add item
  const handleAddItem = () => {
    try {
      // Validate form
      if (!itemFormData.name || !itemFormData.category || !itemFormData.companyName) {
        alert("Please fill in all required fields");
        return;
      }

      // Check for duplicates
      if (isDuplicateItem(itemFormData.name, itemFormData.companyName, itemFormData.category)) {
        alert("An item with the same name, company and category already exists!");
        return;
      }
      
      // Add new item
      addInventoryItem(itemFormData);
      
      // Reset form and close dialog
      setItemFormData({
        name: '',
        category: '',
        companyName: ''
      });
      setAddItemDialogOpen(false);
      
      // Reload data
      loadInventoryData();
    } catch (error) {
      alert(`Error adding item: ${error.message}`);
    }
  };
  
  // Handle add purchase
  const handleAddPurchase = () => {
    try {
      // Validate form
      if (!purchaseFormData.itemId || !purchaseFormData.quantity || !purchaseFormData.date) {
        alert("Please fill in all required fields");
        return;
      }
      
      // Add new purchase with properly formatted date to ensure correct sorting
      const newPurchase = addPurchase({
        ...purchaseFormData,
        date: purchaseFormData.date // Ensure date is in YYYY-MM-DD format
      });
      
      // Reset form and close dialog
      setPurchaseFormData({
        itemId: '',
        quantity: '',
        cost: '',
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        paymentMethod: 'unpaid',
        unit: ''
      });
      setAddPurchaseDialogOpen(false);
      
      // Reload data to update the latest purchase
      loadInventoryData();
      
      // Show success message
      alert("Purchase recorded successfully! The latest purchase is now displayed in the inventory list.");
    } catch (error) {
      alert(`Error adding purchase: ${error.message}`);
    }
  };
  
  // Handle add usage
  const handleAddUsage = () => {
    try {
      // Validate form
      if (!usageFormData.itemId || !usageFormData.quantity || !usageFormData.date) {
        alert("Please fill in all required fields");
        return;
      }
      
      // Add new usage with properly formatted date to ensure correct sorting
      addUsage({
        ...usageFormData,
        date: usageFormData.date // Ensure date is in YYYY-MM-DD format
      });
      
      // Reset form and close dialog
      setUsageFormData({
        itemId: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
        purpose: '',
        notes: ''
      });
      setAddUsageDialogOpen(false);
      
      // Reload data
      loadInventoryData();
      
      // Show success message
      alert("Usage recorded successfully! The latest usage is now displayed in the usage management table.");
    } catch (error) {
      alert(`Error adding usage: ${error.message}`);
    }
  };
  
  // Handle open edit dialog
  const handleOpenEditDialog = (item) => {
    setSelectedItem(item);
    setItemFormData({
      name: item.name,
      category: item.category || '',
      companyName: item.companyName || ''
    });
    setEditItemDialogOpen(true);
  };
  
  // Handle edit item
  const handleEditItem = () => {
    try {
      // Validate form
      if (!itemFormData.name || !itemFormData.category) {
        alert("Please fill in all required fields");
        return;
      }
      
      // Update item
      updateInventoryItem(selectedItem.id, itemFormData);
      
      // Reset form and close dialog
      setItemFormData({
        name: '',
        category: '',
        companyName: ''
      });
      setSelectedItem(null);
      setEditItemDialogOpen(false);
      
      // Reload data
      loadInventoryData();
    } catch (error) {
      alert(`Error updating item: ${error.message}`);
    }
  };
  
  // Handle open delete confirm dialog
  const handleOpenDeleteDialog = (item) => {
    setSelectedItem(item);
    setDeleteConfirmDialogOpen(true);
  };
  
  // Handle delete item
  const handleDeleteItem = () => {
    try {
      // Delete item completely instead of just deactivating
      deleteInventoryItem(selectedItem.id);
      
      // Reset and close dialog
      setSelectedItem(null);
      setDeleteConfirmDialogOpen(false);
      
      // Reload data
      loadInventoryData();
    } catch (error) {
      alert(`Error deleting item: ${error.message}`);
    }
  };
  
  // Get stock status label and color
  const getStockStatus = (item) => {
    const { remaining, minLevel } = item;
    
    if (remaining <= 0) {
      return { label: 'Out of Stock', color: theme.palette.error.main };
    }
    
    if (minLevel && remaining <= parseFloat(minLevel)) {
      return { label: 'Low Stock', color: theme.palette.warning.main };
    }
    
    return { label: 'In Stock', color: theme.palette.success.main };
  };
  
  // Get unique company names
  const getUniqueCompanies = () => {
    const companies = new Set(inventorySummary.map(item => item.companyName).filter(Boolean));
    return Array.from(companies).sort();
  };
  
  // New component for stock status
  const StockStatusBanner = ({ inventorySummary }) => {
    const theme = useTheme();
    
    // Count low stock items
    const lowStockItems = inventorySummary.filter(item => {
      const remaining = item.remaining;
      return remaining <= 0 || (item.minLevel && remaining <= parseFloat(item.minLevel));
    });
    
    if (lowStockItems.length === 0) {
      return null;
    }
    
    return (
      <Alert 
        severity="warning" 
        icon={<AlertIcon />}
        sx={{ 
          mb: 4, 
          display: 'flex',
          alignItems: 'flex-start'
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            {lowStockItems.length} {lowStockItems.length === 1 ? 'item' : 'items'} with low stock
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {lowStockItems.map(item => (
              <Typography key={item.id} variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                • {item.name} ({item.companyName}) - {item.remaining.toFixed(2)} {getUnitLabel(item.unit)} remaining
              </Typography>
            ))}
          </Box>
        </Box>
      </Alert>
    );
  };
  
  // Handle viewing item history
  const handleViewHistory = (item) => {
    setSelectedItem(item);
    setHistoryType('purchase');
    setItemHistoryDialogOpen(true);
  };

  // Update getHistoryTitle to remove usage-related data
  const getHistoryTitle = () => {
    if (!selectedItem) return '';
    return `Purchase History: ${selectedItem.name}`;
  };

  // Update getHistoryData to return purchase history sorted by date (newest first)
  // Exclude the latest purchase if showAllHistory is false
  const getHistoryData = (showAllHistory = false) => {
    if (!selectedItem) return [];
    
    // Get purchase history
    let historyData = getPurchasesForItem(selectedItem.id);
    
    // Sort by date first, then by createdAt timestamp
    historyData = historyData.sort((a, b) => {
      // First compare by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB - dateA; // If dates are different, sort by date (newest first)
      }
      
      // If dates are the same, compare by createdAt timestamp
      const createdAtA = new Date(a.createdAt);
      const createdAtB = new Date(b.createdAt);
      return createdAtB - createdAtA;
    });
    
    // If not showing all history, remove the latest purchase (it's already shown in the main inventory list)
    if (!showAllHistory && historyData.length > 1) {
      return historyData.slice(1); // Return all except the first (latest) one
    }
    
    return historyData;
  };

  // Get total purchased function
  const getTotalPurchased = (itemId) => {
    const purchases = getPurchasesForItem(itemId);
    if (purchases.length === 0) return 0;
    
    return purchases.reduce((total, purchase) => total + parseFloat(purchase.quantity), 0);
  };

  // Get formatted unit label
  const getUnitLabel = (unit) => {
    if (!unit) return '';
    
    // Find the unit in the units array
    const unitInfo = units.find(u => u.value === unit);
    return unitInfo ? unitInfo.label : unit;
  };
  
  // Filter items by company
  const getFilteredInventorySummary = () => {
    if (selectedCompany === 'all') {
      return inventorySummary;
    }
    return inventorySummary.filter(item => item.companyName === selectedCompany);
  };
  
  // Group items by company
  const getItemsByCompany = () => {
    const grouped = {};
    inventorySummary.forEach(item => {
      if (!grouped[item.companyName]) {
        grouped[item.companyName] = [];
      }
      grouped[item.companyName].push(item);
    });
    return grouped;
  };

  // State for company view dialog
  const [companyViewDialogOpen, setCompanyViewDialogOpen] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);

  // Handle company view
  const handleCompanyView = (companyName) => {
    setSelectedCompanyData({
      name: companyName,
      items: getItemsByCompany()[companyName] || []
    });
    setCompanyViewDialogOpen(true);
  };
  
  // Get usage history data
  const getUsageHistoryData = (showAllHistory = false) => {
    if (!selectedItem) return [];
    
    // Get usage history
    let historyData = getUsageForItem(selectedItem.id);
    
    // Sort by date first, then by createdAt timestamp
    historyData = historyData.sort((a, b) => {
      // First compare by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB - dateA; // If dates are different, sort by date (newest first)
      }
      
      // If dates are the same, compare by createdAt timestamp
      const createdAtA = new Date(a.createdAt);
      const createdAtB = new Date(b.createdAt);
      return createdAtB - createdAtA;
    });
    
    // If not showing all history, remove the latest usage (it's already shown in the main inventory list)
    if (!showAllHistory && historyData.length > 1) {
      return historyData.slice(1); // Return all except the first (latest) one
    }
    
    return historyData;
  };
  
  // Get usage history title
  const getUsageHistoryTitle = () => {
    if (!selectedItem) return '';
    return `Usage History: ${selectedItem.name}`;
  };
  
  // Add function to delete a purchase record
  const handleDeletePurchase = (purchaseId) => {
    try {
      deletePurchase(purchaseId);
      loadInventoryData();
      
      // Show success message
      alert("Purchase record deleted successfully!");
    } catch (error) {
      alert(`Error deleting purchase record: ${error.message}`);
    }
  };

  // Add function to delete a usage record
  const handleDeleteUsage = (usageId) => {
    try {
      deleteUsage(usageId);
      loadInventoryData();
      
      // Show success message
      alert("Usage record deleted successfully!");
    } catch (error) {
      alert(`Error deleting usage record: ${error.message}`);
    }
  };
  
  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: 3,
        height: '100vh',
        overflow: 'auto',
        position: 'fixed',
        top: 0,
        right: 0,
        width: 'calc(100% - 190px)', // Reduced from 280px to match drawerWidth
        bgcolor: 'background.default',
        pl: 3, // Reduced left padding
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Inventory Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track inventory items, purchases, and usage
        </Typography>
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddItemDialogOpen(true)}
          >
            Add Item
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
            onClick={() => setAddPurchaseDialogOpen(true)}
          >
            Purchase Stock
          </Button>
          <Button
            variant="outlined"
            startIcon={<LocalShippingIcon />}
            onClick={() => setUsageManagementDialogOpen(true)}
          >
            Usage Management
          </Button>
          <Button
            variant="outlined"
            startIcon={<TableViewIcon />}
            onClick={() => setViewAllStockDialogOpen(true)}
          >
            View All Stock
          </Button>
        </Stack>
      </Box>

      {/* Company Overview Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarehouseIcon color="primary" />
            <Typography variant="h6">Company Overview</Typography>
          </Box>
        </Box>
        
        <Card 
          sx={{ 
            p: 3,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: (theme) => theme.shadows[8]
            }
          }}
          onClick={() => setCompanyOverviewOpen(true)}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  {Object.keys(getItemsByCompany()).length}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Companies
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  {inventorySummary.length}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Items
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  {Array.from(new Set(inventorySummary.map(item => item.category))).length}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Categories
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              endIcon={<TableViewIcon />}
            >
              View All Companies
            </Button>
          </Box>
        </Card>
      </Box>
      
      {/* Inventory Items Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Inventory Items
        </Typography>
        
        {inventorySummary.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Latest Purchase</TableCell>
                  <TableCell align="right">Available</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventorySummary.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const latestPurchase = item.latestPurchase;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.companyName}</TableCell>
                      <TableCell>
                        {itemCategories.find(cat => cat.value === item.category)?.label || item.category}
                      </TableCell>
                      <TableCell>{getUnitLabel(item.unit)}</TableCell>
                      <TableCell align="right">
                        {latestPurchase ? (
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {new Date(latestPurchase.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="primary.main" fontWeight="medium" sx={{ mt: 0.5 }}>
                              {parseFloat(latestPurchase.quantity).toFixed(2)} {getUnitLabel(item.unit)}
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              <Box component="span" sx={{ color: '#1976d2' }}>₹{parseFloat(latestPurchase.cost).toFixed(2)}</Box>
                              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                (₹{(parseFloat(latestPurchase.cost) / parseFloat(latestPurchase.quantity)).toFixed(2)}/unit)
                              </Typography>
                            </Typography>
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">{item.remaining.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={stockStatus.label} 
                          size="small"
                          sx={{ 
                            backgroundColor: alpha(stockStatus.color, 0.1),
                            color: stockStatus.color,
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(item)}
                          title="Edit item"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleViewHistory(item)}
                          title="Purchase history"
                          sx={{ color: theme.palette.info.main }}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedItem(item);
                            setUsageHistoryDialogOpen(true);
                          }}
                          title="Usage history"
                          sx={{ color: theme.palette.success.main }}
                        >
                          <TimelineIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteDialog(item)}
                          title="Delete item"
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <InventoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Inventory Items
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add your first inventory item to start tracking stock
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddItemDialogOpen(true)}
            >
              Add Item
            </Button>
          </Paper>
        )}
      </Box>
      
      {/* Add Item Dialog */}
      <Dialog
        open={addItemDialogOpen}
        onClose={() => setAddItemDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Inventory Item</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Item Name"
              name="name"
              value={itemFormData.name}
              onChange={handleItemFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              label="Company Name"
              name="companyName"
              value={itemFormData.companyName}
              onChange={handleItemFormChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={itemFormData.category}
                label="Category"
                onChange={handleItemFormChange}
              >
                {itemCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained">Add Item</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog
        open={editItemDialogOpen}
        onClose={() => setEditItemDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Inventory Item</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Item Name"
              name="name"
              value={itemFormData.name}
              onChange={handleItemFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              label="Company Name"
              name="companyName"
              value={itemFormData.companyName}
              onChange={handleItemFormChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={itemFormData.category}
                label="Category"
                onChange={handleItemFormChange}
              >
                {itemCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItemDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditItem} variant="contained">Update Item</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialogOpen}
        onClose={() => setDeleteConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the item "{selectedItem?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteItem} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Purchase Dialog */}
      <Dialog
        open={addPurchaseDialogOpen}
        onClose={() => setAddPurchaseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Purchase Stock</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Item</InputLabel>
              <Select
                name="itemId"
                value={purchaseFormData.itemId}
                label="Item"
                onChange={handlePurchaseFormChange}
              >
                {inventoryItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} ({item.companyName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  required
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={purchaseFormData.quantity}
                  onChange={handlePurchaseFormChange}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={purchaseFormData.unit || ''}
                    label="Unit"
                    onChange={handlePurchaseFormChange}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              margin="normal"
              label="Cost per Unit"
              name="cost"
              type="number"
              value={purchaseFormData.cost}
              onChange={handlePurchaseFormChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              label="Date"
              name="date"
              type="date"
              value={purchaseFormData.date}
              onChange={handlePurchaseFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Supplier"
              name="supplier"
              value={purchaseFormData.supplier}
              onChange={handlePurchaseFormChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={purchaseFormData.paymentMethod}
                label="Payment Method"
                onChange={handlePurchaseFormChange}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPurchaseDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPurchase} variant="contained">Record Purchase</Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Usage Dialog */}
      <Dialog
        open={addUsageDialogOpen}
        onClose={() => setAddUsageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Record Usage</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Item</InputLabel>
              <Select
                name="itemId"
                value={usageFormData.itemId}
                label="Item"
                onChange={handleUsageFormChange}
              >
                {inventoryItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Quantity"
              name="quantity"
              type="number"
              value={usageFormData.quantity}
              onChange={handleUsageFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              label="Date"
              name="date"
              type="date"
              value={usageFormData.date}
              onChange={handleUsageFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Purpose"
              name="purpose"
              value={usageFormData.purpose}
              onChange={handleUsageFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Notes"
              name="notes"
              multiline
              rows={2}
              value={usageFormData.notes}
              onChange={handleUsageFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUsageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUsage} variant="contained">Record Usage</Button>
        </DialogActions>
      </Dialog>
      
      {/* View All Stock Dialog with Alert */}
      <Dialog
        open={viewAllStockDialogOpen}
        onClose={() => setViewAllStockDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarehouseIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6">All Inventory Stock</Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setViewAllStockDialogOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Company Filter */}
          <Box sx={{ mb: 3, mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Filter by Company
            </Typography>
            <FormControl 
              sx={{ 
                width: '100%',
                maxWidth: 400,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            >
              <Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiSelect-select': {
                    py: 1.5
                  }
                }}
              >
                <MenuItem value="all">
                  <Typography>All Companies</Typography>
                </MenuItem>
                {getUniqueCompanies().map((company) => (
                  <MenuItem key={company} value={company}>
                    <Typography>{company}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Stock Status Banner */}
          <StockStatusBanner inventorySummary={getFilteredInventorySummary()} />
          
          {inventorySummary.length > 0 ? (
            <TableContainer sx={{ mt: 2 }}>
              <Table stickyHeader aria-label="stock table">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell align="right">Total Purchased</TableCell>
                    <TableCell align="right">Total Used</TableCell>
                    <TableCell align="right">Available</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredInventorySummary().map((item) => {
                    const stockStatus = getStockStatus(item);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.companyName}</TableCell>
                        <TableCell>
                          {itemCategories.find(cat => cat.value === item.category)?.label || item.category}
                        </TableCell>
                        <TableCell>{getUnitLabel(item.unit)}</TableCell>
                        <TableCell align="right">{item.totalPurchased.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.totalUsed.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.remaining.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={stockStatus.label} 
                            size="small" 
                            sx={{ 
                              backgroundColor: alpha(stockStatus.color, 0.1),
                              color: stockStatus.color,
                              fontWeight: 'medium'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => {
                              setViewAllStockDialogOpen(false);
                              setPurchaseFormData({
                                ...purchaseFormData,
                                itemId: item.id
                              });
                              setAddPurchaseDialogOpen(true);
                            }}
                          >
                            Purchase
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Inventory Items
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first inventory item to start tracking stock
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Item History Dialog */}
      <Dialog
        open={itemHistoryDialogOpen}
        onClose={() => setItemHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6">
                {getHistoryTitle()}
              </Typography>
            </Box>
            <Box>
              <Button 
                variant="contained"
                size="small"
                startIcon={<ShoppingCartIcon />}
                onClick={() => {
                  setItemHistoryDialogOpen(false);
                  setPurchaseFormData({
                    ...purchaseFormData,
                    itemId: selectedItem?.id || ''
                  });
                  setAddPurchaseDialogOpen(true);
                }}
                sx={{ mr: 2 }}
              >
                Record Purchase
              </Button>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setItemHistoryDialogOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {selectedItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedItem.companyName} • {itemCategories.find(cat => cat.value === selectedItem.category)?.label || selectedItem.category}
              </Typography>
            </Box>
          )}
          
          {getHistoryData().length > 0 ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Showing previous purchase records. The latest purchase is displayed in the main inventory list.
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Cost (₹)</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getHistoryData().map((record, index) => {
                      return (
                        <TableRow 
                          key={record.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.action.hover, 0.1)
                            }
                          }}
                        >
                          <TableCell>
                            {new Date(record.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <Typography>
                              {parseFloat(record.quantity).toFixed(2)} {getUnitLabel(selectedItem?.unit)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>
                              <Box component="span" sx={{ color: '#1976d2' }}>₹{parseFloat(record.cost).toFixed(2)}</Box>
                              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                (₹{(parseFloat(record.cost) / parseFloat(record.quantity)).toFixed(2)}/unit)
                              </Typography>
                            </Typography>
                          </TableCell>
                          <TableCell>{record.supplier || '-'}</TableCell>
                          <TableCell>
                            {paymentMethods.find(m => m.value === record.paymentMethod)?.label || record.paymentMethod}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePurchase(record.id)}
                              title="Delete purchase record"
                              sx={{ color: theme.palette.error.main }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No Previous Purchases
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {getHistoryData(true).length > 0 ? 
                  "Only the latest purchase exists and is shown in the main inventory list." : 
                  "No purchase records found for this item"}
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                  setItemHistoryDialogOpen(false);
                  setPurchaseFormData({
                    ...purchaseFormData,
                    itemId: selectedItem.id
                  });
                  setAddPurchaseDialogOpen(true);
                }}
                startIcon={<ShoppingCartIcon />}
              >
                Record Purchase
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Usage Management Dialog */}
      <Dialog
        open={usageManagementDialogOpen}
        onClose={() => setUsageManagementDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6">Usage Management</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setUsageManagementDialogOpen(false);
                  setUsageFormData({
                    ...usageFormData,
                    itemId: ''
                  });
                  setAddUsageDialogOpen(true);
                }}
                sx={{ mr: 2 }}
              >
                Record New Usage
              </Button>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setUsageManagementDialogOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Latest Usage</TableCell>
                  <TableCell align="right">Total Used</TableCell>
                  <TableCell align="right">Available</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventorySummary.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const latestUsage = item.latestUsage;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.companyName}</TableCell>
                      <TableCell>
                        {itemCategories.find(cat => cat.value === item.category)?.label || item.category}
                      </TableCell>
                      <TableCell>{getUnitLabel(item.unit)}</TableCell>
                      <TableCell align="right">
                        {latestUsage ? (
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {new Date(latestUsage.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="error.main" fontWeight="medium" sx={{ mt: 0.5 }}>
                              {parseFloat(latestUsage.quantity).toFixed(2)} {getUnitLabel(item.unit)}
                            </Typography>
                            {latestUsage.purpose && (
                              <Typography variant="body2" color="text.secondary">
                                Purpose: {latestUsage.purpose}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          sx={{ 
                            color: item.totalUsed > 0 ? 'error.main' : 'text.secondary',
                            fontWeight: item.totalUsed > 0 ? 'medium' : 'normal'
                          }}
                        >
                          {item.totalUsed.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          sx={{ 
                            color: stockStatus.color,
                            fontWeight: 'medium'
                          }}
                        >
                          {item.remaining.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={stockStatus.label} 
                          size="small"
                          sx={{ 
                            backgroundColor: alpha(stockStatus.color, 0.1),
                            color: stockStatus.color,
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setUsageManagementDialogOpen(false);
                            setUsageFormData({
                              ...usageFormData,
                              itemId: item.id
                            });
                            setAddUsageDialogOpen(true);
                          }}
                          title="Record Usage"
                          color="primary"
                        >
                          <LocalShippingIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedItem(item);
                            setUsageHistoryDialogOpen(true);
                          }}
                          title="Usage history"
                          sx={{ color: theme.palette.success.main }}
                        >
                          <TimelineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Usage History Dialog */}
      <Dialog
        open={usageHistoryDialogOpen}
        onClose={() => setUsageHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6">
                {getUsageHistoryTitle()}
              </Typography>
            </Box>
            <Box>
              <Button 
                variant="contained"
                size="small"
                startIcon={<LocalShippingIcon />}
                onClick={() => {
                  setUsageHistoryDialogOpen(false);
                  setUsageFormData({
                    ...usageFormData,
                    itemId: selectedItem?.id || ''
                  });
                  setAddUsageDialogOpen(true);
                }}
                sx={{ mr: 2 }}
              >
                Record Usage
              </Button>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setUsageHistoryDialogOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {selectedItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedItem.companyName} • {itemCategories.find(cat => cat.value === selectedItem.category)?.label || selectedItem.category}
              </Typography>
            </Box>
          )}
          
          {getUsageHistoryData().length > 0 ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Showing previous usage records. The latest usage is displayed in the usage management table.
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Purpose</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getUsageHistoryData().map((record) => {
                      return (
                        <TableRow 
                          key={record.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.action.hover, 0.1)
                            }
                          }}
                        >
                          <TableCell>
                            {new Date(record.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ color: 'error.main', fontWeight: 'medium' }}>
                              {parseFloat(record.quantity).toFixed(2)} {getUnitLabel(selectedItem?.unit)}
                            </Typography>
                          </TableCell>
                          <TableCell>{record.purpose || '-'}</TableCell>
                          <TableCell>{record.notes || '-'}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteUsage(record.id)}
                              title="Delete usage record"
                              sx={{ color: theme.palette.error.main }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No Previous Usage Records
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {getUsageHistoryData(true).length > 0 ? 
                  "Only the latest usage exists and is shown in the usage management table." : 
                  "No usage records found for this item"}
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                  setUsageHistoryDialogOpen(false);
                  setUsageFormData({
                    ...usageFormData,
                    itemId: selectedItem.id
                  });
                  setAddUsageDialogOpen(true);
                }}
                startIcon={<LocalShippingIcon />}
              >
                Record Usage
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Company Overview Dialog */}
      <Dialog
        open={companyOverviewOpen}
        onClose={() => {
          setCompanyOverviewOpen(false);
          setSelectedCompanyForOverview(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarehouseIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6">
                {selectedCompanyForOverview ? `${selectedCompanyForOverview.name} - Overview` : 'All Companies'}
              </Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => {
                setCompanyOverviewOpen(false);
                setSelectedCompanyForOverview(null);
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {!selectedCompanyForOverview ? (
            // All Companies View
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company Name</TableCell>
                    <TableCell align="right">Total Items</TableCell>
                    <TableCell align="right">Categories</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(getItemsByCompany()).map(([companyName, items]) => (
                    <TableRow 
                      key={companyName} 
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setSelectedCompanyForOverview({
                        name: companyName,
                        items: items
                      })}
                    >
                      <TableCell>{companyName || 'Unnamed Company'}</TableCell>
                      <TableCell align="right">{items.length}</TableCell>
                      <TableCell align="right">
                        {Array.from(new Set(items.map(item => item.category))).length}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompanyForOverview({
                              name: companyName,
                              items: items
                            });
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            // Single Company View
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell align="right">Latest Purchase</TableCell>
                    <TableCell align="right">Available</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCompanyForOverview.items.map((item) => {
                    const stockStatus = getStockStatus(item);
                    const latestPurchase = item.latestPurchase;
                    
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {itemCategories.find(cat => cat.value === item.category)?.label || item.category}
                        </TableCell>
                        <TableCell>{getUnitLabel(item.unit)}</TableCell>
                        <TableCell align="right">
                          {latestPurchase ? (
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {new Date(latestPurchase.date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="primary.main" fontWeight="medium" sx={{ mt: 0.5 }}>
                                {parseFloat(latestPurchase.quantity).toFixed(2)} {getUnitLabel(item.unit)}
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                <Box component="span" sx={{ color: '#1976d2' }}>₹{parseFloat(latestPurchase.cost).toFixed(2)}</Box>
                                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                  (₹{(parseFloat(latestPurchase.cost) / parseFloat(latestPurchase.quantity)).toFixed(2)}/unit)
                                </Typography>
                              </Typography>
                            </Box>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell align="right">{item.remaining.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={stockStatus.label} 
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(stockStatus.color, 0.1),
                              color: stockStatus.color,
                              fontWeight: 'medium'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditDialog(item)}
                            title="Edit item"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleViewHistory(item)}
                            title="Purchase history"
                            sx={{ color: theme.palette.info.main }}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedItem(item);
                              setUsageHistoryDialogOpen(true);
                            }}
                            title="Usage history"
                            sx={{ color: theme.palette.success.main }}
                          >
                            <TimelineIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(item)}
                            title="Delete item"
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default InventoryPage; 