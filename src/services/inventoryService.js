// Local storage keys
const ITEMS_KEY = 'inventory_items';
const PURCHASES_KEY = 'inventory_purchases';
const USAGE_KEY = 'inventory_usage';

// Helper to get data from localStorage with a default empty array
const getStoredData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// ================ Items Management ================

// Add a new inventory item
export const addInventoryItem = (itemData) => {
  const items = getStoredData(ITEMS_KEY);
  
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
  localStorage.setItem(ITEMS_KEY, JSON.stringify(updatedItems));
  
  return newItem;
};

// Get all inventory items
export const getAllInventoryItems = () => {
  return getStoredData(ITEMS_KEY);
};

// Get active inventory items
export const getActiveInventoryItems = () => {
  const items = getStoredData(ITEMS_KEY);
  return items.filter(item => item.active !== false);
};

// Update an inventory item
export const updateInventoryItem = (itemId, itemData) => {
  const items = getStoredData(ITEMS_KEY);
  
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
  
  localStorage.setItem(ITEMS_KEY, JSON.stringify(updatedItems));
  return updatedItems.find(item => item.id === itemId);
};

// Delete (deactivate) an inventory item
export const deactivateInventoryItem = (itemId) => {
  const items = getStoredData(ITEMS_KEY);
  
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
  
  localStorage.setItem(ITEMS_KEY, JSON.stringify(updatedItems));
  return true;
};

// Delete an inventory item completely (not just deactivate)
export const deleteInventoryItem = (itemId) => {
  const items = getStoredData(ITEMS_KEY);
  
  // Filter out the item with the given ID
  const updatedItems = items.filter(item => item.id !== itemId);
  
  // Check if an item was actually removed
  if (updatedItems.length === items.length) {
    throw new Error(`Item with ID ${itemId} not found`);
  }
  
  // Also delete related purchases and usage records
  deletePurchasesForItem(itemId);
  deleteUsageForItem(itemId);
  
  localStorage.setItem(ITEMS_KEY, JSON.stringify(updatedItems));
  return true;
};

// ================ Purchases Management ================

// Add a new purchase record
export const addPurchase = (purchaseData) => {
  const purchases = getStoredData(PURCHASES_KEY);
  
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
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(updatedPurchases));
  
  return newPurchase;
};

// Get all purchases
export const getAllPurchases = () => {
  return getStoredData(PURCHASES_KEY);
};

// Get purchases for a specific item
export const getPurchasesForItem = (itemId) => {
  const purchases = getStoredData(PURCHASES_KEY);
  return purchases.filter(purchase => purchase.itemId === itemId);
};

// Delete all purchases for a specific item
export const deletePurchasesForItem = (itemId) => {
  const purchases = getStoredData(PURCHASES_KEY);
  
  // Filter out purchases for the specified item
  const updatedPurchases = purchases.filter(purchase => purchase.itemId !== itemId);
  
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(updatedPurchases));
  return true;
};

// Delete a specific purchase
export const deletePurchase = (purchaseId) => {
  const purchases = getStoredData(PURCHASES_KEY);
  
  // Filter out the purchase with the given ID
  const updatedPurchases = purchases.filter(purchase => purchase.id !== purchaseId);
  
  // Check if a purchase was actually removed
  if (updatedPurchases.length === purchases.length) {
    throw new Error(`Purchase with ID ${purchaseId} not found`);
  }
  
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(updatedPurchases));
  return true;
};

// ================ Usage Management ================

// Add a new usage record
export const addUsage = (usageData) => {
  const usage = getStoredData(USAGE_KEY);
  
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
  localStorage.setItem(USAGE_KEY, JSON.stringify(updatedUsage));
  
  return newUsage;
};

// Get all usage records
export const getAllUsage = () => {
  return getStoredData(USAGE_KEY);
};

// Get usage for a specific item
export const getUsageForItem = (itemId) => {
  const usage = getStoredData(USAGE_KEY);
  return usage.filter(record => record.itemId === itemId);
};

