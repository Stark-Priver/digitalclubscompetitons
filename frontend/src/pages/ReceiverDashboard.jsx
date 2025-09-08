import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ReceiverDashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        Receiver Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Track incoming packages, authenticate deliveries, and view delivery
          analytics.
        </Typography>
      </Paper>
    </Box>
  );
}
