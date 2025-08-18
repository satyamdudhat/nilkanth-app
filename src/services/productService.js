import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for local storage keys
const PRODUCTS_KEY = 'products';
const PRODUCT_CATEGORIES_KEY = 'product_categories';

// Helper function to get data from AsyncStorage
const getStoredData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting stored data for ${key}:`, error);
    return [];
  }
};

// Helper function to store data in AsyncStorage
const setStoredData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data for ${key}:`, error);
    throw error;
  }
};

// Helper function to initialize demo data if none exists
const initializeDemoData = async () => {
  // Check if products already exist
  const existingProducts = await getStoredData(PRODUCTS_KEY);
  if (existingProducts.length === 0) {
    // Sample bakery products
    const demoProducts = [
      { 
        id: '1001', 
        name: 'Premium Chocolate Cake', 
        category: 'cakes',
        price: 550, 
        description: 'Rich chocolate cake with premium cocoa and chocolate ganache',
        sales: 42,
        inStock: true
      },
      { 
        id: '1002', 
        name: 'Vanilla Bean Cupcakes', 
        category: 'cupcakes',
        price: 75, 
        description: 'Delicate cupcakes with real vanilla bean frosting',
        sales: 128,
        inStock: true
      },
      { 
        id: '1003', 
        name: 'Strawberry Cheesecake', 
        category: 'cakes',
        price: 600, 
        description: 'Creamy cheesecake with fresh strawberry topping',
        sales: 36,
        inStock: true
      },
      { 
        id: '1004', 
        name: 'Blueberry Muffins', 
        category: 'muffins',
        price: 60, 
        description: 'Soft muffins packed with fresh blueberries',
        sales: 95,
        inStock: true
      },
      { 
        id: '1005', 
        name: 'Red Velvet Cake', 
        category: 'cakes',
        price: 650, 
        description: 'Classic red velvet cake with cream cheese frosting',
        sales: 58,
        inStock: true
      },
      { 
        id: '1006', 
        name: 'Namkeen Mix', 
        category: 'snacks',
        price: 120, 
        description: 'Savory Indian snack mix with nuts and spices',
        sales: 75,
        inStock: true
      },
      { 
        id: '1007', 
        name: 'Butter Cookies', 
        category: 'cookies',
        price: 200, 
        description: 'Traditional buttery cookies, perfect with tea',
        sales: 62,
        inStock: true
      },
      { 
        id: '1008', 
        name: 'Chocolate Chip Cookies', 
        category: 'cookies',
        price: 250, 
        description: 'Classic cookies with chunks of premium chocolate',
        sales: 84,
        inStock: true
      },
      { 
        id: '1009', 
        name: 'Pineapple Pastry', 
        category: 'pastries',
        price: 85, 
        description: 'Light pastry with fresh pineapple filling',
        sales: 47,
        inStock: true
      },
      { 
        id: '1010', 
        name: 'Fruit Tart', 
        category: 'pastries',
        price: 120, 
        description: 'Buttery tart shell filled with custard and fresh fruits',
        sales: 39,
        inStock: true
      }
    ];
    
    await setStoredData(PRODUCTS_KEY, demoProducts);
  }
  
  // Check if categories already exist
  const existingCategories = await getStoredData(PRODUCT_CATEGORIES_KEY);
  if (existingCategories.length === 0) {
    const demoCategories = [
      { id: 'cakes', name: 'Cakes', count: 3 },
      { id: 'cupcakes', name: 'Cupcakes', count: 1 },
      { id: 'muffins', name: 'Muffins', count: 1 },
      { id: 'cookies', name: 'Cookies', count: 2 },
      { id: 'pastries', name: 'Pastries', count: 2 },
      { id: 'snacks', name: 'Snacks', count: 1 }
    ];
    
    await setStoredData(PRODUCT_CATEGORIES_KEY, demoCategories);
  }
};

// Initialize demo data
initializeDemoData();

// Get all products
export const getAllProducts = async () => {
  return await getStoredData(PRODUCTS_KEY);
};

