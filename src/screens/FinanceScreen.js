import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  Menu,
  Divider,
  Chip,
  Surface,
  FAB,
  Portal,
  Modal,
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import { theme } from '../theme/theme';

// Import services
import {
  addIncome,
  addCOGS,
  addExpense,
  getAllIncome,
  getAllCOGS,
  getAllExpenses,
  calculateFinancialMetrics,
} from '../services/financeService';

const { width } = Dimensions.get('window');

const FinanceScreen = () => {
  // State for financial data
  const [income, setIncome] = useState([]);
  const [cogs, setCOGS] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
  });

  // Get current date info
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = currentDate.getMonth().toString();

  // State for date filters
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Modal and form states
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('income');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date(),
  });
  const [errors, setErrors] = useState({});
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  // Load data on mount and when filters change
  useEffect(() => {
    loadFinancialData();
  }, [selectedYear, selectedMonth]);

  // Load all financial data
  const loadFinancialData = () => {
    const incomeData = getAllIncome();
    const cogsData = getAllCOGS();
    const expenseData = getAllExpenses();

    // Filter data based on year and month
    const filteredIncome = filterDataByDate(incomeData, selectedYear, selectedMonth);
    const filteredCOGS = filterDataByDate(cogsData, selectedYear, selectedMonth);
    const filteredExpenses = filterDataByDate(expenseData, selectedYear, selectedMonth);

    // Update state
    setIncome(filteredIncome);
    setCOGS(filteredCOGS);
    setExpenses(filteredExpenses);

    // Calculate metrics based on filtered data
    const filteredMetrics = calculateFilteredMetrics(filteredIncome, filteredCOGS, filteredExpenses);
    setMetrics(filteredMetrics);
  };

  // Filter data by date
  const filterDataByDate = (data, year, month) => {
    if (year === 'all' && month === 'all') {
      return data;
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear().toString();
      const itemMonth = itemDate.getMonth().toString();
      
      const yearMatch = year === 'all' || itemYear === year;
      const monthMatch = month === 'all' || itemMonth === month;
      
      return yearMatch && monthMatch;
    });
  };

  // Calculate filtered metrics
  const calculateFilteredMetrics = (filteredIncome, filteredCOGS, filteredExpenses) => {
    const totalRevenue = filteredIncome.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalCOGS = filteredCOGS.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalExpenses = filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
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

  // Handle form change
  const handleFormChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date.toISOString().split('T')[0]
    };
    
    // Add transaction based on type
    try {
      if (transactionType === 'income') {
        addIncome(transactionData);
      } else if (transactionType === 'cogs') {
        addCOGS(transactionData);
      } else if (transactionType === 'expense') {
        addExpense(transactionData);
      }
      
      // Reset form and close modal
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date(),
      });
      setErrors({});
      setModalVisible(false);
      
      // Reload data
      loadFinancialData();
      
      Alert.alert('Success', 'Transaction added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    }
  };

  // Get category options based on transaction type
  const getCategoryOptions = () => {
    if (transactionType === 'income') {
      return [
        { value: 'sales', label: 'Product Sales' },
        { value: 'service', label: 'Service Revenue' },
        { value: 'rent', label: 'Rental Income' },
        { value: 'interest', label: 'Interest Income' },
        { value: 'other', label: 'Other Income' },
      ];
    } else if (transactionType === 'cogs') {
      return [
        { value: 'raw_materials', label: 'Raw Materials' },
        { value: 'direct_labor', label: 'Direct Labor' },
        { value: 'packaging', label: 'Packaging' },
        { value: 'manufacturing', label: 'Manufacturing Costs' },
        { value: 'delivery', label: 'Delivery Costs' },
        { value: 'other', label: 'Other COGS' },
      ];
    } else {
      return [
        { value: 'rent', label: 'Rent/Lease' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'salary', label: 'Salaries & Wages' },
        { value: 'marketing', label: 'Marketing & Advertising' },
        { value: 'insurance', label: 'Insurance' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'office', label: 'Office Supplies' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'other', label: 'Other Expenses' },
      ];
    }
  };

  const MetricCard = ({ title, value, type }) => {
    const getCardColor = () => {
      switch (type) {
        case 'revenue': return theme.colors.success;
        case 'cogs': return theme.colors.warning;
        case 'grossProfit': return theme.colors.primary;
        case 'expenses': return theme.colors.error;
        case 'netProfit': return theme.colors.primary;
        default: return theme.colors.primary;
      }
    };

    return (
      <Card style={[styles.metricCard, { borderLeftColor: getCardColor() }]}>
        <Card.Content>
          <Text style={styles.metricTitle}>{title}</Text>
          <Title style={[styles.metricValue, { color: getCardColor() }]}>
            ₹{value.toLocaleString()}
          </Title>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Surface style={styles.header}>
          <Title style={styles.headerTitle}>Financial Dashboard</Title>
          <Text style={styles.headerSubtitle}>Monitor your business financial performance</Text>
        </Surface>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Financial Summary</Title>
          
          <View style={styles.metricsGrid}>
            <MetricCard title="Revenue" value={metrics.revenue} type="revenue" />
            <MetricCard title="COGS" value={metrics.cogs} type="cogs" />
            <MetricCard title="Gross Profit" value={metrics.grossProfit} type="grossProfit" />
            <MetricCard title="Expenses" value={metrics.expenses} type="expenses" />
            <MetricCard title="Net Profit" value={metrics.netProfit} type="netProfit" />
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Recent Transactions</Title>
          
          {[...income, ...cogs, ...expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((transaction, index) => (
              <Card key={index} style={styles.transactionCard}>
                <Card.Content style={styles.transactionContent}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    { color: income.includes(transaction) ? theme.colors.success : theme.colors.error }
                  ]}>
                    {income.includes(transaction) ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </Text>
                </Card.Content>
              </Card>
            ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />

      {/* Add Transaction Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Add Transaction</Title>
          
          {/* Transaction Type Chips */}
          <View style={styles.chipContainer}>
            <Chip
              selected={transactionType === 'income'}
              onPress={() => {
                setTransactionType('income');
                setFormData({ ...formData, category: '' });
              }}
              style={styles.chip}
            >
              Income
            </Chip>
            <Chip
              selected={transactionType === 'cogs'}
              onPress={() => {
                setTransactionType('cogs');
                setFormData({ ...formData, category: '' });
              }}
              style={styles.chip}
            >
              COGS
            </Chip>
            <Chip
              selected={transactionType === 'expense'}
              onPress={() => {
                setTransactionType('expense');
                setFormData({ ...formData, category: '' });
              }}
              style={styles.chip}
            >
              Expense
            </Chip>
          </View>

          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(value) => handleFormChange('description', value)}
            mode="outlined"
            style={styles.input}
            error={!!errors.description}
          />
          <HelperText type="error" visible={!!errors.description}>
            {errors.description}
          </HelperText>

          <TextInput
            label="Amount (₹)"
            value={formData.amount}
            onChangeText={(value) => handleFormChange('amount', value)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.amount}
          />
          <HelperText type="error" visible={!!errors.amount}>
            {errors.amount}
          </HelperText>

          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TextInput
                label="Category"
                value={getCategoryOptions().find(opt => opt.value === formData.category)?.label || ''}
                mode="outlined"
                style={styles.input}
                right={<TextInput.Icon icon="chevron-down" onPress={() => setCategoryMenuVisible(true)} />}
                onTouchStart={() => setCategoryMenuVisible(true)}
                showSoftInputOnFocus={false}
                error={!!errors.category}
              />
            }
          >
            {getCategoryOptions().map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  handleFormChange('category', option.value);
                  setCategoryMenuVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>
          <HelperText type="error" visible={!!errors.category}>
            {errors.category}
          </HelperText>

          <TextInput
            label="Date"
            value={formData.date.toLocaleDateString()}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="calendar" onPress={() => setDatePickerOpen(true)} />}
            onTouchStart={() => setDatePickerOpen(true)}
            showSoftInputOnFocus={false}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.modalButton}
            >
              Add Transaction
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Date Picker */}
      <DatePicker
        modal
        open={datePickerOpen}
        date={formData.date}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpen(false);
          handleFormChange('date', date);
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    margin: 16,
    borderRadius: theme.roundness,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  headerSubtitle: {
    color: theme.colors.text,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.text,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    elevation: 3,
    borderRadius: theme.roundness,
    borderLeftWidth: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: theme.colors.text,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionCard: {
    marginBottom: 8,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: theme.colors.disabled,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: theme.roundness,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  chip: {
    marginHorizontal: 4,
  },
  input: {
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default FinanceScreen;