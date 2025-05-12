import React from "react";
import { Card, CardContent, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";

const cardData = [
  {
    topTitle: "Personal Plan",
    topText: "For you",
    userText: " Individual",
    title: "Starting at E£204.00 per month",
    description: "Billed monthly or annually. Cancel anytime.",
    features: [
      "Access to 12,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
    
    ]
  },
  {
    topTitle: "Team Plan",
    topText: "For your team",
    userText: "2 to 20 people",
    title: "E£1,490.00 a month per user",
    description: "Billed annually. Cancel anytime.",
    features: [
      "Access to 12,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
      "Analytics and adoption reports",
     
      
    ]
  },
  {
    topTitle: "Enterprise Plan",
    topText: "Analytics and adoption reports",
    userText: "More than 20 people",
    title: "Contact sales for pricing",
    description: "",
    features: [
     " Access to 27,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
      "Advanced analytics and insights",
      "Dedicated customer success team",
      "International course collection featuring 15 languages",
      "Customizable content",
      "Hands-on tech training with add-on",
     " Strategic implementation services with add-on",
    ]
  }
];

const AcceleratorSection = () => {
  return (
    <div style={{ padding: "40px", backgroundColor: "#fff" }}>
      <Typography variant="h4" fontWeight="bold" color="#15243f" gutterBottom fontFamily="initial" >
        Accelerate growth — for you or your organization
      </Typography>
      <Typography variant="body1" color="#555" marginBottom={4}>
        Reach goals faster with one of our plans or programs. Try one free today or contact sales to learn more
      </Typography>


      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {cardData.map((card, idx) => (
          <Card
          key={idx}
          sx={{
            width: 370,
            height:"auto",
            border: "1px solid #ccc",
            borderTop: "6px solid #6a1b9a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* الجزء الرمادي خارج CardContent وياخد العرض الكامل */}
          <div style={{ backgroundColor: "#f5f5f5", padding: "16px", width: "100%", borderBottom: "1px solid #ddd" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {card.topTitle}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {card.topText}
            </Typography>
            <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
              <PersonIcon style={{ fontSize: "20px", marginRight: "5px", color: "#777" }} />
              <Typography variant="body2" color="textSecondary">
                {card.userText}
              </Typography>
            </div>
          </div>
        
          <CardContent  sx={{ paddingTop: 0 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {card.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {card.description}
            </Typography>
        
            <div style={{ margin: "0px 0", textAlign: "center" }}>
              <Button
                fullWidth
                variant="contained"
                style={{ backgroundColor: "#6a1b9a", color: "#fff", borderRadius: "20px" }}
              >
                Try it Free
              </Button>
            </div>
        
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              {card.features.map((feature, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon style={{ color: "#6a1b9a", marginRight: "8px", fontSize: "10px" }} />
                  <Typography variant="body2" color="textPrimary">
                    {feature}
                  </Typography>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        ))}
      </div>
    </div>
  );
};

export default AcceleratorSection;
