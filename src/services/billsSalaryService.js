// Local storage keys
const BILLS_KEY = 'bills';
const SALARIES_KEY = 'salaries';
const INVENTORY_PURCHASES_KEY = 'inventory_purchases';
const INVENTORY_ITEMS_KEY = 'inventory_items';

// Helper to get data from localStorage with a default empty array
const getStoredData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Add a new bill
export const addBill = (billData) => {
  const currentBills = getStoredData(BILLS_KEY);
  
  // Create new bill with ID and timestamps
  const newBill = {
    ...billData,
    id: Date.now(),
    amount: parseFloat(billData.amount),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to bills array
  const updatedBills = [...currentBills, newBill];
  localStorage.setItem(BILLS_KEY, JSON.stringify(updatedBills));
  
  return newBill;
};

// Get all bills
export const getAllBills = () => {
  return getStoredData(BILLS_KEY);
};

// Update a bill
export const updateBill = (billId, billData) => {
  const currentBills = getStoredData(BILLS_KEY);
  
  // Find and update the bill
  const updatedBills = currentBills.map(bill => {
    if (bill.id === billId) {
      return {
        ...bill,
        ...billData,
        amount: parseFloat(billData.amount || bill.amount),
        updatedAt: new Date().toISOString()
      };
    }
    return bill;
  });
  
  localStorage.setItem(BILLS_KEY, JSON.stringify(updatedBills));
  return updatedBills.find(bill => bill.id === billId);
};

// Add a new salary record
export const addSalary = (salaryData) => {
  const currentSalaries = getStoredData(SALARIES_KEY);
  
  // Create new salary record with ID and timestamps
  const newSalary = {
    ...salaryData,
    id: Date.now(),
    amount: parseFloat(salaryData.amount),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to salaries array
  const updatedSalaries = [...currentSalaries, newSalary];
  localStorage.setItem(SALARIES_KEY, JSON.stringify(updatedSalaries));
  
  return newSalary;
};

// Get all salary records
export const getAllSalaries = () => {
  return getStoredData(SALARIES_KEY);
};

// Update a salary record
export const updateSalary = (salaryId, salaryData) => {
  const currentSalaries = getStoredData(SALARIES_KEY);
  
  // Find and update the salary record
  const updatedSalaries = currentSalaries.map(salary => {
    if (salary.id === salaryId) {
      return {
        ...salary,
        ...salaryData,
        amount: parseFloat(salaryData.amount || salary.amount),
        updatedAt: new Date().toISOString()
      };
    }
    return salary;
  });
  
  localStorage.setItem(SALARIES_KEY, JSON.stringify(updatedSalaries));
  return updatedSalaries.find(salary => salary.id === salaryId);
};

// Get purchase history with item details
export const getPurchaseHistory = () => {
  const purchases = getStoredData(INVENTORY_PURCHASES_KEY);
  const items = getStoredData(INVENTORY_ITEMS_KEY);
  
  // Map purchases with item information
  return purchases.map(purchase => {
    const item = items.find(item => item.id === purchase.itemId);
    return {
      ...purchase,
      itemName: item ? item.name : 'Unknown Item',
      itemCategory: item ? item.category : 'Unknown Category'
    };
  });
};

// Update a purchase payment status
export const updatePurchasePayment = (purchaseId, paymentData) => {
  const currentPurchases = getStoredData(INVENTORY_PURCHASES_KEY);
  
  // Find and update the purchase payment information
  const updatedPurchases = currentPurchases.map(purchase => {
    if (purchase.id === purchaseId) {
      return {
        ...purchase,
        ...paymentData,
        updatedAt: new Date().toISOString()
      };
    }
    return purchase;
  });
  
  localStorage.setItem(INVENTORY_PURCHASES_KEY, JSON.stringify(updatedPurchases));
  return updatedPurchases.find(purchase => purchase.id === purchaseId);
};

// Get bills by date range
export const getBillsByDateRange = (startDate, endDate) => {
  const bills = getStoredData(BILLS_KEY);
  
  return bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate >= new Date(startDate) && billDate <= new Date(endDate);
  });
};

