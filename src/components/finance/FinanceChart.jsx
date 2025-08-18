import React from 'react';
import { Box, Paper, Typography, useTheme, alpha } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FinanceChart = ({ data, type, title }) => {
  const theme = useTheme();

  const chartColors = {
    revenue: {
      main: '#4caf50',
      light: 'rgba(76, 175, 80, 0.2)',
      gradient: (ctx) => {
        if (!ctx?.chart?.ctx) return 'rgba(76, 175, 80, 0.2)';
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(76, 175, 80, 0.5)');
        gradient.addColorStop(1, 'rgba(76, 175, 80, 0.0)');
        return gradient;
      }
    },
    cogs: {
      main: '#ff9800',
      light: 'rgba(255, 152, 0, 0.2)',
      gradient: (ctx) => {
        if (!ctx?.chart?.ctx) return 'rgba(255, 152, 0, 0.2)';
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(255, 152, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 152, 0, 0.0)');
        return gradient;
      }
    },
    expenses: {
      main: '#f44336',
      light: 'rgba(244, 67, 54, 0.2)',
      gradient: (ctx) => {
        if (!ctx?.chart?.ctx) return 'rgba(244, 67, 54, 0.2)';
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(244, 67, 54, 0.5)');
        gradient.addColorStop(1, 'rgba(244, 67, 54, 0.0)');
        return gradient;
      }
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.income,
        backgroundColor: type === 'line' ? 
          (context) => chartColors.revenue.gradient(context) : 
          chartColors.revenue.light,
        borderColor: chartColors.revenue.main,
        borderWidth: 2,
        pointBackgroundColor: chartColors.revenue.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: type === 'line',
        tension: 0.3,
      },
      {
        label: 'COGS',
        data: data.cogs,
        backgroundColor: type === 'line' ? 
          (context) => chartColors.cogs.gradient(context) : 
          chartColors.cogs.light,
        borderColor: chartColors.cogs.main,
        borderWidth: 2,
        pointBackgroundColor: chartColors.cogs.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: type === 'line',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: data.expenses,
        backgroundColor: type === 'line' ? 
          (context) => chartColors.expenses.gradient(context) : 
          chartColors.expenses.light,
        borderColor: chartColors.expenses.main,
        borderWidth: 2,
        pointBackgroundColor: chartColors.expenses.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: type === 'line',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: theme.typography.fontFamily,
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        bodyFont: {
          family: theme.typography.fontFamily,
        },
        titleFont: {
          family: theme.typography.fontFamily,
          weight: 'bold',
        },
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          labelColor: (context) => {
            const colorKey = 
              context.datasetIndex === 0 ? 'revenue' : 
              context.datasetIndex === 1 ? 'cogs' : 'expenses';
            
            return {
              backgroundColor: chartColors[colorKey].main,
              borderColor: chartColors[colorKey].main,
            };
          },
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
          font: {
            family: theme.typography.fontFamily,
          },
          color: theme.palette.text.secondary,
        },
        grid: {
          color: alpha(theme.palette.divider, 0.1),
          drawBorder: false,
        }
      },
      x: {
        ticks: {
          font: {
            family: theme.typography.fontFamily,
          },
          color: theme.palette.text.secondary,
        },
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        }
      }}
      elevation={0}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>
      <Box 
        height={300} 
        sx={{
          position: 'relative',
          '& canvas': {
            borderRadius: 2,
          }
        }}
      >
        {type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </Box>
    </Paper>
  );
};

export default FinanceChart; 