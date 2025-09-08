import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  MenuItem,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const steps = ['Personal Info', 'Company Details', 'Account Setup'];

  const roles = [
    { value: 'sender', label: 'Sender - I send packages' },
    { value: 'receiver', label: 'Receiver - I receive packages' },
    { value: 'courier', label: 'Courier - I deliver packages' },
    { value: 'admin', label: 'Admin - I manage operations' },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.company || !formData.role) {
        setError('Please fill in all required fields');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('/api/register/', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        role: formData.role,
      });
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration failed', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Building size={20} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              select
              label="Your Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              helperText="Select the role that best describes your use of Dropa"
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              required
              helperText="Password must be at least 6 characters long"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => navigate('/')} sx={{ bgcolor: 'background.paper' }}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              Dropa
            </Typography>
          </Stack>

          {/* Registration Form */}
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Stack spacing={4}>
              {/* Title */}
              <Stack spacing={2} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                  }}
                >
                  <UserPlus size={32} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Create Your Account
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Join thousands of businesses using Dropa for smart delivery management
                </Typography>
              </Stack>

              {/* Stepper */}
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Form Content */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  {renderStepContent(activeStep)}

                  {/* Navigation Buttons */}
                  <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                    >
                      Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        endIcon={<UserPlus size={20} />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        endIcon={<ArrowRight size={20} />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>

              {/* Divider */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                  Already have an account?
                </Typography>
              </Divider>

              {/* Sign In Link */}
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/login"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Sign In Instead
              </Button>
            </Stack>
          </Paper>

          {/* Footer */}
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" style={{ color: theme.palette.primary.main }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" style={{ color: theme.palette.primary.main }}>
              Privacy Policy
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Register;