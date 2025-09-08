import React, { useState } from 'react';
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
  TextField,
  Chip,
  useTheme,
  alpha,
  IconButton,
  MenuItem,
} from '@mui/material';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowLeft,
  Menu as MenuIcon,
  MessageSquare,
  Users,
  HelpCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Contact = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: 'Email Us',
      description: 'Get in touch via email',
      value: 'hello@dropa.co.tz',
      action: 'mailto:hello@dropa.co.tz',
      color: theme.palette.primary.main,
    },
    {
      icon: <Phone size={24} />,
      title: 'Call Us',
      description: 'Speak with our team',
      value: '+255 123 456 789',
      action: 'tel:+255123456789',
      color: theme.palette.success.main,
    },
    {
      icon: <MapPin size={24} />,
      title: 'Visit Us',
      description: 'Our office location',
      value: 'Dar es Salaam, Tanzania',
      action: '#',
      color: theme.palette.error.main,
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      description: 'When we\'re available',
      value: 'Mon-Fri: 8AM-6PM EAT',
      action: '#',
      color: theme.palette.warning.main,
    },
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Pricing' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media & Press' },
  ];

  const faqs = [
    {
      icon: <MessageSquare size={24} />,
      question: 'How does Dropa\'s AI prediction work?',
      answer: 'Our AI analyzes historical delivery data, traffic patterns, weather conditions, and other factors to predict delivery times with 95% accuracy.',
    },
    {
      icon: <Users size={24} />,
      question: 'Can Dropa scale with my business?',
      answer: 'Yes! Dropa is designed to grow with your business, from small operations handling dozens of packages to enterprise-level logistics managing thousands daily.',
    },
    {
      icon: <HelpCircle size={24} />,
      question: 'What support do you provide?',
      answer: 'We offer 24/7 customer support, comprehensive documentation, training sessions, and dedicated account management for enterprise clients.',
    },
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
            <Button color="inherit" component={Link} to="/about" sx={{ color: 'text.primary' }}>
              About
            </Button>
            <Button color="inherit" component={Link} to="/contact" sx={{ color: 'primary.main', fontWeight: 600 }}>
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
              label="📞 Get in Touch" 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
              }} 
            />
            <Typography variant="h1" sx={{ color: 'text.primary', maxWidth: '800px' }}>
              Let's Start a
              <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                Conversation
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', fontWeight: 400 }}>
              Have questions about Dropa? Want to see a demo? Our team is here to help you transform your delivery operations.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Contact Info */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  textAlign: 'center',
                  cursor: info.action !== '#' ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: info.action !== '#' ? 'translateY(-4px)' : 'none',
                    boxShadow: info.action !== '#' ? theme.shadows[8] : theme.shadows[1],
                  }
                }}
                onClick={() => info.action !== '#' && window.open(info.action)}
              >
                <Stack spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: alpha(info.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: info.color,
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {info.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {info.description}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: info.color }}>
                    {info.value}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form & FAQ */}
      <Box sx={{ py: 10, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 6 }}>
                <Stack spacing={4}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Send us a Message
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Name"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          select
                          label="Inquiry Type"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        >
                          {inquiryTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          endIcon={<Send size={20} />}
                          sx={{ px: 4 }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            {/* FAQ */}
            <Grid item xs={12} md={5}>
              <Stack spacing={4}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Frequently Asked Questions
                </Typography>
                <Stack spacing={3}>
                  {faqs.map((faq, index) => (
                    <Card key={index} sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'primary.main',
                            }}
                          >
                            {faq.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {faq.question}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 7 }}>
                          {faq.answer}
                        </Typography>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
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
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.9), maxWidth: '500px' }}>
              Don't wait - start your free trial today and see how Dropa can transform your delivery operations.
            </Typography>
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
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;