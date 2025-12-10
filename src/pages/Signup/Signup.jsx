import React, { useState } from 'react';
import { Container, Button, Typography, Link, Paper, Box, Grid } from '@mui/material';
import CustomTextField from '../../components/common/CommonTextField';

function SignUpForm() {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 💡 Add robust validation logic here (e.g., check email format, password length)
    if (formData.password.length < 8) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters.' }));
      return;
    }
    
    console.log('Sign Up Data:', formData);
    // ... API call to register the new user
  };

  return (
    // Outer Box for centering and background
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        bgcolor: 'grey.100',
      }}
    >
      <Container component="main" maxWidth="sm"> {/* Slightly wider for name fields */}
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Create Account
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            
            {/* Grid for First Name and Last Name to be side-by-side */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="First Name"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  errorText={errors.firstName}
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Last Name"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  errorText={errors.lastName}
                  autoComplete="family-name"
                />
              </Grid>
            </Grid>
            
            {/* Email Field */}
            <CustomTextField
              label="Email Address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              errorText={errors.email}
              autoComplete="email"
            />

            {/* Password Field */}
            <CustomTextField
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              errorText={errors.password}
              helperText={errors.password || "Password must be at least 8 characters."} // Custom helper text for requirement
              autoComplete="new-password"
            />
            
            {/* Sign Up Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            {/* Link to Login Page */}
            <Box sx={{ textAlign: 'right' }}>
              <Link href="/login" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignUpForm;