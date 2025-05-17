import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import React from 'react';

const mockRevenue = {
  total: 1200.50,
  thisMonth: 150.75,
  transactions: [
    { id: 1, date: '2024-06-01', amount: 50.25, description: 'Course Sale: React Basics' },
    { id: 2, date: '2024-06-10', amount: 100.50, description: 'Course Sale: Advanced JS' },
  ]
};

const Revenue = () => {
  return (
    <Box sx={{ p: { xs: 1, md: 4 }, background: '#f7f7fa', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary.main">
        Revenue Overview
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: 'white' }}>
            <Avatar sx={{ bgcolor: 'white', color: '#2575fc', mr: 2 }}>
              <MonetizationOnIcon />
            </Avatar>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="subtitle2">Total Revenue</Typography>
              <Typography variant="h5" fontWeight="bold">${mockRevenue.total.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', color: 'white' }}>
            <Avatar sx={{ bgcolor: 'white', color: '#43cea2', mr: 2 }}>
              <TrendingUpIcon />
            </Avatar>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="subtitle2">This Month</Typography>
              <Typography variant="h5" fontWeight="bold">${mockRevenue.thisMonth.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, background: 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)', color: 'white' }}>
            <Avatar sx={{ bgcolor: 'white', color: '#f7971e', mr: 2 }}>
              <ReceiptLongIcon />
            </Avatar>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="subtitle2">Transactions</Typography>
              <Typography variant="h5" fontWeight="bold">{mockRevenue.transactions.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} mb={2}>
          <Typography variant="h6" fontWeight="bold">Transactions</Typography>
          <Box>
            <Select defaultValue={"12m"} size="small" sx={{ mr: 2 }}>
              <MenuItem value="1m">Last month</MenuItem>
              <MenuItem value="6m">Last 6 months</MenuItem>
              <MenuItem value="12m">Last 12 months</MenuItem>
            </Select>
            <Button variant="contained" color="primary">Export</Button>
          </Box>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {mockRevenue.transactions.length === 0 ? (
          <Typography color="text.secondary">No data to display</Typography>
        ) : (
          <Box>
            <Grid container spacing={2} sx={{ fontWeight: 'bold', color: 'grey.700', mb: 1 }}>
              <Grid item xs={3}>Date</Grid>
              <Grid item xs={5}>Description</Grid>
              <Grid item xs={4}>Amount</Grid>
            </Grid>
            <Divider sx={{ mb: 1 }} />
            {mockRevenue.transactions.map((tx) => (
              <Grid container spacing={2} key={tx.id} alignItems="center" sx={{ mb: 1, background: '#f5f5f5', borderRadius: 1, p: 1 }}>
                <Grid item xs={3}>
                  <Typography variant="body2">{tx.date}</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="body2">{tx.description}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="success.main" fontWeight="bold">+${tx.amount.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Revenue; 