// Local storage keys
const INCOME_KEY = 'finance_income';
const COGS_KEY = 'finance_cogs';
const EXPENSES_KEY = 'finance_expenses';

// Helper to get data from localStorage with a default empty array
const getStoredData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Add income entry
export const addIncome = (incomeData) => {
  const currentData = getStoredData(INCOME_KEY);
  const newData = [...currentData, { ...incomeData, id: Date.now() }];
  localStorage.setItem(INCOME_KEY, JSON.stringify(newData));
  return newData;
};

// Add COGS entry
export const addCOGS = (cogsData) => {
  const currentData = getStoredData(COGS_KEY);
  const newData = [...currentData, { ...cogsData, id: Date.now() }];
  localStorage.setItem(COGS_KEY, JSON.stringify(newData));
  return newData;
};

// Add expense entry
export const addExpense = (expenseData) => {
  const currentData = getStoredData(EXPENSES_KEY);
  const newData = [...currentData, { ...expenseData, id: Date.now() }];
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(newData));
  return newData;
};

// Get all income
export const getAllIncome = () => {
  return getStoredData(INCOME_KEY);
};

// Get all COGS
export const getAllCOGS = () => {
  return getStoredData(COGS_KEY);
};

// Get all expenses
export const getAllExpenses = () => {
  return getStoredData(EXPENSES_KEY);
};

// Calculate financial metrics
export const calculateFinancialMetrics = (period = 'all') => {
  const allIncome = getAllIncome();
  const allCOGS = getAllCOGS();
  const allExpenses = getAllExpenses();

  // Filter data based on period
  const filteredIncome = filterDataByPeriod(allIncome, period);
  const filteredCOGS = filterDataByPeriod(allCOGS, period);
  const filteredExpenses = filterDataByPeriod(allExpenses, period);

  // Calculate totals
  const totalRevenue = filteredIncome.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalCOGS = filteredCOGS.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

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
export const getChartData = (period = 'all') => {
  const allIncome = getAllIncome();
  const allCOGS = getAllCOGS();
  const allExpenses = getAllExpenses();

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