// Get product by ID
export const getProductById = async (productId) => {
  const products = await getStoredData(PRODUCTS_KEY);
  return products.find(product => product.id === productId);
};

// Add a new product
export const addProduct = async (productData) => {
  const products = await getStoredData(PRODUCTS_KEY);
  
  // Create new product
  const newProduct = {
    ...productData,
    id: Date.now().toString(),
    sales: 0,
    inStock: true,
    createdAt: new Date().toISOString()
  };
  
  // Add to products array
  const updatedProducts = [...products, newProduct];
  await setStoredData(PRODUCTS_KEY, updatedProducts);
  
  // Update category count
  await updateCategoryCount(productData.category);
  
  return newProduct;
};

// Update a product
export const updateProduct = async (productId, productData) => {
  const products = await getStoredData(PRODUCTS_KEY);
  
  // Find original product to check if category changed
  const originalProduct = products.find(product => product.id === productId);
  
  // Update the product
  const updatedProducts = products.map(product => {
    if (product.id === productId) {
      return {
        ...product,
        ...productData,
        updatedAt: new Date().toISOString()
      };
    }
    return product;
  });
  
  await setStoredData(PRODUCTS_KEY, updatedProducts);
  
  // If category changed, update category counts
  if (originalProduct && originalProduct.category !== productData.category) {
    await updateCategoryCount(originalProduct.category, -1);
    await updateCategoryCount(productData.category);
  }
  
  return updatedProducts.find(product => product.id === productId);
};

// Delete a product
export const deleteProduct = async (productId) => {
  const products = await getStoredData(PRODUCTS_KEY);
  
  // Find product to get its category before deletion
  const productToDelete = products.find(product => product.id === productId);
  
  // Filter out the product
  const updatedProducts = products.filter(product => product.id !== productId);
  await setStoredData(PRODUCTS_KEY, updatedProducts);
  
  // Update category count
  if (productToDelete) {
    await updateCategoryCount(productToDelete.category, -1);
  }
  
  return updatedProducts;
};

// Get all product categories
export const getProductCategories = async () => {
  return await getStoredData(PRODUCT_CATEGORIES_KEY);
};

// Add a new product category
export const addProductCategory = async (categoryData) => {
  const categories = await getStoredData(PRODUCT_CATEGORIES_KEY);
  
  // Create new category
  const newCategory = {
    ...categoryData,
    id: categoryData.id || Date.now().toString(),
    count: 0
  };
  
  // Add to categories array
  const updatedCategories = [...categories, newCategory];
  await setStoredData(PRODUCT_CATEGORIES_KEY, updatedCategories);
  
  return newCategory;
};

// Update category count
const updateCategoryCount = async (categoryId, change = 1) => {
  const categories = await getStoredData(PRODUCT_CATEGORIES_KEY);
  
  // Update the category count
  const updatedCategories = categories.map(category => {
    if (category.id === categoryId) {
      return {
        ...category,
        count: Math.max(0, category.count + change)
      };
    }
    return category;
  });
  
  await setStoredData(PRODUCT_CATEGORIES_KEY, updatedCategories);
};

// Get top selling products
export const getTopSellingProducts = async (limit = 5) => {
  const products = await getStoredData(PRODUCTS_KEY);
  
  // Sort by sales (highest first) and take the top N
  return [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);
};

// Record a product sale
export const recordProductSale = async (productId, quantity = 1) => {
  const products = await getStoredData(PRODUCTS_KEY);
  
  // Update the product sales count
  const updatedProducts = products.map(product => {
    if (product.id === productId) {
      return {
        ...product,
        sales: product.sales + quantity
      };
    }
    return product;
  });
  
  await setStoredData(PRODUCTS_KEY, updatedProducts);
  return updatedProducts.find(product => product.id === productId);
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
  const products = await getStoredData(PRODUCTS_KEY);
  return products.filter(product => product.category === categoryId);
};

// Search products
export const searchProducts = async (query) => {
  const products = await getStoredData(PRODUCTS_KEY);
  const searchTerm = query.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
};