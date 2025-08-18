import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const ExpenseSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: Yup.date().required('Date is required'),
  category: Yup.string().required('Category is required'),
});

const expenseCategories = [
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

const ExpenseForm = ({ onSubmit }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Other Expenses
      </Typography>
      <Formik
        initialValues={{
          description: '',
          amount: '',
          date: new Date(),
          category: 'rent',
        }}
        validationSchema={ExpenseSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="description"
                label="Description"
                variant="outlined"
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Box>

            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="amount"
                label="Amount (₹)"
                type="number"
                variant="outlined"
                error={touched.amount && Boolean(errors.amount)}
                helperText={touched.amount && errors.amount}
              />
            </Box>

            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                select
                name="category"
                label="Category"
                variant="outlined"
                error={touched.category && Boolean(errors.category)}
                helperText={touched.category && errors.category}
              >
                {expenseCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            </Box>

            <Box mb={2}>
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
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
            >
              Add Expense
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ExpenseForm; 