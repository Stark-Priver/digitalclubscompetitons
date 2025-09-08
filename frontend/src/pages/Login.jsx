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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
  LogIn,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login/', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error('Login failed', error);
    } finally {
      setLoading(false);
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
      <Container maxWidth="sm">
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

          {/* Login Form */}
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
                  <LogIn size={32} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Sign in to your Dropa account to continue
                </Typography>
              </Stack>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
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
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Stack>
              </Box>

              {/* Divider */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                  Don't have an account?
                </Typography>
              </Divider>

              {/* Sign Up Link */}
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Create Account
              </Button>

              {/* Demo Access */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.info.main, 0.2),
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  Want to try Dropa? Use demo credentials:
                  <br />
                  <strong>Email:</strong> demo@dropa.co.tz
                  <br />
                  <strong>Password:</strong> demo123
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Footer */}
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            By signing in, you agree to our{' '}
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

export default Login;