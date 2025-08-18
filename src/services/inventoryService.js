import AsyncStorage from '@react-native-async-storage/async-storage';

// Local storage keys
const ITEMS_KEY = 'inventory_items';
const PURCHASES_KEY = 'inventory_purchases';
const USAGE_KEY = 'inventory_usage';

// Helper to get data from AsyncStorage with a default empty array
const getStoredData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting stored data for ${key}:`, error);
    return [];
  }
};

// Helper to store data in AsyncStorage
const setStoredData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data for ${key}:`, error);
    throw error;
  }
};

// ================ Items Management ================

// Add a new inventory item
export const addInventoryItem = async (itemData) => {
  const items = await getStoredData(ITEMS_KEY);
  
  // Create new item with defaults for fields not provided
  const newItem = {
    ...itemData,
    id: Date.now(),
    description: itemData.description || '',
    unit: itemData.unit || 'units',
    minLevel: itemData.minLevel || 0,
    notes: itemData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    active: true
  };
  
  // Add to items array
  const updatedItems = [...items, newItem];
  await setStoredData(ITEMS_KEY, updatedItems);
  
  return newItem;
};

// Get all inventory items
export const getAllInventoryItems = async () => {
  return await getStoredData(ITEMS_KEY);
};

// Get active inventory items
export const getActiveInventoryItems = async () => {
  const items = await getStoredData(ITEMS_KEY);
  return items.filter(item => item.active !== false);
};

// Update an inventory item
export const updateInventoryItem = async (itemId, itemData) => {
  const items = await getStoredData(ITEMS_KEY);
  
  // Find and update the item
  const updatedItems = items.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        ...itemData,
        updatedAt: new Date().toISOString()
      };
    }
    return item;
  });
  
  await setStoredData(ITEMS_KEY, updatedItems);
  return updatedItems.find(item => item.id === itemId);
};

// Delete (deactivate) an inventory item
export const deactivateInventoryItem = async (itemId) => {
  const items = await getStoredData(ITEMS_KEY);
  
  // Find and deactivate the item
  const updatedItems = items.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        active: false,
        updatedAt: new Date().toISOString()
      };
    }
    return item;
  });
  
  await setStoredData(ITEMS_KEY, updatedItems);
  return true;
};

// Delete an inventory item completely (not just deactivate)
export const deleteInventoryItem = async (itemId) => {
  const items = await getStoredData(ITEMS_KEY);
  
  // Filter out the item with the given ID
  const updatedItems = items.filter(item => item.id !== itemId);
  
  // Check if an item was actually removed
  if (updatedItems.length === items.length) {
    throw new Error(`Item with ID ${itemId} not found`);
  }
  
  // Also delete related purchases and usage records
  await deletePurchasesForItem(itemId);
  await deleteUsageForItem(itemId);
  
  await setStoredData(ITEMS_KEY, updatedItems);
  return true;
};

// ================ Purchases Management ================

// Add a new purchase record
export const addPurchase = async (purchaseData) => {
  const purchases = await getStoredData(PURCHASES_KEY);
  
  // Create new purchase record
  const newPurchase = {
    ...purchaseData,
    id: Date.now(),
    quantity: parseFloat(purchaseData.quantity),
    cost: parseFloat(purchaseData.cost || 0),
    paymentMethod: purchaseData.paymentMethod || 'unpaid',
    createdAt: new Date().toISOString(),
    // Ensure date is stored in YYYY-MM-DD format
    date: purchaseData.date || new Date().toISOString().split('T')[0]
  };
  
  // Add to purchases array
  const updatedPurchases = [...purchases, newPurchase];
  await setStoredData(PURCHASES_KEY, updatedPurchases);
  
  return newPurchase;
};

// Get all purchases
export const getAllPurchases = async () => {
  return await getStoredData(PURCHASES_KEY);
};

// Get purchases for a specific item
export const getPurchasesForItem = async (itemId) => {
  const purchases = await getStoredData(PURCHASES_KEY);
  return purchases.filter(purchase => purchase.itemId === itemId);
};

// Delete all purchases for a specific item
export const deletePurchasesForItem = async (itemId) => {
  const purchases = await getStoredData(PURCHASES_KEY);
  
  // Filter out purchases for the specified item
  const updatedPurchases = purchases.filter(purchase => purchase.itemId !== itemId);
  
  await setStoredData(PURCHASES_KEY, updatedPurchases);
  return true;
};

// Delete a specific purchase
export const deletePurchase = async (purchaseId) => {
  const purchases = await getStoredData(PURCHASES_KEY);
  
  // Filter out the purchase with the given ID
  const updatedPurchases = purchases.filter(purchase => purchase.id !== purchaseId);
  
  // Check if a purchase was actually removed
  if (updatedPurchases.length === purchases.length) {
    throw new Error(`Purchase with ID ${purchaseId} not found`);
  }
  
  await setStoredData(PURCHASES_KEY, updatedPurchases);
  return true;
};

