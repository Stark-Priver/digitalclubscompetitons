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
  Avatar,
  Chip,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Globe,
  ArrowLeft,
  Menu as MenuIcon,
  Linkedin,
  Twitter,
  Mail,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const About = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target size={32} />,
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI and machine learning to solve real-world logistics challenges.',
      color: theme.palette.primary.main,
    },
    {
      icon: <Users size={32} />,
      title: 'Customer-Centric',
      description: 'Every feature we build is designed with our users\' needs and feedback at the center.',
      color: theme.palette.success.main,
    },
    {
      icon: <Heart size={32} />,
      title: 'Local Impact',
      description: 'We\'re committed to transforming Tanzania\'s logistics ecosystem and supporting local businesses.',
      color: theme.palette.error.main,
    },
    {
      icon: <Globe size={32} />,
      title: 'Scalable Solutions',
      description: 'Built to grow with your business, from small operations to enterprise-level logistics.',
      color: theme.palette.secondary.main,
    },
  ];

  const team = [
    {
      name: 'Dr. Amina Hassan',
      role: 'CEO & Co-Founder',
      bio: 'Former logistics director with 15+ years experience in East African supply chains.',
      avatar: 'AH',
      social: { linkedin: '#', twitter: '#', email: 'amina@dropa.co.tz' }
    },
    {
      name: 'James Mwangi',
      role: 'CTO & Co-Founder',
      bio: 'AI researcher and software architect specializing in machine learning applications.',
      avatar: 'JM',
      social: { linkedin: '#', twitter: '#', email: 'james@dropa.co.tz' }
    },
    {
      name: 'Sarah Kimani',
      role: 'Head of Product',
      bio: 'Product strategist with expertise in user experience and logistics technology.',
      avatar: 'SK',
      social: { linkedin: '#', twitter: '#', email: 'sarah@dropa.co.tz' }
    },
    {
      name: 'Mohamed Ali',
      role: 'Head of Operations',
      bio: 'Operations expert with deep knowledge of Tanzania\'s delivery infrastructure.',
      avatar: 'MA',
      social: { linkedin: '#', twitter: '#', email: 'mohamed@dropa.co.tz' }
    },
  ];

  const stats = [
    { number: '2023', label: 'Founded' },
    { number: '50K+', label: 'Packages Delivered' },
    { number: '200+', label: 'Partner Businesses' },
    { number: '5', label: 'Cities Covered' },
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
            <Button color="inherit" component={Link} to="/features" sx={{ color: 'text.primary' }}>
              Features
            </Button>
            <Button color="inherit" component={Link} to="/about" sx={{ color: 'primary.main', fontWeight: 600 }}>
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
              label="🏢 About Dropa" 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
              }} 
            />
            <Typography variant="h1" sx={{ color: 'text.primary', maxWidth: '800px' }}>
              Transforming Tanzania's
              <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                Delivery Ecosystem
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', fontWeight: 400 }}>
              We're on a mission to revolutionize logistics in East Africa through AI-powered technology and innovative solutions.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 6, height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <Stack spacing={3}>
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
                  <Target size={32} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}>
                  To empower businesses across Tanzania with intelligent delivery solutions that reduce costs, 
                  improve efficiency, and enhance customer satisfaction through cutting-edge AI technology.
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 6, height: '100%', bgcolor: alpha(theme.palette.secondary.main, 0.02) }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'secondary.main',
                  }}
                >
                  <Eye size={32} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Our Vision
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}>
                  To become East Africa's leading logistics intelligence platform, setting the standard for 
                  smart delivery operations and contributing to the region's economic growth.
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Stats */}
      <Box sx={{ py: 8, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 800 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1 }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Values */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Stack spacing={6}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="h2" sx={{ color: 'text.primary' }}>
              Our Core Values
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px' }}>
              The principles that guide everything we do at Dropa
            </Typography>
          </Stack>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ p: 4, height: '100%' }}>
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: alpha(value.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: value.color,
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {value.description}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>

      {/* Team */}
      <Box sx={{ py: 10, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h2" sx={{ color: 'text.primary' }}>
                Meet Our Team
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px' }}>
                The passionate individuals behind Dropa's innovation
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {team.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                    <Stack spacing={3} alignItems="center">
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem',
                          fontWeight: 600,
                        }}
                      >
                        {member.avatar}
                      </Avatar>
                      <Stack spacing={1}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {member.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                          {member.role}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {member.bio}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <Linkedin size={16} />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <Twitter size={16} />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <Mail size={16} />
                        </IconButton>
                      </Stack>
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
              Join Our Journey
            </Typography>
            <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.9), maxWidth: '500px' }}>
              Be part of the logistics revolution in Tanzania. Start using Dropa today and experience the future of delivery management.
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
                Get Started
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
                Contact Us
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default About;