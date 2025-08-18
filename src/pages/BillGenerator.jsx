import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Box, Typography, TextField, Button, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText,
  IconButton, InputAdornment, Card, CardMedia, CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

// Define products list with the new items
const PRODUCTS = [
  { 
    id: '1001',
    name: 'Premium Chocolate Cake',
    description: 'Delicious chocolate cake with premium cocoa',
    rate: 550,
    launchDate: '15/06/2023'
  },
  { 
    id: '1002',
    name: 'Vanilla Bean Cupcakes',
    description: 'Vanilla cupcakes with vanilla bean frosting',
    rate: 75,
    launchDate: '21/07/2023'
  },
  { 
    id: '1003',
    name: 'Strawberry Cheesecake',
    description: 'Classic cheesecake topped with fresh strawberries',
    rate: 600,
    launchDate: '05/05/2023'
  },
  { 
    id: '1004',
    name: 'Blueberry Muffins',
    description: 'Fluffy muffins with fresh blueberries',
    rate: 60,
    launchDate: '10/08/2023'
  },
  { 
    id: '1005',
    name: 'Red Velvet Cake',
    description: 'Classic red velvet cake with cream cheese frosting',
    rate: 650,
    launchDate: '12/04/2023'
  },
  { 
    id: '1006',
    name: 'Namkeen Mix',
    description: 'Spicy and crunchy snack mix',
    rate: 120,
    launchDate: '10/03/2023'
  },
  {
    id: '1007',
    name: 'Black Forest Cake',
    description: 'Rich chocolate cake with cherries and whipped cream',
    rate: 700,
    launchDate: '01/01/2024'
  },
  {
    id: '1008',
    name: 'Butter Cookies',
    description: 'Classic homemade butter cookies',
    rate: 150,
    launchDate: '15/01/2024'
  },
  {
    id: '1009',
    name: 'Fruit Danish Pastry',
    description: 'Flaky pastry with mixed fruit filling',
    rate: 85,
    launchDate: '20/01/2024'
  },
  {
    id: '1010',
    name: 'Chocolate Chip Cookies',
    description: 'Fresh baked cookies with premium chocolate chips',
    rate: 180,
    launchDate: '05/02/2024'
  },
  {
    id: '1011',
    name: 'Pineapple Cake',
    description: 'Soft cake with fresh pineapple and cream',
    rate: 580,
    launchDate: '10/02/2024'
  },
  {
    id: '1012',
    name: 'Cheese Puffs',
    description: 'Light and airy cheese-flavored pastries',
    rate: 90,
    launchDate: '15/02/2024'
  },
  {
    id: '1013',
    name: 'Almond Croissant',
    description: 'Buttery croissant with almond filling',
    rate: 95,
    launchDate: '20/02/2024'
  },
  {
    id: '1014',
    name: 'Chocolate Brownie',
    description: 'Rich and fudgy chocolate brownies',
    rate: 70,
    launchDate: '25/02/2024'
  },
  {
    id: '1015',
    name: 'Fruit Cake',
    description: 'Traditional cake loaded with dried fruits',
    rate: 450,
    launchDate: '01/03/2024'
  },
  {
    id: '1016',
    name: 'Pizza Roll',
    description: 'Soft rolls with pizza filling and herbs',
    rate: 80,
    launchDate: '05/03/2024'
  },
  {
    id: '1017',
    name: 'Garlic Bread',
    description: 'Fresh baked bread with garlic butter',
    rate: 110,
    launchDate: '10/03/2024'
  },
  {
    id: '1018',
    name: 'Cream Puffs',
    description: 'Light pastry shells filled with sweet cream',
    rate: 140,
    launchDate: '15/03/2024'
  }
];

// Import logo using Vite's public asset handling
const logoUrl = new URL('/nilkanth-logo.png', import.meta.url).href;

