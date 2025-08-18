import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/theme';

// Import services
import {
  getAllIncome,
  getAllCOGS,
  getAllExpenses,
  calculateFinancialMetrics,
} from '../services/financeService';

import {
  getAllItemsSummary
} from '../services/inventoryService';

import {
  getAllProducts,
  getProductCategories
} from '../services/productService';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  // State for dashboard data
  const [financialMetrics, setFinancialMetrics] = useState({
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
  });
  
  const [inventorySummary, setInventorySummary] = useState({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0
  });
  
  const [productsSummary, setProductsSummary] = useState({
    totalProducts: 0,
    categories: 0,
    topSellingProduct: null
  });
  
  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  // Load all dashboard data
  const loadDashboardData = () => {
    // Load financial data
    const incomeData = getAllIncome();
    const cogsData = getAllCOGS();
    const expenseData = getAllExpenses();
    
    // Calculate financial metrics
    const metrics = calculateFinancialMetrics(incomeData, cogsData, expenseData);
    setFinancialMetrics(metrics);
    
    // Load inventory data
    const inventoryItems = getAllItemsSummary();
    
    // Calculate inventory summary
    const lowStockItems = inventoryItems.filter(item => 
      item.minLevel && item.remaining > 0 && item.remaining <= parseFloat(item.minLevel)
    );
    
    const outOfStockItems = inventoryItems.filter(item => 
      item.remaining <= 0
    );
    
    // Calculate estimated inventory value
    const totalValue = inventoryItems.reduce((sum, item) => {
      const avgCost = item.totalCost ? item.totalCost / item.totalPurchased : 0;
      return sum + (avgCost * item.remaining);
    }, 0);
    
    setInventorySummary({
      totalItems: inventoryItems.length,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue
    });
    
    // Load products data
    try {
      const products = getAllProducts();
      const categories = getProductCategories();
      
      // Find top selling product
      const topSelling = [...products].sort((a, b) => b.sales - a.sales)[0];
      
      setProductsSummary({
        totalProducts: products.length,
        categories: categories.length,
        topSellingProduct: topSelling
      });
    } catch (error) {
      console.error('Error loading products data:', error);
    }
  };

  const MetricCard = ({ title, value, icon, color, subtitle }) => (
    <Card style={[styles.metricCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.metricContent}>
        <View style={styles.metricHeader}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Icon name={icon} size={24} color={color} />
          </View>
          <View style={styles.metricText}>
            <Text style={styles.metricTitle}>{title}</Text>
            <Title style={[styles.metricValue, { color }]}>
              {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
            </Title>
            {subtitle && (
              <Paragraph style={styles.metricSubtitle}>{subtitle}</Paragraph>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Surface style={styles.header}>
          <Title style={styles.headerTitle}>Welcome to Nilkanth Dashboard</Title>
          <Paragraph style={styles.headerSubtitle}>
            Your comprehensive business management system
          </Paragraph>
        </Surface>

        {/* Financial Overview */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Financial Overview</Title>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Revenue"
              value={financialMetrics.revenue}
              icon="attach-money"
              color={theme.colors.success}
              subtitle="Income from all sales"
            />
            
            <MetricCard
              title="Total Expenses"
              value={financialMetrics.cogs + financialMetrics.expenses}
              icon="shopping-cart"
              color={theme.colors.error}
              subtitle="COGS + Operating expenses"
            />
            
            <MetricCard
              title="Net Profit"
              value={financialMetrics.netProfit}
              icon="trending-up"
              color={theme.colors.primary}
              subtitle="Revenue minus all expenses"
            />
            
            <MetricCard
              title="Profit Margin"
              value={financialMetrics.revenue > 0 
                ? `${((financialMetrics.netProfit / financialMetrics.revenue) * 100).toFixed(1)}%` 
                : '0%'}
              icon="pie-chart"
              color={theme.colors.warning}
              subtitle="Net profit as % of revenue"
            />
          </View>
        </View>

        {/* Inventory Overview */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Inventory Overview</Title>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Items"
              value={inventorySummary.totalItems}
              icon="inventory"
              color={theme.colors.primary}
              subtitle="Active inventory items"
            />
            
            <MetricCard
              title="Low Stock Items"
              value={inventorySummary.lowStockItems}
              icon="warning"
              color={theme.colors.warning}
              subtitle="Items below minimum level"
            />
            
            <MetricCard
              title="Out of Stock"
              value={inventorySummary.outOfStockItems}
              icon="error"
              color={theme.colors.error}
              subtitle="Items with zero stock"
            />
            
            <MetricCard
              title="Inventory Value"
              value={inventorySummary.totalValue}
              icon="account-balance-wallet"
              color={theme.colors.success}
              subtitle="Estimated value of stock"
            />
          </View>
        </View>

        {/* Products Overview */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Products Overview</Title>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Products"
              value={productsSummary.totalProducts}
              icon="shopping-cart"
              color={theme.colors.primary}
              subtitle="Active product catalog"
            />
            
            <MetricCard
              title="Categories"
              value={productsSummary.categories}
              icon="category"
              color={theme.colors.warning}
              subtitle="Distinct product categories"
            />
            
            <Card style={styles.topProductCard}>
              <Card.Content>
                <Text style={styles.metricTitle}>Top Selling Product</Text>
                <Title style={styles.topProductName}>
                  {productsSummary.topSellingProduct?.name || 'N/A'}
                </Title>
                <Paragraph style={styles.topProductSales}>
                  {productsSummary.topSellingProduct 
                    ? `${productsSummary.topSellingProduct.sales} units sold` 
                    : 'No sales data'}
                </Paragraph>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    textAlign: 'center',
    color: theme.colors.text,
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
  metricContent: {
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricText: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 12,
    color: theme.colors.text,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 10,
    color: theme.colors.disabled,
  },
  topProductCard: {
    width: (width - 48),
    marginBottom: 16,
    elevation: 3,
    borderRadius: theme.roundness,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  topProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.success,
    marginVertical: 4,
  },
  topProductSales: {
    fontSize: 12,
    color: theme.colors.disabled,
  },
});

export default DashboardScreen;