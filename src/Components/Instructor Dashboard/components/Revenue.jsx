import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { getInstructorTransactions } from "../../../Firebase/courses";
// إضافة hook الترجمة
import { useTranslation } from "react-i18next";

const Revenue = () => {
  const { t } = useTranslation();
  const [revenueData, setRevenueData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [monthFilter, setMonthFilter] = React.useState("12m");

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await getInstructorTransactions("11");
        setRevenueData(data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueData();
  }, []);

  // إذا كانت revenueData مصفوفة (ليست كائن فيه transactions)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transactions = Array.isArray(revenueData)
    ? revenueData
    : revenueData.transactions || [];

  const totalRevenue = transactions.reduce(
    (sum, tx) => sum + (tx.amount || 0),
    0
  );

  const thisMonthRevenue = transactions
    .filter(
      (tx) =>
        new Date(tx.date).getMonth() === new Date().getMonth() &&
        new Date(tx.date).getFullYear() === new Date().getFullYear()
    )
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const transactionsCount = transactions.length;

  // فلترة المعاملات حسب الفلتر المختار
  const filteredTransactions = React.useMemo(() => {
    if (monthFilter === "1m") {
      const now = new Date();
      return transactions.filter(
        (tx) =>
          new Date(tx.date).getMonth() === now.getMonth() &&
          new Date(tx.date).getFullYear() === now.getFullYear()
      );
    }
    if (monthFilter === "6m" || monthFilter === "12m") {
      const now = new Date();
      const months = monthFilter === "6m" ? 6 : 12;
      const from = new Date(
        now.getFullYear(),
        now.getMonth() - (months - 1),
        1
      );
      return transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate >= from && txDate <= now;
      });
    }
    return transactions;
  }, [transactions, monthFilter]);

  return (
    <Box
      sx={{ p: { xs: 1, md: 4 }, background: "#f7f7fa", minHeight: "100vh" }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary.main">
        {t("revenue.overview")}
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              color: "white",
            }}
          >
            <Avatar sx={{ bgcolor: "white", color: "#2575fc", mr: 2 }}>
              <MonetizationOnIcon />
            </Avatar>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="subtitle2">
                {t("revenue.totalRevenue")}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ${totalRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
              color: "white",
            }}
          >
            <Avatar sx={{ bgcolor: "white", color: "#43cea2", mr: 2 }}>
              <TrendingUpIcon />
            </Avatar>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="subtitle2">
                {t("revenue.thisMonth")}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ${thisMonthRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              background: "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)",
              color: "white",
            }}
          >
            <Avatar sx={{ bgcolor: "white", color: "#f7971e", mr: 2 }}>
              <ReceiptLongIcon />
            </Avatar>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="subtitle2">
                {t("revenue.transactions")}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {transactionsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            {t("revenue.transactions")}
          </Typography>
          <Box>
            <Select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              size="small"
              sx={{ mr: 2 }}
            >
              <MenuItem value="1m">{t("revenue.lastMonth")}</MenuItem>
              <MenuItem value="6m">{t("revenue.last6Months")}</MenuItem>
              <MenuItem value="12m">{t("revenue.last12Months")}</MenuItem>
            </Select>
            <Button variant="contained" color="primary">
              {t("revenue.export")}
            </Button>
          </Box>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {loading ? (
          <Typography color="text.secondary">{t("revenue.loading")}</Typography>
        ) : filteredTransactions.length === 0 ? (
          <Typography color="text.secondary">{t("revenue.noData")}</Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                background: "#fff",
                borderRadius: 8,
                overflow: "hidden",
                minWidth: 900,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <thead>
                <tr style={{ background: "#f7f9fb" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 12px",
                      fontWeight: 700,
                      color: "#222",
                      fontSize: 15,
                    }}
                  >
                    {t("revenue.date")}
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 12px",
                      fontWeight: 700,
                      color: "#222",
                      fontSize: 15,
                    }}
                  >
                    {t("revenue.courseTitle")}
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 12px",
                      fontWeight: 700,
                      color: "#222",
                      fontSize: 15,
                    }}
                  >
                    {t("revenue.student")}
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 12px",
                      fontWeight: 700,
                      color: "#222",
                      fontSize: 15,
                    }}
                  >
                    {t("revenue.amount")}
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 12px",
                      fontWeight: 700,
                      color: "#222",
                      fontSize: 15,
                    }}
                  >
                    {t("revenue.status")}
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 12px",
                      fontWeight: 700,
                      color: "#222",
                      fontSize: 15,
                    }}
                  >
                    {t("revenue.method")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, idx) => (
                  <tr
                    key={tx.transactionId}
                    style={{
                      background: idx % 2 === 0 ? "#fff" : "#f7f9fb",
                      borderBottom: "1px solid #ececec",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 12px",
                        color: "#444",
                        fontSize: 15,
                      }}
                    >
                      {tx.date ? new Date(tx.date).toLocaleDateString() : ""}
                    </td>
                    <td
                      style={{
                        padding: "14px 12px",
                        color: "#222",
                        fontSize: 15,
                      }}
                    >
                      {tx.courseTitle}
                    </td>
                    <td
                      style={{
                        padding: "14px 12px",
                        color: "#666",
                        fontSize: 15,
                      }}
                    >
                      {tx.username}
                    </td>
                    <td
                      style={{
                        padding: "14px 12px",
                        color: "#1976d2",
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      +${tx.amount ? tx.amount.toFixed(2) : "0.00"}
                    </td>
                    <td
                      style={{
                        padding: "14px 12px",
                        color:
                          tx.status === "Completed" ? "#388e3c" : "#f57c00",
                        fontWeight: 600,
                        fontSize: 15,
                        textTransform: "capitalize",
                      }}
                    >
                      {tx.status || t("revenue.completed")}
                    </td>
                    <td
                      style={{
                        padding: "14px 12px",
                        color: "#444",
                        fontSize: 15,
                        textTransform: "capitalize",
                      }}
                    >
                      {tx.paymentMethod || "PayPal"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Revenue;
