import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  MapPin,
  Bot,
  BarChart3,
  Clock,
  Smartphone,
  Globe,
  CheckCircle2,
  ArrowLeft,
  Menu as MenuIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Features = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: <TrendingUp size={40} />,
      title: 'AI-Powered Delivery Predictions',
      description: 'Advanced machine learning algorithms analyze historical data, traffic patterns, and weather conditions to predict delivery times with 95% accuracy.',
      benefits: ['Reduce customer complaints', 'Optimize resource allocation', 'Improve customer satisfaction'],
      color: theme.palette.primary.main,
    },
    {
      icon: <Shield size={40} />,
      title: 'Secure Package Authentication',
      description: 'Multi-layer security with OTP verification and QR code scanning ensures packages reach the right recipients every time.',
      benefits: ['Eliminate package theft', 'Verify recipient identity', 'Secure handover process'],
      color: theme.palette.success.main,
    },
    {
      icon: <MapPin size={40} />,
      title: 'Real-time GPS Tracking',
      description: 'Live tracking with geo-fencing alerts keeps all stakeholders informed about package location and delivery status.',
      benefits: ['Live location updates', 'Route deviation alerts', 'Estimated arrival times'],
      color: theme.palette.error.main,
    },
    {
      icon: <BarChart3 size={40} />,
      title: 'Advanced Analytics Dashboard',
      description: 'Comprehensive insights into delivery performance, courier efficiency, and operational metrics with interactive visualizations.',
      benefits: ['Performance metrics', 'Trend analysis', 'Custom reports'],
      color: theme.palette.warning.main,
    },
    {
      icon: <Bot size={40} />,
      title: 'DropaBot AI Assistant',
      description: 'Intelligent chatbot powered by RAG technology provides instant answers to delivery queries and operational insights.',
      benefits: ['24/7 support', 'Instant analytics', 'Natural language queries'],
      color: theme.palette.secondary.main,
    },
    {
      icon: <Users size={40} />,
      title: 'Multi-Role Management',
      description: 'Customized dashboards and permissions for senders, receivers, couriers, and administrators with role-based access control.',
      benefits: ['Role-based access', 'Custom workflows', 'Team collaboration'],
      color: theme.palette.info.main,
    },
  ];

  const additionalFeatures = [
    { icon: <Clock size={24} />, title: 'Time-Series Forecasting', description: 'Predict delivery volumes and optimize capacity planning' },
    { icon: <Smartphone size={24} />, title: 'Mobile-First Design', description: 'Responsive interface optimized for mobile devices' },
    { icon: <Globe size={24} />, title: 'Multi-Language Support', description: 'Available in Swahili and English for local users' },
    { icon: <Zap size={24} />, title: 'Real-time Notifications', description: 'Instant alerts via SMS, email, and push notifications' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="fixed" sx={{ bgcolor: 'background.paper', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, color: 'primary.main' }}>
            Dropa
          </Typography>
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" component={Link} to="/" sx={{ color: 'text.primary' }}>
              Home
            </Button>
            <Button color="inherit" component={Link} to="/features" sx={{ color: 'primary.main', fontWeight: 600 }}>
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
          pb: 8,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip 
              label="🚀 Comprehensive Feature Set" 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
              }} 
            />
            <Typography variant="h1" sx={{ color: 'text.primary', maxWidth: '800px' }}>
              Everything You Need for
              <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                Smart Delivery Management
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', fontWeight: 400 }}>
              Discover how Dropa's advanced features transform your delivery operations with AI-powered intelligence and real-time insights.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Main Features */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Stack spacing={8}>
          {mainFeatures.map((feature, index) => (
            <Card key={index} sx={{ overflow: 'visible' }}>
              <CardContent sx={{ p: 6 }}>
                <Grid container spacing={6} alignItems="center">
                  <Grid item xs={12} md={6} order={{ xs: 2, md: index % 2 === 0 ? 1 : 2 }}>
                    <Stack spacing={4}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 3,
                          bgcolor: alpha(feature.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: feature.color,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                      <Stack spacing={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Key Benefits:
                        </Typography>
                        <Stack spacing={1}>
                          {feature.benefits.map((benefit, idx) => (
                            <Stack direction="row" spacing={2} key={idx}>
                              <CheckCircle2 size={20} color={feature.color} />
                              <Typography variant="body2">{benefit}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6} order={{ xs: 1, md: index % 2 === 0 ? 2 : 1 }}>
                    <Box
                      sx={{
                        height: 300,
                        background: `linear-gradient(135deg, ${feature.color}, ${alpha(feature.color, 0.7)})`,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                      }}
                    >
                      {feature.title} Demo
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>

      {/* Additional Features */}
      <Box sx={{ py: 10, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h2" sx={{ color: 'text.primary' }}>
                Additional Capabilities
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px' }}>
                More features that make Dropa the complete solution for your delivery needs
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {additionalFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                    <Stack spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
              Ready to Experience These Features?
            </Typography>
            <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.9), maxWidth: '500px' }}>
              Start your free trial today and see how Dropa can transform your delivery operations
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
                Start Free Trial
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
                Schedule Demo
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Features;