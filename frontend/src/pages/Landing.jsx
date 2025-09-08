import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Rocket,
  ShieldCheck,
  Timer,
  Users,
  MapPin,
  Bot,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";

const featureColors = [
  "#1976d2", // blue
  "#43a047", // green
  "#ff9800", // orange
  "#d81b60", // pink
  "#00bcd4", // cyan
  "#8e24aa", // purple
];

const features = [
  {
    icon: <Rocket size={32} color={featureColors[0]} />,
    title: "AI Delivery Prediction",
    desc: "Accurately predict delivery times for parcels using advanced machine learning.",
  },
  {
    icon: <ShieldCheck size={32} color={featureColors[1]} />,
    title: "Secure OTP/QR",
    desc: "Authenticate deliveries with OTP and QR code for maximum security.",
  },
  {
    icon: <Timer size={32} color={featureColors[2]} />,
    title: "Anomaly Detection",
    desc: "Detect delays, route deviations, and suspicious delivery patterns instantly.",
  },
  {
    icon: <MapPin size={32} color={featureColors[3]} />,
    title: "Geo-fencing & Tracking",
    desc: "Monitor courier routes and trigger alerts for off-path events.",
  },
  {
    icon: <Users size={32} color={featureColors[4]} />,
    title: "Multi-Role Dashboards",
    desc: "Sender, Receiver, Courier, and Admin dashboards for every user.",
  },
  {
    icon: <Bot size={32} color={featureColors[5]} />,
    title: "DropaBot Chat Assistant",
    desc: "Ask delivery questions and get instant analytics with DropaBot.",
  },
];

const navLinks = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },
  { label: "Login", icon: <LogIn size={20} />, href: "/login" },
  { label: "Register", icon: <UserPlus size={20} />, href: "/register" },
];

export default function Landing() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
            Dropa Delivery Intelligence
          </Typography>
          {navLinks.map((link, i) => (
            <Button
              key={i}
              color="inherit"
              startIcon={link.icon}
              href={link.href}
              sx={{ ml: 2 }}
            >
              {link.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={4}
        sx={{ py: 8 }}
      >
        <Grid item xs={12} md={8}>
          <Paper
            elevation={4}
            sx={{
              p: 5,
              textAlign: "center",
              mb: 4,
              background: "linear-gradient(90deg,#1976d2 0%,#43a047 100%)",
              color: "#fff",
            }}
          >
            <Typography
              variant="h2"
              fontWeight={700}
              gutterBottom
              sx={{ color: "#fff" }}
            >
              Dropa: AI-Powered Delivery Solution
            </Typography>
            <Typography variant="h5" sx={{ color: "#e3f2fd" }} gutterBottom>
              Solving Real Delivery Challenges
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: "#e3f2fd" }}>
              Dropa is designed for the competition to address delivery
              inefficiencies, delays, and security issues in Tanzania. Our
              platform uses AI and data analytics to optimize courier operations
              and improve customer experience.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                bgcolor: "#ff9800",
                color: "#fff",
                "&:hover": { bgcolor: "#fb8c00" },
              }}
              href="/register"
            >
              Get Started
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={10}>
          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    height: "260px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg,${featureColors[i]}22 0%,#fff 100%)`,
                    border: `2px solid ${featureColors[i]}`,
                    boxShadow: `0 4px 24px 0 ${featureColors[i]}33`,
                  }}
                >
                  <Box mb={2}>{f.icon}</Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: featureColors[i] }}
                  >
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333", mt: 1 }}>
                    {f.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ bgcolor: "#fff", py: 6, mt: 8 }}>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              sx={{ color: "#1976d2" }}
            >
              How Dropa Solves the Problem
            </Typography>
            <Typography variant="body1" sx={{ color: "#333" }} gutterBottom>
              - Predicts delivery times using local data
              <br />
              - Detects and prevents delivery anomalies
              <br />
              - Secures handovers with OTP/QR authentication
              <br />
              - Provides dashboards for all stakeholders
              <br />
              - Real-time analytics for decision making
              <br />- Easy onboarding and support
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ bgcolor: "#f5f7fa", py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Dropa Delivery Intelligence. All
          rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
