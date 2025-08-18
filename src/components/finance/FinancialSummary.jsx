import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Divider, Chip, Stack } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const MetricCard = ({ title, value, previousValue, currency = 'USD', isPercentage = false }) => {
  const formatter = isPercentage ? formatPercentage : (val) => formatCurrency(val, currency);
  const percentChange = previousValue ? (value - previousValue) / previousValue : 0;
  const isPositive = percentChange >= 0;

  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1.5 }}>
          {formatter(value)}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            icon={isPositive ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
            label={`${formatPercentage(Math.abs(percentChange))} vs last period`}
            color={isPositive ? 'success' : 'error'}
            variant="outlined"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

const FinancialSummary = ({ data }) => {
  const {
    revenue = 0,
    previousRevenue = 0,
    profit = 0,
    previousProfit = 0,
    expenses = 0,
    previousExpenses = 0,
    cashflow = 0,
    previousCashflow = 0,
    profitMargin = 0,
    previousProfitMargin = 0,
  } = data || {};

  return (
    <Box>
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Financial Summary
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Total Revenue" 
            value={revenue} 
            previousValue={previousRevenue} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Net Profit" 
            value={profit} 
            previousValue={previousProfit} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Total Expenses" 
            value={expenses} 
            previousValue={previousExpenses} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Cash Flow" 
            value={cashflow} 
            previousValue={previousCashflow} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Profit Margin" 
            value={profitMargin} 
            previousValue={previousProfitMargin} 
            isPercentage={true}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialSummary; 