// ================ Usage Management ================

// Add a new usage record
export const addUsage = async (usageData) => {
  const usage = await getStoredData(USAGE_KEY);
  
  // Create new usage record
  const newUsage = {
    ...usageData,
    id: Date.now(),
    quantity: parseFloat(usageData.quantity),
    createdAt: new Date().toISOString(),
    // Ensure date is stored in YYYY-MM-DD format
    date: usageData.date || new Date().toISOString().split('T')[0]
  };
  
  // Add to usage array
  const updatedUsage = [...usage, newUsage];
  await setStoredData(USAGE_KEY, updatedUsage);
  
  return newUsage;
};

// Get all usage records
export const getAllUsage = async () => {
  return await getStoredData(USAGE_KEY);
};

// Get usage for a specific item
export const getUsageForItem = async (itemId) => {
  const usage = await getStoredData(USAGE_KEY);
  return usage.filter(record => record.itemId === itemId);
};

// Delete all usage records for a specific item
export const deleteUsageForItem = async (itemId) => {
  const usage = await getStoredData(USAGE_KEY);
  
  // Filter out usage records for the specified item
  const updatedUsage = usage.filter(record => record.itemId !== itemId);
  
  await setStoredData(USAGE_KEY, updatedUsage);
  return true;
};

// Delete a specific usage record
export const deleteUsage = async (usageId) => {
  const usage = await getStoredData(USAGE_KEY);
  
  // Filter out the usage record with the given ID
  const updatedUsage = usage.filter(record => record.id !== usageId);
  
  // Check if a usage record was actually removed
  if (updatedUsage.length === usage.length) {
    throw new Error(`Usage record with ID ${usageId} not found`);
  }
  
  await setStoredData(USAGE_KEY, updatedUsage);
  return true;
};

// ================ Inventory Analysis ================

// Calculate item summary (total purchased, used, remaining)
export const getItemSummary = async (itemId) => {
  const items = await getStoredData(ITEMS_KEY);
  const purchases = await getAllPurchases();
  const usage = await getAllUsage();
  
  const item = items.find(item => item.id === itemId);
  
  if (!item) {
    return null;
  }
  
  const itemPurchases = purchases.filter(purchase => purchase.itemId === itemId);
  const itemUsage = usage.filter(record => record.itemId === itemId);
  
  const totalPurchased = itemPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.quantity), 0);
  const totalUsed = itemUsage.reduce((sum, record) => sum + parseFloat(record.quantity), 0);
  const remaining = totalPurchased - totalUsed;
  
  // Get the latest purchase for this item
  const latestPurchase = itemPurchases.length > 0 
    ? itemPurchases.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateB.getTime() !== dateA.getTime()) {
          return dateB - dateA;
        }
        
        const createdAtA = new Date(a.createdAt);
        const createdAtB = new Date(b.createdAt);
        return createdAtB - createdAtA;
      })[0]
    : null;
  
  // Get the latest usage for this item
  const latestUsage = itemUsage.length > 0
    ? itemUsage.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateB.getTime() !== dateA.getTime()) {
          return dateB - dateA;
        }
        
        const createdAtA = new Date(a.createdAt);
        const createdAtB = new Date(b.createdAt);
        return createdAtB - createdAtA;
      })[0]
    : null;
  
  return {
    ...item,
    totalPurchased,
    totalUsed,
    remaining,
    purchases: itemPurchases,
    usage: itemUsage,
    latestPurchase,
    latestUsage
  };
};

// Get summary for all inventory items
export const getAllItemsSummary = async () => {
  const items = await getActiveInventoryItems();
  const purchases = await getAllPurchases();
  const usage = await getAllUsage();
  
  return items.map(item => {
    const itemPurchases = purchases.filter(purchase => purchase.itemId === item.id);
    const itemUsage = usage.filter(record => record.itemId === item.id);
    
    const totalPurchased = itemPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.quantity), 0);
    const totalUsed = itemUsage.reduce((sum, record) => sum + parseFloat(record.quantity), 0);
    const remaining = totalPurchased - totalUsed;
    
    // Get the latest purchase for this item
    const latestPurchase = itemPurchases.length > 0 
      ? itemPurchases.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          if (dateB.getTime() !== dateA.getTime()) {
            return dateB - dateA;
          }
          
          const createdAtA = new Date(a.createdAt);
          const createdAtB = new Date(b.createdAt);
          return createdAtB - createdAtA;
        })[0]
      : null;
    
    // Get the latest usage for this item
    const latestUsage = itemUsage.length > 0
      ? itemUsage.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          if (dateB.getTime() !== dateA.getTime()) {
            return dateB - dateA;
          }
          
          const createdAtA = new Date(a.createdAt);
          const createdAtB = new Date(b.createdAt);
          return createdAtB - createdAtA;
        })[0]
      : null;
    
    return {
      ...item,
      totalPurchased,
      totalUsed,
      remaining,
      latestPurchase,
      latestUsage
    };
  });
};