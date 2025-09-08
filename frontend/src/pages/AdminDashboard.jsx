import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function AdminDashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Monitor platform analytics, manage users, and review feedback and
          anomalies.
        </Typography>
      </Paper>
    </Box>
  );
}
