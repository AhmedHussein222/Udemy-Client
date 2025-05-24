import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f7f9fa",
        p: 3,
        textAlign: "center",
      }}
    >
      <SentimentDissatisfiedIcon
        sx={{
          fontSize: 100,
          color: "#a435f0",
          mb: 3,
        }}
      />

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "4rem", md: "6rem" },
          fontWeight: 800,
          color: "#1c1d1f",
          mb: 2,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "1.5rem", md: "2rem" },
          fontWeight: 700,
          color: "#1c1d1f",
          mb: 2,
        }}
      >
        {t("notFound.title")}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: "1rem", md: "1.2rem" },
          color: "#6a6f73",
          maxWidth: "600px",
          mb: 4,
        }}
      >
        {t("notFound.message")}
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          bgcolor: "#a435f0",
          color: "#fff",
          fontSize: "1.1rem",
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          "&:hover": {
            bgcolor: "#8710d8",
          },
        }}
      >
        {t("notFound.backHome")}
      </Button>
    </Box>
  );
};

export default NotFound;
