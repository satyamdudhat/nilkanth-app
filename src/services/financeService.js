import AsyncStorage from '@react-native-async-storage/async-storage';

// Local storage keys
const INCOME_KEY = 'finance_income';
const COGS_KEY = 'finance_cogs';
const EXPENSES_KEY = 'finance_expenses';

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

// Add income entry
export const addIncome = async (incomeData) => {
  const currentData = await getStoredData(INCOME_KEY);
  const newData = [...currentData, { ...incomeData, id: Date.now() }];
  await setStoredData(INCOME_KEY, newData);
  return newData;
};

// Add COGS entry
export const addCOGS = async (cogsData) => {
  const currentData = await getStoredData(COGS_KEY);
  const newData = [...currentData, { ...cogsData, id: Date.now() }];
  await setStoredData(COGS_KEY, newData);
  return newData;
};

// Add expense entry
export const addExpense = async (expenseData) => {
  const currentData = await getStoredData(EXPENSES_KEY);
  const newData = [...currentData, { ...expenseData, id: Date.now() }];
  await setStoredData(EXPENSES_KEY, newData);
  return newData;
};

// Get all income
export const getAllIncome = async () => {
  return await getStoredData(INCOME_KEY);
};

// Get all COGS
export const getAllCOGS = async () => {
  return await getStoredData(COGS_KEY);
};

// Get all expenses
export const getAllExpenses = async () => {
  return await getStoredData(EXPENSES_KEY);
};

// Calculate financial metrics
export const calculateFinancialMetrics = (incomeData = [], cogsData = [], expenseData = []) => {
  // Calculate totals
  const totalRevenue = incomeData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const totalCOGS = cogsData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  // Calculate profit metrics
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

// Helper function to filter data by period
const filterDataByPeriod = (data, period) => {
  if (period === 'all') return data;

  const today = new Date();
  const startDate = new Date();

  // Set start date based on period
  switch (period) {
    case 'weekly':
      startDate.setDate(today.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(today.getMonth() - 1);
      break;
    case 'yearly':
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      return data;
  }

  // Filter data where date is after the start date
  return data.filter(item => new Date(item.date) >= startDate);
};

// Get data for charts
export const getChartData = async (period = 'all') => {
  const allIncome = await getAllIncome();
  const allCOGS = await getAllCOGS();
  const allExpenses = await getAllExpenses();

  // Filter data based on period
  const filteredIncome = filterDataByPeriod(allIncome, period);
  const filteredCOGS = filterDataByPeriod(allCOGS, period);
  const filteredExpenses = filterDataByPeriod(allExpenses, period);

  // Group data by date for charts
  const incomeByDate = groupByDate(filteredIncome);
  const cogsByDate = groupByDate(filteredCOGS);
  const expensesByDate = groupByDate(filteredExpenses);

  // Combine dates from all datasets
  const allDates = [...new Set([
    ...Object.keys(incomeByDate),
    ...Object.keys(cogsByDate),
    ...Object.keys(expensesByDate)
  ])].sort();

  // Create chart data
  return {
    labels: allDates,
    income: allDates.map(date => incomeByDate[date] || 0),
    cogs: allDates.map(date => cogsByDate[date] || 0),
    expenses: allDates.map(date => expensesByDate[date] || 0),
  };
};

// Helper function to group data by date
const groupByDate = (data) => {
  return data.reduce((acc, item) => {
    // Format date to YYYY-MM-DD
    const date = new Date(item.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += parseFloat(item.amount);
    return acc;
  }, {});
};