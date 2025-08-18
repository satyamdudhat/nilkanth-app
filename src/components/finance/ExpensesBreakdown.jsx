import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Stack, 
  Divider, 
  LinearProgress, 
  Grid, 
  Tooltip, 
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PieChartIcon from '@mui/icons-material/PieChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const EXPENSE_CATEGORIES = [
  { name: 'Salaries', color: '#3751FF', icon: <AccountBalanceWalletOutlinedIcon /> },
  { name: 'Marketing', color: '#FF5733', icon: <DonutLargeIcon /> },
  { name: 'Operations', color: '#66BB6A', icon: <PieChartIcon /> },
  { name: 'Infrastructure', color: '#FFC107', icon: <DonutLargeIcon /> },
  { name: 'Other', color: '#8C54FF', icon: <DonutLargeIcon /> },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 1,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Typography variant="subtitle2" gutterBottom color="textPrimary">
          {data.name}
        </Typography>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="textSecondary">
            Amount: {formatCurrency(data.value)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Percentage: {formatPercentage(data.percentage)}
          </Typography>
        </Stack>
      </Paper>
    );
  }
  return null;
};

const ExpensesBreakdown = ({ data = [] }) => {
  const theme = useTheme();
  
  // Calculate total expenses
  const totalExpenses = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  // Prepare data for pie chart with percentages
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      percentage: totalExpenses > 0 ? item.value / totalExpenses : 0,
    }));
  }, [data, totalExpenses]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Expenses Breakdown
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Distribution of operating expenses
          </Typography>
        </Box>
        <Tooltip title="This chart shows how your total expenses are distributed across different categories">
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || EXPENSE_CATEGORIES[index % EXPENSE_CATEGORIES.length].color} 
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant="subtitle1" fontWeight={600} align="center" sx={{ mt: 1 }}>
            Total: {formatCurrency(totalExpenses)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            {chartData.map((category, index) => (
              <Box key={category.name || `category-${index}`}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '4px',
                      backgroundColor: category.color || EXPENSE_CATEGORIES[index % EXPENSE_CATEGORIES.length].color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {category.icon || EXPENSE_CATEGORIES[index % EXPENSE_CATEGORIES.length].icon}
                  </Box>
                  <Typography variant="body2" fontWeight={500} sx={{ flex: 1 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(category.value)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPercentage(category.percentage)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={category.percentage * 100}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.grey[300], 0.5),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1,
                      backgroundColor: category.color || EXPENSE_CATEGORIES[index % EXPENSE_CATEGORIES.length].color,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body2" color="text.secondary">
        The largest expense category is {chartData.length > 0 ? 
          `${chartData.sort((a, b) => b.value - a.value)[0].name} at ${formatPercentage(chartData.sort((a, b) => b.value - a.value)[0].percentage)} of total expenses` : 
          'not available due to insufficient data'
        }.
      </Typography>
    </Paper>
  );
};

export default ExpensesBreakdown; 