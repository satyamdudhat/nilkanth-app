import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  MenuItem,
  Grid,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const IncomeSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: Yup.date().required('Date is required'),
  category: Yup.string().required('Category is required'),
});

const incomeCategories = [
  { value: 'sales', label: 'Product Sales' },
  { value: 'service', label: 'Service Revenue' },
  { value: 'rent', label: 'Rental Income' },
  { value: 'interest', label: 'Interest Income' },
  { value: 'other', label: 'Other Income' },
];

const IncomeForm = ({ onSubmit }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      sx={{ 
        p: 3,
        borderRadius: 3,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
      }}
      elevation={0}
    >
      <Box 
        sx={{ 
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box 
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            mr: 2
          }}
        >
          <AttachMoneyIcon />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            flex: 1
          }}
        >
          Add Revenue / Income
        </Typography>
      </Box>
      
      <Formik
        initialValues={{
          description: '',
          amount: '',
          date: new Date(),
          category: 'sales',
        }}
        validationSchema={IncomeSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="description"
                  label="Description"
                  variant="outlined"
                  placeholder="Enter income description"
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="amount"
                  label="Amount (₹)"
                  type="number"
                  variant="outlined"
                  placeholder="0.00"
                  error={touched.amount && Boolean(errors.amount)}
                  helperText={touched.amount && errors.amount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  select
                  name="category"
                  label="Category"
                  variant="outlined"
                  error={touched.category && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                  }}
                >
                  {incomeCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={values.date}
                    onChange={(newValue) => {
                      setFieldValue('date', newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        error: touched.date && Boolean(errors.date),
                        helperText: touched.date && errors.date,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon color="action" />
                            </InputAdornment>
                          ),
                        },
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                            },
                          },
                        },
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 6px 16px ${alpha(theme.palette.success.main, 0.4)}`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Save Income Transaction
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default IncomeForm; 