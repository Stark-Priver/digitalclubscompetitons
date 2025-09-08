import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function SenderDashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        Sender Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          View and manage all your sent packages, track delivery status, and get
          predictive analytics.
        </Typography>
      </Paper>
    </Box>
  );
}
