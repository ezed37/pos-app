import { useEffect, useState, useRef } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getAllSales } from "../api/salesApi";

const cardStyles = {
  todayRevenue: {
    p: 3,
    borderRadius: 3,
    textAlign: "center",
    backgroundColor: "#ff0000",
    color: "#000",
  },
  smallRed: {
    p: 2,
    borderRadius: 3,
    textAlign: "center",
    backgroundColor: "#ff4d4d",
    color: "#000",
  },
  smallBlue: {
    p: 2,
    borderRadius: 3,
    textAlign: "center",
    backgroundColor: "#4d4dff",
    color: "#000",
  },
};

export default function Dashboard() {
  const [now, setNow] = useState(new Date());
  const [saleData, setSaleData] = useState([]);
  const [currentDateData, setCurrentDateData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const chartContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch sales data
  useEffect(() => {
    async function fetchSalesData() {
      try {
        const data = await getAllSales();
        setSaleData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSalesData();
  }, []);

  // Update today/month data when sales change
  useEffect(() => {
    const c = new Date();
    const todaySales = saleData.filter((t) => {
      const d = new Date(t.createdAt);
      return (
        d.getFullYear() === c.getFullYear() &&
        d.getMonth() === c.getMonth() &&
        d.getDate() === c.getDate()
      );
    });
    const monthSales = saleData.filter((t) => {
      const d = new Date(t.createdAt);
      return (
        d.getFullYear() === c.getFullYear() && d.getMonth() === c.getMonth()
      );
    });
    setCurrentDateData(todaySales);
    setCurrentMonthData(monthSales);
  }, [saleData]);

  // Last 30 days sales
  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d;
  });

  const last30DaysSales = last30Days.map((day) => {
    const dateStr = day.toLocaleDateString();
    const total = saleData
      .filter((s) => new Date(s.createdAt).toLocaleDateString() === dateStr)
      .reduce((acc, s) => acc + s.sub_total, 0);
    return { date: dateStr, sales: total };
  });

  // Calculate totals and revenue
  const totalToday = currentDateData.reduce((acc, s) => acc + s.sub_total, 0);
  const totalMonth = currentMonthData.reduce((acc, s) => acc + s.sub_total, 0);

  const todayCost = currentDateData
    .flatMap((s) => s.items)
    .reduce((sum, item) => sum + item.qty * item.cost_price, 0);
  const monthCost = currentMonthData
    .flatMap((s) => s.items)
    .reduce((sum, item) => sum + item.qty * item.cost_price, 0);

  const todayRevenue = totalToday - todayCost;
  const monthRevenue = totalMonth - monthCost;

  // Track chart container width
  useEffect(() => {
    function updateWidth() {
      if (chartContainerRef.current)
        setContainerWidth(chartContainerRef.current.offsetWidth);
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" mb={4}>
        {now.toLocaleDateString()} | {now.toLocaleTimeString()}
      </Typography>

      {/* Cards */}
      <Grid container spacing={2}>
        {/* Today Revenue */}
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyles.todayRevenue}>
            <Typography variant="h6">Total Revenue (Today)</Typography>
            <Typography variant="h3" fontWeight="bold">
              Rs {todayRevenue}
            </Typography>
          </Paper>
        </Grid>

        {/* Today's small cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyles.smallRed}>
            <Typography variant="body2">Sales Count (Today)</Typography>
            <Typography variant="h5" fontWeight="bold">
              {currentDateData.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyles.smallRed}>
            <Typography variant="body2">Total Sales (Today)</Typography>
            <Typography variant="h5" fontWeight="bold">
              Rs {totalToday}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyles.smallRed}>
            <Typography variant="body2">Revenue (Today)</Typography>
            <Typography variant="h5" fontWeight="bold">
              Rs {todayRevenue}
            </Typography>
          </Paper>
        </Grid>

        {/* Monthly cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyles.smallBlue}>
            <Typography variant="body2">Sales Count (Month)</Typography>
            <Typography variant="h5" fontWeight="bold">
              {currentMonthData.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyles.smallBlue}>
            <Typography variant="body2">Total Sales (Month)</Typography>
            <Typography variant="h5" fontWeight="bold">
              Rs {totalMonth}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyles.smallBlue}>
            <Typography variant="body2">Revenue (Month)</Typography>
            <Typography variant="h5" fontWeight="bold">
              Rs {monthRevenue}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Last 30 Days Chart */}
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          Sales in Last 30 Days
        </Typography>
        <Box ref={chartContainerRef} sx={{ width: "100%", height: 300 }}>
          {containerWidth > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last30DaysSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#1976d2"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