// Get salaries by date range
export const getSalariesByDateRange = (startDate, endDate) => {
  const salaries = getStoredData(SALARIES_KEY);
  
  return salaries.filter(salary => {
    const salaryDate = new Date(salary.date);
    return salaryDate >= new Date(startDate) && salaryDate <= new Date(endDate);
  });
};

// Get purchases by date range
export const getPurchasesByDateRange = (startDate, endDate) => {
  const purchases = getPurchaseHistory();
  
  return purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.date);
    return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
  });
};

// Get summary of bills
export const getBillsSummary = () => {
  const bills = getStoredData(BILLS_KEY);
  
  const totalAmount = bills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
  const paidAmount = bills
    .filter(bill => bill.paymentStatus === 'paid')
    .reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
  const unpaidAmount = bills
    .filter(bill => bill.paymentStatus === 'unpaid')
    .reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
  const partiallyPaidAmount = bills
    .filter(bill => bill.paymentStatus === 'partial')
    .reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
  
  return {
    totalAmount,
    paidAmount,
    unpaidAmount,
    partiallyPaidAmount,
    count: bills.length
  };
};

// Get summary of salaries
export const getSalariesSummary = () => {
  const salaries = getStoredData(SALARIES_KEY);
  
  const totalAmount = salaries.reduce((sum, salary) => sum + (parseFloat(salary.amount) || 0), 0);
  const paidAmount = salaries
    .filter(salary => salary.paymentStatus === 'paid')
    .reduce((sum, salary) => sum + (parseFloat(salary.amount) || 0), 0);
  const unpaidAmount = salaries
    .filter(salary => salary.paymentStatus === 'unpaid')
    .reduce((sum, salary) => sum + (parseFloat(salary.amount) || 0), 0);
  
  return {
    totalAmount,
    paidAmount,
    unpaidAmount,
    count: salaries.length
  };
};

// Get summary of purchases
export const getPurchasesSummary = () => {
  const purchases = getStoredData(INVENTORY_PURCHASES_KEY);
  
  const totalAmount = purchases.reduce((sum, purchase) => sum + (parseFloat(purchase.cost) || 0), 0);
  const paidAmount = purchases
    .filter(purchase => purchase.paymentMethod && purchase.paymentMethod !== 'unpaid')
    .reduce((sum, purchase) => sum + (parseFloat(purchase.cost) || 0), 0);
  const unpaidAmount = purchases
    .filter(purchase => !purchase.paymentMethod || purchase.paymentMethod === 'unpaid')
    .reduce((sum, purchase) => sum + (parseFloat(purchase.cost) || 0), 0);
  
  return {
    totalAmount,
    paidAmount,
    unpaidAmount,
    count: purchases.length
  };
};

// Delete a bill
export const deleteBill = (billId) => {
  const currentBills = getStoredData(BILLS_KEY);
  
  // Filter out the bill with the given ID
  const updatedBills = currentBills.filter(bill => bill.id !== billId);
  
  // Check if a bill was actually removed
  if (updatedBills.length === currentBills.length) {
    throw new Error(`Bill with ID ${billId} not found`);
  }
  
  localStorage.setItem(BILLS_KEY, JSON.stringify(updatedBills));
  return true;
};

// Delete a salary record
export const deleteSalary = (salaryId) => {
  const currentSalaries = getStoredData(SALARIES_KEY);
  
  // Filter out the salary record with the given ID
  const updatedSalaries = currentSalaries.filter(salary => salary.id !== salaryId);
  
  // Check if a salary record was actually removed
  if (updatedSalaries.length === currentSalaries.length) {
    throw new Error(`Salary record with ID ${salaryId} not found`);
  }
  
  localStorage.setItem(SALARIES_KEY, JSON.stringify(updatedSalaries));
  return true;
}; 