// Delete all usage records for a specific item
export const deleteUsageForItem = (itemId) => {
  const usage = getStoredData(USAGE_KEY);
  
  // Filter out usage records for the specified item
  const updatedUsage = usage.filter(record => record.itemId !== itemId);
  
  localStorage.setItem(USAGE_KEY, JSON.stringify(updatedUsage));
  return true;
};

// Delete a specific usage record
export const deleteUsage = (usageId) => {
  const usage = getStoredData(USAGE_KEY);
  
  // Filter out the usage record with the given ID
  const updatedUsage = usage.filter(record => record.id !== usageId);
  
  // Check if a usage record was actually removed
  if (updatedUsage.length === usage.length) {
    throw new Error(`Usage record with ID ${usageId} not found`);
  }
  
  localStorage.setItem(USAGE_KEY, JSON.stringify(updatedUsage));
  return true;
};

// ================ Inventory Analysis ================

// Calculate item summary (total purchased, used, remaining)
export const getItemSummary = (itemId) => {
  const items = getStoredData(ITEMS_KEY);
  const purchases = getAllPurchases();
  const usage = getAllUsage();
  
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
  // Sort by date first, then by createdAt timestamp to ensure the most recent purchase is selected
  const latestPurchase = itemPurchases.length > 0 
    ? itemPurchases.sort((a, b) => {
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
      })[0]
    : null;
  
  // Get the latest usage for this item using the same sorting logic
  const latestUsage = itemUsage.length > 0
    ? itemUsage.sort((a, b) => {
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
export const getAllItemsSummary = () => {
  const items = getActiveInventoryItems();
  const purchases = getAllPurchases();
  const usage = getAllUsage();
  
  return items.map(item => {
    const itemPurchases = purchases.filter(purchase => purchase.itemId === item.id);
    const itemUsage = usage.filter(record => record.itemId === item.id);
    
    const totalPurchased = itemPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.quantity), 0);
    const totalUsed = itemUsage.reduce((sum, record) => sum + parseFloat(record.quantity), 0);
    const remaining = totalPurchased - totalUsed;
    
    // Get the latest purchase for this item
    // Sort by date first, then by createdAt timestamp to ensure the most recent purchase is selected
    const latestPurchase = itemPurchases.length > 0 
      ? itemPurchases.sort((a, b) => {
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
        })[0]
      : null;
    
    // Get the latest usage for this item using the same sorting logic
    const latestUsage = itemUsage.length > 0
      ? itemUsage.sort((a, b) => {
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
        })[0]
      : null;
    
    return {
      ...item,
      totalPurchased,
      totalUsed,
      remaining,
      latestPurchase, // Include the latest purchase in the summary
      latestUsage     // Include the latest usage in the summary
    };
  });
};

// Get usage history grouped by date for an item
export const getUsageHistoryByDate = (itemId) => {
  const usage = getUsageForItem(itemId);
  
  // Group by date
  const groupedByDate = usage.reduce((acc, record) => {
    // Get date part only
    const date = record.date.split('T')[0];
    
    if (!acc[date]) {
      acc[date] = 0;
    }
    
    acc[date] += parseFloat(record.quantity);
    return acc;
  }, {});
  
  // Convert to array and sort
  return Object.entries(groupedByDate)
    .map(([date, quantity]) => ({ date, quantity }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get purchase history for an item
export const getPurchaseHistoryByDate = (itemId) => {
  const purchases = getPurchasesForItem(itemId);
  
  return purchases
    .map(purchase => ({
      date: purchase.date.split('T')[0],
      quantity: parseFloat(purchase.quantity),
      cost: parseFloat(purchase.cost || 0),
      supplier: purchase.supplier
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get purchase history by date range
export const getPurchaseHistoryByDateRange = (startDate, endDate) => {
  const purchases = getStoredData(PURCHASES_KEY);
  
  return purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.date);
    return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
  });
};

// Get usage history by date range
export const getUsageHistoryByDateRange = (startDate, endDate) => {
  const usage = getStoredData(USAGE_KEY);
  
  return usage.filter(record => {
    const usageDate = new Date(record.date);
    return usageDate >= new Date(startDate) && usageDate <= new Date(endDate);
  });
}; 