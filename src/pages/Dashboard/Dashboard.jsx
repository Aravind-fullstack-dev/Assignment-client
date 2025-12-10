import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  alpha,
  useTheme,
  useMediaQuery,
  Button,
  Stack
} from "@mui/material";
import { toast } from "react-toastify";

import EnhancedSummaryCard from "../../components/common/SummeryCard";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    departments: 0,
    newThisMonth: 0,
    performanceIndex: "0%",
    newEmployeesThisWeek: 0,
    pendingReviews: 0,
    pendingOnboarding: 0,
    growth: "0%",
  });
  const [loading, setLoading] = useState(false);

  // Function to fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // if API needs auth
      const response = await fetch("http://localhost:5000/api/employees/dashboard-stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // optional
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch dashboard data");
      }

      const data = await response.json();
      console.log(data ,"hhhhhhhhhhhhh");

      // Map API data to state
      setDashboardData({
        totalEmployees: data.data.total_employees || 0,
        departments: data.data.total_departments || 0,
        newThisMonth: data.data.new_this_month || 0,
        performanceIndex: data.data.performance_index || "0%",
        newEmployeesThisWeek: data.data.new_employees_this_week || 0,
        pendingReviews: data.data.pendingReviews || 0,
        pendingOnboarding: data.data.pendingOnboarding || 0,
        growth: data.data.growth || "0%",
      });
    } catch (error) {
      console.error("Dashboard API error:", error);
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 }, minHeight: "100vh" }}>
      {/* Header and Quick Stats omitted for brevity */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={800}>
          Dashboard Overview
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <CalendarTodayIcon fontSize="small" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>

        <Stack direction="row" spacing={2} mt={2}>
          <Button onClick={fetchDashboardData} startIcon={<RefreshIcon />} variant="outlined">
            Refresh
          </Button>
          <Button startIcon={<DownloadIcon />} variant="contained">
            Export
          </Button>
        </Stack>

        <Paper sx={{ mt: 2, p: 2, display: "flex", justifyContent: "space-between" }}>
          <Box>
            <NotificationsActiveIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>{dashboardData.newEmployeesThisWeek} new employees</strong> joined this week • <strong>{dashboardData.pendingReviews} performance reviews</strong> pending
            </Typography>
          </Box>
          <Button size="small" endIcon={<ArrowForwardIcon />}>
            View all
          </Button>
        </Paper>
      </Box>

      {/* Main Stats Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EnhancedSummaryCard
            title="Total Employees"
            value={dashboardData.totalEmployees}
            icon={<GroupIcon />}
            color={theme.palette.primary.main}
            trend={true}
            description={`${dashboardData.growth} growth this quarter`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EnhancedSummaryCard
            title="Departments"
            value={dashboardData.departments}
            icon={<BusinessIcon />}
            color={theme.palette.secondary.main}
            description="All departments active"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EnhancedSummaryCard
            title="New This Month"
            value={dashboardData.newThisMonth}
            icon={<PersonAddIcon />}
            color={theme.palette.success.main}
            trend={true}
            description={`${dashboardData.pendingOnboarding} pending onboarding`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EnhancedSummaryCard
            title="Performance Index"
            value={dashboardData.performanceIndex}
            icon={<TrendingUpIcon />}
            color={theme.palette.warning.main}
            trend={true}
            description="Increase from last month"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
