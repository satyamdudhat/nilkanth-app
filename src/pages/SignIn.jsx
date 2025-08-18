import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  useTheme
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useAuth } from '../contexts/AuthContext';

// Import logo using Vite's public asset handling
const logoUrl = new URL('/nilkanth-logo.png', import.meta.url).href;

const SignIn = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Use the signIn function from auth context
        const success = signIn({
          email: formData.email,
          // In a real app, you would not store the password in localStorage
          // This is just for demo purposes
        });
        
        if (success) {
          // Add a small delay to ensure state updates before navigation
          setTimeout(() => {
            navigate('/');
          }, 100);
        } else {
          throw new Error('Sign in failed');
        }
      } catch (error) {
        setSubmitError('Invalid email or password. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 5, pb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 5 }}>
          <img 
            src={logoUrl} 
            alt="Nilkanth Logo" 
            style={{ 
              width: '180px',
              height: 'auto'
            }} 
          />
        </Box>
        
        <Paper
          elevation={1}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f0f0f0'
          }}
        >
          <Typography component="h1" variant="h5" align="center" fontWeight="600" sx={{ mb: 4 }}>
            Sign In
          </Typography>
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" component="label" htmlFor="email" sx={{ mb: 0.5, display: 'block', fontWeight: 500 }}>
                Email Address *
              </Typography>
              <TextField
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="Enter your email"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" component="label" htmlFor="password" sx={{ mb: 0.5, display: 'block', fontWeight: 500 }}>
                Password *
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                placeholder="Enter your password"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              />
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                py: 1.2, 
                mb: 2,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '1rem'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/signup" style={{ 
                  color: theme.palette.primary.main, 
                  textDecoration: 'none',
                  fontWeight: 500
                }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignIn; 