const BillGenerator = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [partyDetails, setPartyDetails] = useState({
    name: '',
    phone: '',
    email: '',
    gstin: ''
  });
  const logoRef = useRef(null);

  useEffect(() => {
    const lastInvoiceNumber = parseInt(localStorage.getItem('lastInvoiceNumber') || '0', 10);
    const newInvoiceNumber = lastInvoiceNumber + 1;
    setInvoiceNumber(newInvoiceNumber.toString().padStart(4, '0'));
    localStorage.setItem('lastInvoiceNumber', newInvoiceNumber.toString());
  }, []);

  // Enhanced logo loading with error handling
  useEffect(() => {
    const logo = new Image();
    logo.src = logoUrl;
    logo.onload = () => {
      logoRef.current = logo;
      setLogoLoaded(true);
      setLogoError(false);
    };
    logo.onerror = (error) => {
      console.error('Error loading logo:', error);
      setLogoError(true);
      setLogoLoaded(false);
    };
  }, []);

  const handleAddProduct = (product) => {
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      setItems(items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, {
        id: product.id,
        description: product.name,
        quantity: 1,
        price: product.rate
      }]);
    }
    setIsProductDialogOpen(false);
  };

  const handleQuantityChange = (id, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    if (numQuantity >= 0) {
      setItems(items.map(item =>
        item.id === id
          ? { ...item, quantity: numQuantity }
          : item
      ));
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredProducts = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate subtotal, tax, and grand total
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Debug function to check items before PDF generation
  const debugItems = () => {
    console.log('Current items:', items);
    console.log('Items for table:', prepareItemsForTable());
    console.log('Subtotal:', calculateSubtotal());
    console.log('Tax:', calculateTax());
    console.log('Total:', calculateTotal());
  };

  // Make sure items are properly formatted for the table
  const prepareItemsForTable = () => {
    if (!items || items.length === 0) {
      return [['No items added', '', '', '']];
    }
    
    return items.map(item => [
      item.description || '',
      item.quantity || '1',
      (item.price || 0).toFixed(2),
      ((item.quantity || 1) * (item.price || 0)).toFixed(2)
    ]);
  };

  const handleDownloadPDF = () => {
    try {
      debugItems();
      
      const doc = new jsPDF();
      
      // Enhanced logo handling in PDF - positioned on top left with larger size
      if (logoRef.current && logoLoaded) {
        try {
          // Calculate logo dimensions while maintaining aspect ratio
          const logoAspectRatio = logoRef.current.width / logoRef.current.height;
          const maxLogoWidth = 90; // Increased from 60
          const maxLogoHeight = 45; // Increased from 30
          
          let logoWidth = maxLogoWidth;
          let logoHeight = logoWidth / logoAspectRatio;
          
          if (logoHeight > maxLogoHeight) {
            logoHeight = maxLogoHeight;
            logoWidth = logoHeight * logoAspectRatio;
          }
          
          // Position logo on the top left with some margin
          doc.addImage(
            logoRef.current,
            'PNG',
            15, // Left margin
            15, // Top margin
            logoWidth,
            logoHeight
          );
        } catch (logoError) {
          console.error('Error adding logo to PDF:', logoError);
        }
      }
      
      // Add invoice title - centered
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
      
      // Add invoice details - right aligned
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No: ${invoiceNumber}`, doc.internal.pageSize.getWidth() - 15, 20, { align: "right" });
      doc.text(`Date: ${issuedDate}`, doc.internal.pageSize.getWidth() - 15, 27, { align: "right" });
      
      // Add party details
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Party Details:", 15, 60);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${partyDetails.name || '-'}`, 15, 70);
      doc.text(`Phone: ${partyDetails.phone || '-'}`, 15, 77);
      doc.text(`Email: ${partyDetails.email || '-'}`, 15, 84);
      doc.text(`GSTIN: ${partyDetails.gstin || '-'}`, 15, 91);
      
      // Add horizontal line
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 100, doc.internal.pageSize.getWidth() - 15, 100);
      
      // Prepare items for table
      const tableItems = prepareItemsForTable();
      
      // Generate table with items
      autoTable(doc, {
        startY: 110,
        head: [['Description', 'Qty', 'Price', 'Amount']],
        body: tableItems,
        theme: 'plain',
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 50, halign: 'right' },
          3: { cellWidth: 50, halign: 'right' }
        },
        styles: {
          cellPadding: 5,
          fontSize: 10,
          lineColor: [220, 220, 220]
        },
        margin: { left: 15, right: 15 }
      });
      
      const finalY = doc.lastAutoTable.finalY + 10;
      
      // Add summary with border
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.rect(doc.internal.pageSize.getWidth() - 85, finalY, 70, 60);
      
      // Calculate totals
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();
      
      // Add summary text
      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", doc.internal.pageSize.getWidth() - 75, finalY + 15);
      doc.text("GST (18%):", doc.internal.pageSize.getWidth() - 75, finalY + 30);
      
      doc.setFont("helvetica", "bold");
      doc.text("Grand Total:", doc.internal.pageSize.getWidth() - 75, finalY + 45);
      
      // Add amounts
      doc.setFont("helvetica", "normal");
      doc.text(`${subtotal.toFixed(2)}`, doc.internal.pageSize.getWidth() - 20, finalY + 15, { align: "right" });
      doc.text(`${tax.toFixed(2)}`, doc.internal.pageSize.getWidth() - 20, finalY + 30, { align: "right" });
      
      doc.setFont("helvetica", "bold");
      doc.text(`${total.toFixed(2)}`, doc.internal.pageSize.getWidth() - 20, finalY + 45, { align: "right" });
      
      // Add thank you note
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for your business!", doc.internal.pageSize.getWidth() / 2, finalY + 80, { align: "center" });
      
      // Add signature line
      doc.line(doc.internal.pageSize.getWidth() / 2 - 40, finalY + 110, doc.internal.pageSize.getWidth() / 2 + 40, finalY + 110);
      doc.text("Authorized Signature", doc.internal.pageSize.getWidth() / 2, finalY + 120, { align: "center" });
      
      // Save the PDF
      doc.save(`Invoice_${invoiceNumber}.pdf`);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(`Error generating PDF: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: '#fff' }}>
        {/* Header with Logo and Invoice Number */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Logo on the left */}
          <Box sx={{ 
            width: '300px', // Increased from 200px
            height: '120px', // Increased from 80px
            display: 'flex',
            alignItems: 'center',
            mr: 2 // Add margin right to maintain spacing from invoice number
          }}>
            {logoError ? (
              <Typography color="error">Logo could not be loaded</Typography>
            ) : (
              <img 
                src={logoUrl}
                alt="Nilkanth Logo" 
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  console.error('Error loading logo in UI');
                  setLogoError(true);
                }}
              />
            )}
          </Box>

          {/* Invoice Number on the right */}
          <Box sx={{ pt: 2 }}> {/* Added top padding to align with larger logo */}
            <Typography variant="body1" color="text.secondary">
              Invoice no: {invoiceNumber}
            </Typography>
          </Box>
        </Box>

        {/* Issue Date */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Issue Date"
            type="date"
            value={issuedDate}
            onChange={(e) => setIssuedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>

        {/* Party Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Party Details:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Party Name"
              value={partyDetails.name}
              onChange={(e) => setPartyDetails({ ...partyDetails, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={partyDetails.phone}
              onChange={(e) => setPartyDetails({ ...partyDetails, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email Address"
              value={partyDetails.email}
              onChange={(e) => setPartyDetails({ ...partyDetails, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="GSTIN"
              value={partyDetails.gstin}
              onChange={(e) => setPartyDetails({ ...partyDetails, gstin: e.target.value })}
              fullWidth
            />
          </Box>
        </Box>

        {/* Items Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Items</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsProductDialogOpen(true)}
            >
              Add Item
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>DESCRIPTION</TableCell>
                  <TableCell align="center">QTY</TableCell>
                  <TableCell align="right">PRICE</TableCell>
                  <TableCell align="right">SUBTOTAL</TableCell>
                  <TableCell padding="checkbox"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        inputProps={{ 
                          min: 1,
                          style: { textAlign: 'center' }
                        }}
                        size="small"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="right">₹{item.price}</TableCell>
                    <TableCell align="right">₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                    <TableCell padding="checkbox">
                      <IconButton size="small" onClick={() => handleRemoveItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No items added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Totals */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 4 }}>
          <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>TAX (18% GST)</Typography>
              <Typography>₹{calculateTax().toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Typography>GRAND TOTAL</Typography>
              <Typography>
                ₹{calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Product Selection Dialog */}
        <Dialog
          open={isProductDialogOpen}
          onClose={() => setIsProductDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" gutterBottom>Select Product</Typography>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2, p: 2 }}>
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 }
                  }}
                  onClick={() => handleAddProduct(product)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="h6" color="primary">
                        ₹{product.rate}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {product.id}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Launch: {product.launchDate}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </DialogContent>
        </Dialog>

        {/* Download Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleDownloadPDF}
            disabled={items.length === 0}
            sx={{ minWidth: 200 }}
          >
            Download Invoice
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BillGenerator; 