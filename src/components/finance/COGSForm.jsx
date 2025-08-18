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

const COGSSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: Yup.date().required('Date is required'),
  category: Yup.string().required('Category is required'),
});

const cogsCategories = [
  { value: 'raw_materials', label: 'Raw Materials' },
  { value: 'direct_labor', label: 'Direct Labor' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'manufacturing', label: 'Manufacturing Costs' },
  { value: 'delivery', label: 'Delivery Costs' },
  { value: 'other', label: 'Other COGS' },
];

const COGSForm = ({ onSubmit }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Cost of Goods Sold (COGS)
      </Typography>
      <Formik
        initialValues={{
          description: '',
          amount: '',
          date: new Date(),
          category: 'raw_materials',
        }}
        validationSchema={COGSSchema}
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
                {cogsCategories.map((option) => (
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
              Add COGS
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default COGSForm; 