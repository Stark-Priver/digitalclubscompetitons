import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function CourierDashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        Courier Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          View assigned deliveries, optimize routes, and get real-time anomaly
          alerts.
        </Typography>
      </Paper>
    </Box>
  );
}
