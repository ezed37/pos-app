import { useEffect, useState } from "react";
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

const cardStyle = {
  p: 2,
  borderRadius: 3,
  textAlign: "center",
  backgroundColor: "#f02323ff",
};

const cardStyle2 = {
  p: 2,
  borderRadius: 3,
  textAlign: "center",
  backgroundColor: "#002fffff",
};

const cardStyle3 = {
  p: 2,
  borderRadius: 3,
  textAlign: "center",
  backgroundColor: "#ff0000ff",
};

export default function Dashboard() {
  const [now, setNow] = useState(new Date());
  const [saleData, setSalesData] = useState([]);
  const [currentDateData, setCurrentDateData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [dayItemCost, setDayItemCost] = useState([]);
  const [monthItemCost, setMonthItemCost] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const data = await getAllSales();
        setSalesData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSalesData();
  }, []);

  useEffect(() => {
    setCurrentDateData(todaySales);
    setCurrentMonthData(monthSales);
  }, [saleData]);

  //Current date
  const c = new Date();

  const cYear = c.getFullYear();
  const cMonth = c.getMonth();
  const cDate = c.getDate();

  const todaySales = saleData.filter((t) => {
    const d = new Date(t.createdAt);
    return (
      d.getFullYear() === cYear &&
      d.getMonth() === cMonth &&
      d.getDate() === cDate
    );
  });

  const monthSales = saleData.filter((t) => {
    const d = new Date(t.createdAt);
    return d.getFullYear() === cYear && d.getMonth() === cMonth;
  });

  const totalToday = todaySales.reduce((acc, s) => acc + s.sub_total, 0);
  const totalMonth = monthSales.reduce((acc, s) => acc + s.sub_total, 0);

  //Last 30 day sales
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last30Days.push(d);
  }

  const last30DaysSales = last30Days.map((day) => {
    const dateStr = day.toLocaleDateString();
    const total = saleData
      .filter((s) => new Date(s.createdAt).toLocaleDateString() === dateStr)
      .reduce((acc, s) => acc + s.sub_total, 0);

    return { date: dateStr, sales: total };
  });

  const todayCost = todaySales
    .flatMap((s) => s.items)
    .reduce((sum, item) => sum + item.qty * item.cost_price, 0);

  const todayRevenue = totalToday - todayCost;

  const monthCost = monthSales
    .flatMap((s) => s.items)
    .reduce((sum, item) => sum + item.qty * item.cost_price, 0);

  const monthRevenue = totalMonth - monthCost;

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Dashboard
      </Typography>

      <Typography variant="subtitle1" mb={4}>
        {now.toLocaleDateString()} | {now.toLocaleTimeString()}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={2.4} size={2} />
        <Grid item xs={6} md={2.4} size={8}>
          <Paper elevation={3} sx={cardStyle3}>
            <Typography fontSize={20}>Total Revenue (Today)</Typography>
            <Typography fontSize={35} fontWeight="bold">
              Rs {todayRevenue}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2.4} size={2} />

        <Grid item xs={6} md={2.4} size={4}>
          <Paper elevation={3} sx={cardStyle}>
            <Typography fontSize={12}>Sales Count (Today)</Typography>
            <Typography fontSize={22} fontWeight="bold">
              {currentDateData.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} md={2.4} size={4} />

        <Grid item xs={6} md={2.4} size={4}>
          <Paper elevation={3} sx={cardStyle}>
            <Typography fontSize={12}>Total Sales (Today)</Typography>
            <Typography fontSize={22} fontWeight="bold">
              Rs {totalToday}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} md={2.4} size={4}>
          <Paper elevation={3} sx={cardStyle2}>
            <Typography fontSize={12}>Sales Count (Month)</Typography>
            <Typography fontSize={22} fontWeight="bold">
              {currentMonthData.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} md={2.4} size={4}>
          <Paper elevation={3} sx={cardStyle2}>
            <Typography fontSize={12}>Total Sales (Month)</Typography>
            <Typography fontSize={22} fontWeight="bold">
              Rs {totalMonth}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} md={2.4} size={4}>
          <Paper elevation={3} sx={cardStyle2}>
            <Typography fontSize={12}>Revenue (Month)</Typography>
            <Typography fontSize={22} fontWeight="bold">
              Rs {monthRevenue}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          Sales in Last 30 Days
        </Typography>

        <Box height={300}>
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
        </Box>
      </Paper>
    </Box>
  );
}
