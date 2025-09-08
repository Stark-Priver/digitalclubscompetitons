import React from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { Rocket, ShieldCheck, Timer, Users, MapPin, Bot } from "lucide-react";

const features = [
  {
    icon: <Rocket size={32} color="#1976d2" />,
    title: "AI Delivery Prediction",
    desc: "Get accurate ETA predictions for every parcel using advanced ML models.",
  },
  {
    icon: <ShieldCheck size={32} color="#1976d2" />,
    title: "Secure OTP/QR",
    desc: "Authenticate deliveries with OTP and QR code for maximum security.",
  },
  {
    icon: <Timer size={32} color="#1976d2" />,
    title: "Anomaly Detection",
    desc: "Detect delays, route deviations, and suspicious delivery patterns instantly.",
  },
  {
    icon: <MapPin size={32} color="#1976d2" />,
    title: "Geo-fencing & Tracking",
    desc: "Monitor courier routes and trigger alerts for off-path events.",
  },
  {
    icon: <Users size={32} color="#1976d2" />,
    title: "Multi-Role Access",
    desc: "Sender, Receiver, Courier, and Admin dashboards for every user.",
  },
  {
    icon: <Bot size={32} color="#1976d2" />,
    title: "DropaBot Chat Assistant",
    desc: "Ask delivery questions and get instant analytics with DropaBot.",
  },
];

export default function Landing() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", py: 6 }}>
      <Grid container justifyContent="center" alignItems="center" spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={4} sx={{ p: 5, textAlign: "center", mb: 4 }}>
            <Typography
              variant="h2"
              color="primary"
              fontWeight={700}
              gutterBottom
            >
              Dropa Delivery Intelligence
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Deliver Smarter. Detect Faster. Predict Better.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              href="#dashboard"
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
                  elevation={2}
                  sx={{ p: 3, textAlign: "center", height: "100%" }}
                >
                  <Box mb={2}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={600} color="primary">
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {f.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
