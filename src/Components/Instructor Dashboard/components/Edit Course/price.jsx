import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

const currencies = [
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "Egypt Pound" },
];

const priceTiers = [
  { value: "free", label: "Free" },
  { value: "tier1", label: "$19.99 (tier 1)" },
  { value: "tier2", label: "$22.99 (tier 2)" },
  { value: "tier3", label: "$24.99 (tier 3)" },
  { value: "tier4", label: "$27.99 (tier 4)" },
  { value: "tier5", label: "$29.99 (tier 5)" },
  { value: "tier6", label: "$34.99 (tier 6)" },
  { value: "tier7", label: "$39.99 (tier 7)" },
  { value: "tier8", label: "$44.99 (tier 8)" },
  { value: "tier9", label: "$49.99 (tier 9)" },
  { value: "tier10", label: "$54.99 (tier 10)" },
  { value: "tier11", label: "$59.99 (tier 11)" },
  { value: "tier12", label: "$64.99 (tier 12)" },
  { value: "tier13", label: "$69.99 (tier 13)" },
  { value: "tier14", label: "$74.99 (tier 14)" },
  { value: "tier15", label: "$79.99 (tier 15)" },
  { value: "tier16", label: "$84.99 (tier 16)" },
  { value: "tier17", label: "$89.99 (tier 17)" },
  { value: "tier18", label: "$94.99 (tier 18)" },
];

export default function PricingForm() {
  const [currency, setCurrency] = useState("USD");
  const [priceTier, setPriceTier] = useState("");

  const handleSave = () => {
    // Handle save logic here
    console.log({ currency, priceTier });
  };

  return (
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Set a price for your course
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please select the currency and the price tier for your course. If
            you'd like to offer your course for free, it must have a total video
            length of less than 2 hours. Also, courses with practice tests can
            not be free.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                label="Currency"
                onChange={(e) => setCurrency(e.target.value)}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Price Tier</InputLabel>
              <Select
                value={priceTier}
                label="Price Tier"
                onChange={(e) => setPriceTier(e.target.value)}
              >
                {priceTiers.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Save
          </Button>
        </Box>
      </Paper>
  );
}
