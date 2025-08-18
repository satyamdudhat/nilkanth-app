import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
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
  MenuItem,
  TextField,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';

// Import services
import {
  getActiveInventoryItems,
  addUsage,
  getUsageForItem,
  getAllItemsSummary
} from '../services/inventoryService';

const UsagePage = () => {
  const theme = useTheme();
  
  // State for inventory data
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [usageHistory, setUsageHistory] = useState([]);
  
  // Dialog states
  const [addUsageDialogOpen, setAddUsageDialogOpen] = useState(false);
  const [itemHistoryDialogOpen, setItemHistoryDialogOpen] = useState(false);
  
  // Form state
  const [usageFormData, setUsageFormData] = useState({
    itemId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    notes: ''
  });
  
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
  
  // Handle form change for usage
  const handleUsageFormChange = (e) => {
    const { name, value } = e.target;
    setUsageFormData({
      ...usageFormData,
      [name]: value
    });
  };
  
  // Handle add usage
  const handleAddUsage = () => {
    try {
      // Validate form
      if (!usageFormData.itemId || !usageFormData.quantity || !usageFormData.date) {
        alert("Please fill in all required fields");
        return;
      }
      
      // Add new usage
      addUsage(usageFormData);
      
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
    } catch (error) {
      alert(`Error adding usage: ${error.message}`);
    }
  };
  
  // Handle viewing item history
  const handleViewUsageHistory = (item) => {
    setSelectedItem(item);
    const usageData = getUsageForItem(item.id);
    setUsageHistory(usageData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setItemHistoryDialogOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Usage Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and record usage of inventory items
        </Typography>
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddUsageDialogOpen(true)}
        >
          Record Usage
        </Button>
      </Box>
      
      {/* Inventory Items Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Inventory Items Usage
        </Typography>
        
        {inventorySummary.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Total Used</TableCell>
                  <TableCell align="right">Available</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventorySummary.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        {item.category}
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell align="right">{item.totalUsed.toFixed(2)}</TableCell>
                      <TableCell align="right">{item.remaining.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<LocalShippingIcon />}
                          onClick={() => {
                            setUsageFormData({
                              ...usageFormData,
                              itemId: item.id
                            });
                            setAddUsageDialogOpen(true);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Record Usage
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleViewUsageHistory(item)}
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
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No Inventory Items
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add inventory items first to record usage
            </Typography>
          </Paper>
        )}
      </Box>
      
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
              <TimelineIcon sx={{ mr: 1.5, color: theme.palette.success.main }} />
              <Typography variant="h6">
                {selectedItem ? `Usage History: ${selectedItem.name}` : 'Usage History'}
              </Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setItemHistoryDialogOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {selectedItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedItem.category} • {selectedItem.unit}
              </Typography>
            </Box>
          )}
          
          {usageHistory.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usageHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{record.quantity.toFixed(2)}</TableCell>
                      <TableCell>{record.purpose || 'Not specified'}</TableCell>
                      <TableCell>{record.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No Usage History
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No usage records found for this item
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => {
                  setItemHistoryDialogOpen(false);
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
    </Container>
  );
};

export default UsagePage; 