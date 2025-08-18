import React, { useMemo } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Stack, 
  useTheme, 
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Tooltip,
  Chip
} from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 1,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          minWidth: 200
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        <Stack spacing={1.5}>
          {payload.map((entry, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: entry.color 
                }} 
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(entry.value)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>
    );
  }
  return null;
};

const RevenueChart = ({ data, compareData }) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = React.useState('monthly');

  // Handle date range change
  const handleDateRangeChange = (event, newDateRange) => {
    if (newDateRange !== null) {
      setDateRange(newDateRange);
    }
  };

  // Calculate percentage change from previous period
  const calculateChange = () => {
    if (!data || !data.length) return { value: 0, percentage: 0 };
    
    const currentTotal = data.reduce((sum, item) => sum + item.revenue, 0);
    const previousTotal = (compareData || []).reduce((sum, item) => sum + item.revenue, 0);
    
    if (previousTotal === 0) return { value: currentTotal, percentage: 100 };
    
    const change = currentTotal - previousTotal;
    const percentage = (change / previousTotal) * 100;
    
    return { value: change, percentage };
  };

  const changeData = useMemo(() => calculateChange(), [data, compareData]);
  const isPositiveChange = changeData.percentage >= 0;

  // Process chart data
  const processedData = useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      ...item,
      profit: item.revenue - (item.expense + item.cogs),
    }));
  }, [data]);

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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Revenue Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dateRange === 'monthly' ? 'Monthly' : dateRange === 'quarterly' ? 'Quarterly' : 'Weekly'} revenue analysis
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={dateRange}
          exclusive
          onChange={handleDateRangeChange}
          size="small"
          sx={{
            '& .MuiToggleButtonGroup-grouped': {
              borderRadius: 1,
              borderColor: theme.palette.divider,
              px: 2,
            },
            '& .Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
              }
            }
          }}
        >
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="quarterly">Quarterly</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Stack>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {formatCurrency(processedData.reduce((acc, item) => acc + item.revenue, 0))}
            </Typography>
          </Stack>

          <Divider orientation="vertical" flexItem />
          
          <Stack>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              vs Previous Period
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography 
                variant="h5" 
                fontWeight={600} 
                color={isPositiveChange ? theme.palette.success.main : theme.palette.error.main}
              >
                {formatCurrency(changeData.value)}
              </Typography>
              <Chip
                size="small"
                icon={isPositiveChange ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                label={`${Math.abs(changeData.percentage).toFixed(1)}%`}
                color={isPositiveChange ? "success" : "error"}
                sx={{ 
                  fontWeight: 600,
                  backgroundColor: isPositiveChange ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                  color: isPositiveChange ? theme.palette.success.main : theme.palette.error.main,
                  '& .MuiChip-icon': {
                    color: 'inherit'
                  }
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={processedData}
            margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.7}/>
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.7}/>
                <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.7}/>
                <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value, true)}
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              width={80}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue"
              stroke={theme.palette.primary.main} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              name="Expenses"
              stroke={theme.palette.error.main} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorExpense)" 
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              name="Profit"
              stroke={theme.palette.success.main} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorProfit)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Stack direction="row" spacing={3} justifyContent="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                backgroundColor: theme.palette.primary.main, 
                borderRadius: '50%' 
              }} 
            />
            <Typography variant="body2" color="text.secondary">Revenue</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                backgroundColor: theme.palette.error.main, 
                borderRadius: '50%' 
              }} 
            />
            <Typography variant="body2" color="text.secondary">Expenses</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                backgroundColor: theme.palette.success.main, 
                borderRadius: '50%' 
              }} 
            />
            <Typography variant="body2" color="text.secondary">Profit</Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RevenueChart; 