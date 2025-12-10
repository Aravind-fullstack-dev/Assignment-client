// SummaryCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function SummaryCard({ title, value, icon, color }) {
  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        p: 1,
        background: color || "#ffffff",
        minWidth: 250,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box sx={{ mr: 2, fontSize: 40 }}>{icon}</Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
