import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  alpha,
  Stack,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  MapPin,
  Bot,
  ArrowRight,
  CheckCircle,
  Star,
  Menu as MenuIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms predict delivery times with 95% accuracy',
      color: theme.palette.primary.main,
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Authentication',
      description: 'OTP and QR code verification ensures secure package handovers',
      color: theme.palette.success.main,
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-time Tracking',
      description: 'Live GPS tracking and instant notifications for all stakeholders',
      color: theme.palette.warning.main,
    },
    {
      icon: <Users size={32} />,
      title: 'Multi-Role Dashboard',
      description: 'Customized interfaces for senders, receivers, couriers, and admins',
      color: theme.palette.secondary.main,
    },
    {
      icon: <MapPin size={32} />,
      title: 'Geo-fencing & Routes',
      description: 'Smart route optimization and automated alerts for deviations',
      color: theme.palette.error.main,
    },
    {
      icon: <Bot size={32} />,
      title: 'DropaBot Assistant',
      description: 'AI chatbot for instant analytics and delivery insights',
      color: theme.palette.info.main,
    },
  ];

  const stats = [
    { number: '99.5%', label: 'Delivery Success Rate' },
    { number: '45min', label: 'Average Delivery Time' },
    { number: '10K+', label: 'Daily Packages' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="fixed" sx={{ bgcolor: 'background.paper', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, color: 'primary.main' }}>
            Dropa
          </Typography>
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" component={Link} to="/" sx={{ color: 'text.primary' }}>
              Home
            </Button>
            <Button color="inherit" component={Link} to="/features" sx={{ color: 'text.primary' }}>
              Features
            </Button>
            <Button color="inherit" component={Link} to="/about" sx={{ color: 'text.primary' }}>
              About
            </Button>
            <Button color="inherit" component={Link} to="/contact" sx={{ color: 'text.primary' }}>
              Contact
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ ml: 3 }}>
            <Button variant="outlined" component={Link} to="/login">
              Sign In
            </Button>
            <Button variant="contained" component={Link} to="/register">
              Get Started
            </Button>
          </Stack>
          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          pt: 15,
          pb: 10,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Chip 
                  label="🚀 AI-Powered Delivery Intelligence" 
                  sx={{ 
                    alignSelf: 'flex-start',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 600,
                  }} 
                />
                <Typography variant="h1" sx={{ color: 'text.primary', maxWidth: '600px' }}>
                  Revolutionize Your
                  <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                    Delivery Operations
                  </Box>
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '500px', fontWeight: 400 }}>
                  Transform your logistics with AI-powered predictions, real-time tracking, 
                  and intelligent analytics. Built for Tanzania's delivery ecosystem.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    endIcon={<ArrowRight size={20} />}
                    onClick={() => navigate('/register')}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/features')}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    View Demo
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: 400,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                Dashboard Preview
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 800 }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Stack spacing={6} alignItems="center">
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h2" sx={{ color: 'text.primary' }}>
                Powerful Features for Modern Logistics
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px' }}>
                Everything you need to optimize your delivery operations and delight your customers
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card 
                    sx={{ 
                      p: 4, 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8],
                      }
                    }}
                  >
                    <Stack spacing={3}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          bgcolor: alpha(feature.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: feature.color,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {feature.description}
                      </Typography>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Typography variant="h2" sx={{ color: 'text.primary' }}>
                Why Choose Dropa?
              </Typography>
              <Stack spacing={3}>
                {[
                  'Reduce delivery times by up to 40%',
                  'Eliminate package theft with secure authentication',
                  'Real-time visibility for all stakeholders',
                  'AI-powered route optimization',
                  'Comprehensive analytics and reporting',
                  '24/7 customer support',
                ].map((benefit, index) => (
                  <Stack direction="row" spacing={2} key={index}>
                    <CheckCircle size={24} color={theme.palette.success.main} />
                    <Typography variant="body1">{benefit}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: 400,
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            >
              Analytics Dashboard
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h2" sx={{ color: 'white' }}>
              Ready to Transform Your Deliveries?
            </Typography>
            <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.9), maxWidth: '500px' }}>
              Join thousands of businesses already using Dropa to optimize their delivery operations
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  '&:hover': { bgcolor: alpha('#ffffff', 0.9) }
                }}
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': { 
                    borderColor: 'white',
                    bgcolor: alpha('#ffffff', 0.1)
                  }
                }}
                onClick={() => navigate('/contact')}
              >
                Contact Sales
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  Dropa
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  AI-powered delivery intelligence for modern logistics operations in Tanzania and beyond.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} md={3}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Product</Typography>
                    <Stack spacing={1}>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Features
                      </Button>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Pricing
                      </Button>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        API
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Company</Typography>
                    <Stack spacing={1}>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        About
                      </Button>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Careers
                      </Button>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Contact
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Resources</Typography>
                    <Stack spacing={1}>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Documentation
                      </Button>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Help Center
                      </Button>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Blog
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Legal</Typography>
                    <Stack spacing={1}>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Privacy
                      </Button>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Terms
                      </Button>
                      <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                        Security
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ pt: 4, mt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              © {new Date().getFullYear()} Dropa. All rights reserved. Built with ❤️ for Tanzania's logistics future.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;