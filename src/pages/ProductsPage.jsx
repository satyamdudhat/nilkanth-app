import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CardHeader,
  Divider,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';

const ProductsPage = () => {
  const theme = useTheme();
  
  // Static product data
  const [products, setProducts] = useState([
    {
      id: 1001,
      name: 'Premium Chocolate Cake',
      category: 'cakes',
      price: 550,
      description: 'Delicious chocolate cake with premium cocoa',
      inStock: true,
      stockQuantity: 10,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      launchDate: '2023-06-15'
    },
    {
      id: 1002,
      name: 'Vanilla Bean Cupcakes',
      category: 'cupcakes',
      price: 75,
      description: 'Vanilla cupcakes with vanilla bean frosting',
      inStock: true,
      stockQuantity: 24,
      image: 'https://images.unsplash.com/photo-1606890658317-7d14490b76fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dmFuaWxsYSUyMGN1cGNha2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      launchDate: '2023-07-21'
    },
    {
      id: 1003,
      name: 'Strawberry Cheesecake',
      category: 'cakes',
      price: 600,
      description: 'Classic cheesecake topped with fresh strawberries',
      inStock: true,
      stockQuantity: 5,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c3RyYXdiZXJyeSUyMGNoZWVzZWNha2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      launchDate: '2023-05-05'
    },
    {
      id: 1004,
      name: 'Blueberry Muffins',
      category: 'pastries',
      price: 60,
      description: 'Fluffy muffins with fresh blueberries',
      inStock: false,
      stockQuantity: 0,
      image: 'https://images.unsplash.com/photo-1587411768515-eeac0647deed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ymx1ZWJlcnJ5JTIwbXVmZmlufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      launchDate: '2023-08-10'
    },
    {
      id: 1005,
      name: 'Red Velvet Cake',
      category: 'cakes',
      price: 650,
      description: 'Classic red velvet cake with cream cheese frosting',
      inStock: true,
      stockQuantity: 3,
      image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVkJTIwdmVsdmV0JTIwY2FrZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      launchDate: '2023-04-12'
    },
    {
      id: 1006,
      name: 'Namkeen Mix',
      category: 'namkeen',
      price: 120,
      description: 'Spicy and crunchy snack mix',
      inStock: true,
      stockQuantity: 15,
      image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c25hY2tzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      launchDate: '2023-03-10'
    }
  ]);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Dialog states
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [allProductsDialogOpen, setAllProductsDialogOpen] = useState(false);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  
  // Form state
  const [productFormData, setProductFormData] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    description: '',
    stockQuantity: '',
    image: '',
    launchDate: new Date().toISOString().split('T')[0]
  });
  
  // Product categories
  const productCategories = [
    { value: 'cakes', label: 'Cakes' },
    { value: 'cupcakes', label: 'Cupcakes' },
    { value: 'pastries', label: 'Pastries' },
    { value: 'cookies', label: 'Cookies' },
    { value: 'breads', label: 'Breads' },
    { value: 'namkeen', label: 'Namkeen' },
    { value: 'other', label: 'Other' }
  ];

  // Filter products based on search term and category
  useEffect(() => {
    let result = products;
    
    // Filter by category if not "all"
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term if it exists
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory]);
  
  // Handle form change for new product
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: value
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductFormData({
          ...productFormData,
          image: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Generate next product ID
  const generateProductId = () => {
    const maxId = Math.max(...products.map(p => p.id), 1000);
    return maxId + 1;
  };

  // Handle open edit product dialog
  const handleEditProduct = (product) => {
    setProductFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      stockQuantity: product.stockQuantity,
      image: product.image,
      launchDate: product.launchDate
    });
    setEditProductId(product.id);
    setAddProductDialogOpen(true);
  };
  
  // Handle open add product dialog
  const handleOpenAddProductDialog = () => {
    // Generate a new product ID when opening the dialog
    const newId = generateProductId();
    setProductFormData({
      ...productFormData,
      id: newId
    });
    setAddProductDialogOpen(true);
  };

  // Handle add or update product
  const handleAddProduct = () => {
    try {
      // Validate form
      if (!productFormData.name || !productFormData.category || !productFormData.price) {
        alert("Please fill in all required fields");
        return;
      }
      if (editProductId) {
        // Update existing product
        setProducts(products.map(p =>
          p.id === editProductId
            ? {
                ...p,
                name: productFormData.name,
                category: productFormData.category,
                price: parseFloat(productFormData.price),
                description: productFormData.description || '',
                stockQuantity: parseInt(productFormData.stockQuantity) || 0,
                image: productFormData.image || 'https://via.placeholder.com/400x300?text=No+Image',
                launchDate: productFormData.launchDate
              }
            : p
        ));
      } else {
        // Create new product with form data and auto-generated ID
        const newProduct = {
          id: parseInt(productFormData.id),
          name: productFormData.name,
          category: productFormData.category,
          price: parseFloat(productFormData.price),
          description: productFormData.description || '',
          inStock: parseInt(productFormData.stockQuantity) > 0,
          stockQuantity: parseInt(productFormData.stockQuantity) || 0,
          image: productFormData.image || 'https://via.placeholder.com/400x300?text=No+Image',
          launchDate: productFormData.launchDate
        };
        setProducts([...products, newProduct]);
      }
      // Reset form and close dialog
      setProductFormData({
        id: '',
        name: '',
        category: '',
        price: '',
        description: '',
        stockQuantity: '',
        image: '',
        launchDate: new Date().toISOString().split('T')[0]
      });
      setEditProductId(null);
      setAddProductDialogOpen(false);
    } catch (error) {
      alert(`Error adding product: ${error.message}`);
    }
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  // Get category label
  const getCategoryLabel = (categoryValue) => {
    const category = productCategories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // When opening the categories dialog, always reset to categories list
  const handleOpenCategoriesDialog = () => {
    setCategoriesDialogOpen(true);
    setSelectedCategory(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Products Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your product catalog
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddProductDialog}
            >
              Add New Product
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Search and Category Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Products Summary Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{ p: 3, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          >
            <ShoppingCartIcon
              sx={{
                fontSize: 40,
                color: theme.palette.primary.main,
                mr: 2
              }}
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Products
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {products.length}
              </Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
            onClick={handleOpenCategoriesDialog}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CategoryIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.secondary.main,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: theme.palette.secondary.lighter || alpha(theme.palette.secondary.light, 0.2),
                  mr: 2
                }}
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {new Set(products.map(p => p.category)).size}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  title={`ID: ${product.id}`}
                  subheader={`Launch: ${formatDate(product.launchDate)}`}
                  sx={{ pb: 1 }}
                />
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(product.launchDate)}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, width: '100%' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or category filter
            </Typography>
          </Box>
        )}
      </Grid>
      
      {/* Add Product Dialog */}
      <Dialog
        open={addProductDialogOpen}
        onClose={() => {
          setAddProductDialogOpen(false);
          setEditProductId(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">{editProductId ? 'Edit Product' : 'Add New Product'}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
              setAddProductDialogOpen(false);
              setEditProductId(null);
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.light, 0.05), borderRadius: 1, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
                backgroundColor: 'white',
                borderRadius: 1,
                border: '1px dashed #ccc',
                mb: 2
              }}
            >
              {productFormData.image ? (
                <img
                  src={productFormData.image}
                  alt="Product preview"
                  style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                />
              ) : (
                <>
                  <ImageIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.3), mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Product image preview
                  </Typography>
                </>
              )}
            </Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<ImageIcon />}
              sx={{ mb: 1 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product ID"
                name="id"
                value={productFormData.id}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size="small"
                helperText="Auto-generated ID"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Launch Date"
                name="launchDate"
                type="date"
                value={productFormData.launchDate}
                onChange={handleProductFormChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={productFormData.name}
                onChange={handleProductFormChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required variant="outlined" size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={productFormData.category}
                  onChange={handleProductFormChange}
                  label="Category"
                >
                  {productCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Base Price (₹)"
                name="price"
                type="number"
                value={productFormData.price}
                onChange={handleProductFormChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={productFormData.description}
                onChange={handleProductFormChange}
                multiline
                rows={2}
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={productFormData.stockQuantity}
                onChange={handleProductFormChange}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => {
              setAddProductDialogOpen(false);
              setEditProductId(null);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddProduct}
            variant="contained"
            startIcon={editProductId ? <EditIcon /> : <AddIcon />}
          >
            {editProductId ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Categories Dialog */}
      <Dialog
        open={categoriesDialogOpen}
        onClose={() => {
          setCategoriesDialogOpen(false);
          setSelectedCategory('all');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {!selectedCategory ? 'Categories Overview' : `${getCategoryLabel(selectedCategory)} Products`}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
              setCategoriesDialogOpen(false);
              setSelectedCategory('all');
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {!selectedCategory ? (
            // Categories Overview
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'flex-start',
                alignItems: 'center',
                minHeight: 120,
                py: 2
              }}
            >
              {productCategories
                .filter(category => products.filter(p => p.category === category.value).length > 0)
                .map((category) => {
                  const categoryProducts = products.filter(p => p.category === category.value);
                  return (
                    <Box
                      key={category.value}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 140,
                        minHeight: 70,
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 2,
                        backgroundColor: 'background.paper',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: 4 }
                      }}
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        {category.label}
                      </Typography>
                      <Chip
                        label={`${categoryProducts.length} products`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  );
                })}
            </Box>
          ) : (
            // Selected Category Products
            <Box>
              <Button 
                startIcon={<CategoryIcon />}
                onClick={() => setSelectedCategory(null)}
                sx={{ mb: 2 }}
              >
                Back to Categories
              </Button>
              <Grid container spacing={2}>
                {products
                  .filter(p => p.category === selectedCategory)
                  .map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={product.image}
                          alt={product.name}
                        />
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ₹{product.price} • {formatDate(product.launchDate)}
                          </Typography>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ p: 2 }}>
                          <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditProduct(product)}>
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => {
              setCategoriesDialogOpen(false);
              setSelectedCategory('all');
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductsPage; 