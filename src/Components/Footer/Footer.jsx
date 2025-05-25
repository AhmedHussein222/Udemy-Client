import React, { useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LanguageIcon from "@mui/icons-material/Language";
// import { useTheme } from "@mui/material/styles";

import udemyLogo from "../../assets/logo-udemy-inverted.svg";
import logo4 from "../../assets/eventbrite-light.svg";
import logo2 from "../../assets/volkswagen-light.svg";
import logo1 from "../../assets/nasdaq-light.svg";
import logo3 from "../../assets/netapp-light.svg";
import { useTranslation } from "react-i18next";

const footerLinks = [
  {
    title: "In-demand Careers",
    links: ["Data Scientist", "Full Stack Web Developer", "Cloud Engineer", "Project Manager", "Game Developer"],
  },
  {
    title: "Web Development",
    links: ["Web Development", "JavaScript", "React JS", "Angular", "Java"],
  },
  {
    title: "IT Certifications",
    links: [
      "Amazon AWS",
      "AWS Certified Cloud Practitioner",
      "AZ-900: Microsoft Azure Fundamentals",
      "AWS Certified Solutions Architect - Associate",
      "Kubernetes",
    ],
  },
  {
    title: "Certifications by Skill",
    links: [
      "Cybersecurity Certification",
      "Project Management Certification",
      "Cloud Certification",
      "Data Analytics Certification",
      "HR Management Certification",
    ],
  },
];

const extraLinks = [
  {
    title: "Data Science",
    links: ["Data Science", "Python", "Machine Learning", "ChatGPT", "Deep Learning"],
  },
  {
    title: "Communication",
    links: ["Communication Skills", "Presentation Skills", "Public Speaking", "Writing", "PowerPoint"],
  },
  {
    title: "Leadership",
    links: ["Leadership", "Management Skills", "Project Management", "Personal Productivity", "Emotional Intelligence"],
  },
  {
    title: "Business Analytics & Intelligence",
    links: ["Microsoft Excel", "SQL", "Microsoft Power BI", "Data Analysis", "Business Analysis"],
  },
];

const footerSections = [
  {
    title: "About",
    links: ["About us", "Careers", "Contact us", "Blog", "Investors"],
  },
  {
    title: "Discover Udemy",
    links: ["Get the app", "Teach on Udemy", "Plans and Pricing", "Affiliate", "Help and Support"],
  },
  {
    title: "Udemy for Business",
    links: ["Udemy Business"],
  },
  {
    title: "Legal & Accessibility",
    links: ["Accessibility statement", "Privacy policy", "Sitemap"],
  },
];

export default function Footer() {
  // const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");

      const { t, i18n } = useTranslation();
      const toggleLanguage = () => {
      const newLang = i18n.language === 'en' ? 'ar' : 'en';
      i18n.changeLanguage(newLang);
      localStorage.setItem('lang', newLang);
    };
    
    useEffect(() => {
      const savedLang = localStorage.getItem('lang');
      if (savedLang) {
        i18n.changeLanguage(savedLang);
      }
    }, [i18n]);

      const translatedFooterLinks = footerLinks.map((section) => ({
    title: t(section.title),
    links: section.links.map((link) => t(link)),
  }));

  const translatedExtraLinks = extraLinks.map((section) => ({
    title: t(section.title),
    links: section.links.map((link) => t(link)),
  }));

  const translatedFooterSections = footerSections.map((section) => ({
    title: t(section.title),
    links: section.links.map((link) => t(link)),
  }));

  return (
    <Box sx={{ bgcolor: "#14141f", color: "#fff", pt: 5 }}>
      {/* الصف الأول */}
      <Box sx={{ px: { xs: 2, md: 8 }, mb: 1 }}>
        <Grid container spacing={2} justifyContent={"space-between"}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {t('Top companies choose')}{" "}
              <Link href="#" underline="hover" sx={{ color: "#e0ccff", fontWeight: "bold" }}>
                {t('Udemy Business')}
              </Link>{" "}
              {t('to build in-demand career skills.')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} container spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
            {[logo1, logo2, logo3, logo4].map((logo, index) => (
              <Grid item key={index}>
                <img src={logo} alt={`Logo ${index}`} style={{ height: 30 }} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ bgcolor: "#555", my: 2 }} />

      <Box sx={{ px: { xs: 2, md: 9 } }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          {t('Explore top skills and certifications')}
        </Typography>

        {/* الصف الثاني */}
        {isMobile ? (
          translatedFooterLinks.map((section, idx) => (
            <Accordion key={idx} sx={{ bgcolor: "#14141f", color: "#fff" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.links.map((link, i) => (
                  <Link key={i} href="#" underline="hover" color="inherit" sx={{ display: "block", fontSize: "14px", mb: 1 }}>
                    {link}
                  </Link>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Grid container spacing={2} justifyContent={"space-between"} sx={{ mt: 5 }}>
            {translatedFooterLinks.map((section, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1.5 }}>
                  {section.title}
                </Typography>
                {section.links.map((link, i) => (
                  <Link key={i} href="#" underline="hover" color="inherit" sx={{ display: "block", fontSize: "14px", mb: 1 }}>
                    {link}
                  </Link>
                ))}
              </Grid>
            ))}
          </Grid>
        )}

        {/* الصف الثالث */}
        {isMobile ? (
          translatedExtraLinks.map((section, idx) => (
            <Accordion key={idx} sx={{ bgcolor: "#14141f", color: "#fff" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.links.map((link, i) => (
                  <Link key={i} href="#" underline="hover" color="inherit" sx={{ display: "block", fontSize: "14px", mb: 1 }}>
                    {link}
                  </Link>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Grid container spacing={2} justifyContent={"space-between"} sx={{ my: 3 }}>
            {translatedExtraLinks.map((section, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1.5 }}>
                  {section.title}
                </Typography>
                {section.links.map((link, i) => (
                  <Link key={i} href="#" underline="hover" color="inherit" sx={{ display: "block", fontSize: "14px", mb: 1 }}>
                    {link}
                  </Link>
                ))}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider sx={{ bgcolor: "#555", my: 4 }} />

      {/* الصف الرابع */}
      <Box sx={{ px: { xs: 2, md: 10 } }}>
        <Grid container spacing={2} justifyContent={"space-between"} sx={{ my: 3 }}>
          {translatedFooterSections.map((section, idx) => (
            <Grid item xs={12} sm={3} md={3} key={idx}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5 }}>
                {section.title}
              </Typography>
              {section.links.map((link, i) => (
                <Link key={i} href="#" underline="hover" color="inherit" sx={{ display: "block", fontSize: "14px", mb: 1 }}>
                  {link}
                </Link>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ bgcolor: "#555", my: 4 }} />
{/* الصف الخامس */}
<Box sx={{ px: { xs: 2, md: 8 }, pb: 4 }}>
  <Grid
    container
    spacing={2}
    alignItems="center"
    justifyContent="space-between"
  >
    {/* شمال */}
    <Grid item xs={12} md={4}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: { xs: "flex-start", md: "flex-start" },
        }}
      >
        <img src={udemyLogo} alt="Udemy" style={{ height: 24 }} />
        <Typography sx={{ fontSize: "13px", color: "#ccc" }}>
          {t('© 2025 Udemy, Inc')}.
        </Typography>
      </Box>
    </Grid>

    {/* النص */}
    <Grid item xs={12} md={4}>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", md: "center" },
        }}
      >
        <Link
          href="#"
          underline="hover"
          color="inherit"
          sx={{ fontSize: "13px" }}
        >
          {t('Cookie settings')}
        </Link>
      </Box>
    </Grid>

    {/* اليمين */}
    <Grid item xs={12} md={4}>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", md: "flex-end" },
          alignItems: "center",
          gap: 1,
        }}
      >
               <Button variant="outlined" sx={langBtnStyle} onClick={toggleLanguage}>
  <LanguageIcon sx={{ mr: 1 }} />
  {i18n.language === 'en' ? 'english' : 'عربي'}
</Button>
      </Box>
    </Grid>
  </Grid>
</Box>


    </Box>
  );
}

const langBtnStyle = {
  borderColor: "#8000ff",
  textTransform: "none",
  borderRadius: "4px",
 color: "white",
  py: 1,
  "&:hover": {
    borderColor: "#8000ff",
  },
};