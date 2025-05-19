import Ai from "../../assets/ai.png";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import UB1 from "../../assets/UB1.webp";
import UB2 from "../../assets/UB2.webp";
import UB3 from "../../assets/UB3.webp";
import UB4 from "../../assets/UB4.webp";
import logo1 from "../../assets/logo-boozallenhamilton-2.svg";
import logo2 from "../../assets/logo-capitalone-2.svg";
import logo3 from "../../assets/logo-eventbrite-1.svg";
import logo4 from "../../assets/logo-toyota-1.svg";



// بيانات شهادات العملاء
const testimonials = [
  {
    text: "Udemy was rated the most popular online course or certification program for learning how to code according to StackOverflow’s 2023 Developer survey.",
    name: "StackOverflow",
    bio: "37,076 responses collected",
    course: "View web development courses",
  },
  {
    text: "Capital One Accelerates Transformational Learning through Udemy Business",
    name: "Alvin Lim",
    bio: "Technical Co-Founder, CTO at Dimensional",
    course: "View this iOS &Swift course",
  },
  {
    text: "Eventbrite Navigates Change Through Skill-Building and Leadership Development",
    name: "William A. Wachlin",
    bio: "Partner Account Manager at Amazon Web Services",
    course: "View this AWS courses",
  },
  {
    text: "With Udemy Business employees were able to marry the two together, technology and consultant soft skills... to help drive their careers forward.",
    name: "Ian Stevens",
    bio: "Head of Capability Development, North America at Publicis Sapient",
    course: "Read full story",
  },
];



const boozData = [
  {
    logo: logo1,
    title:
      "Booz Allen Hamilton Unlocks Talent Retention and Productivity Through Upskilling",
    stats: [
      { percent: "93%", text: "retention rate among participating employees" },
      {
        percent: "65%",
        text: "of learners noted a positive impact on their productivity",
      },
    ],
    image: UB1,
  },
  {
    logo: logo2,
    title:
      "Capital One Accelerates Transformational Learning through Udemy Business",
    stats: [
      {
        percent: "95%",
        text: "of learners rated Udemy as “very helpful” to their success",
      },
      {
        percent: "65%",
        text: "increase in retention for in-demand tech roles",
      },
    ],
    image: UB2,
  },
  {
    logo: logo3,
    title:
      "Eventbrite Navigates Change Through Skill-Building",
    stats: [
      {
        percent: "4,800+",
        text: "increase in employee enrollments ",
      },
      {
        percent: "65%",
        text: "boosted team efficiencyrevenue growth ",
      },
    ],
    image: UB3,
  },
  {
    logo: logo4,
    title: "Empowering Teams with AI-Driven Learning",
    stats: [
      { percent: "50%", text: "training cost reduction per person" },
      { percent: "+7,000", text: "hours of upskilling" },
    ],
    image: UB4,
  },
];




export default function Home3() {
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
const navigate = useNavigate();

  // const fetchCategories = async () => {
  //   try {
  //     const snapshot = await getDocs(collection(db, "Categories"));
  //     const categoryList = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       name: doc.data().name,
  //     }));
  //     setCategories(categoryList);
  //   } catch (error) {
  //     console.error("Error fetching categories: ", error);
  //   }
  // };

  useEffect(() => {
    async function fetchData() {
      
      const catSnapshot = await getDocs(collection(db, "Categories"));
      const categoriesData = catSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoriesData);


      const map = {};
      for (const category of categoriesData) {
        const subSnap = await getDocs(
          query(collection(db, "SubCategories"), where("category_id", "==", category.id))
        );

     
        const subcategories = subSnap.docs.slice(0, 3).map((subDoc) => ({
          id: subDoc.id,
          name: subDoc.data().name,
          courseCount: subDoc.data().courseCount || 0, 
        }));

        map[category.id] = subcategories;
      }
      setSubCategoriesMap(map);
    }

    fetchData();
  }, []);

  const handleSubcategoryClick = (subId) => {
    navigate(`subcategory/${subId}`);
  };
const handleCategoryClick = (categoryId) => {
  navigate(`/subcategory/${categoryId}`); 
};




  return (
    <Box p={4}>
      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: "#f9f9f9", p: 3, mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#15243f"
          gutterBottom
          fontFamily="initial"
        >
          See what others are achieving through learning
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            overflowX: "auto",
            pb: 2,
          }}
          className="hide-scrollbar"
        >
          {testimonials.map((item, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                maxWidth: 300,
                flex: "0 0 auto",
                borderRadius: 2,
                mx: 1,
              }}
            >
              <CardContent>
                <Typography variant="body2">{item.text}</Typography>
                <Typography variant="subtitle1" mt={1}>
                  {item.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontSize={12}
                >
                  {item.bio}
                </Typography>
                <Button
                  size="small"
                  sx={{ mt: 1, color: "#5624d0", textTransform: "none" }}
                  endIcon={<ArrowForwardIcon />}
                >
                  {item.course}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

  {/* AI for Business Leaders */}
    
<Grid
  container
  alignItems="center"
  justifyContent="space-between"
  wrap="no-wrap"
  mb={6}
  spacing={2}
  sx={{
    flexDirection: { xs: 'column', md: 'row' }, 
  }}
>

    <Grid
    item
    xs={12}
    md={6}
    width= '90%'
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      mt: { xs: 4, md: 0 }, 
      
    }}
  >
    <Box
      component="img"
      src={Ai}
      alt="AI cards"
      sx={{
        maxWidth: '80%',
        width: '80%',
        height: 'auto',
      }}
    />
  </Grid>
  <Grid item xs={12} md={6} >
    <Typography
      variant="h4"
      fontWeight={700}
      color="#15243f"
      gutterBottom
      fontFamily="initial"
    >
      AI for Business Leaders
    </Typography>
    <Typography variant="body1" paragraph>
      Build an AI-habit for you and your<br />team that builds hands-on skills
      to help you lead effectively.
    </Typography>
    <Button variant="outlined" endIcon={<ArrowForwardIcon />}>
      Start Learning
    </Button>
  </Grid>


</Grid>

 {/* Trending Now */}
  <Box mb={6} sx={{ backgroundColor: "#f5f5f5", p: 3, borderRadius: 1 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="#15243f"
        gutterBottom
        fontFamily="initial"
      >
        Trending Now
      </Typography>

      <Grid container spacing={2}>
        {/* العمود الأول ثابت */}
        <Grid item xs={12} md={3}>
          <Typography variant="h4" fontWeight={600}>
            Top Trending Skills
          </Typography>
          <Button
            variant="text"
            sx={{
              pl: 0,
              color: "#5624d0",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "18px",
            }}
            endIcon={<ArrowForwardIcon />}
          >
            See All Courses
          </Button>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Millions of learners worldwide
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              color: "#5624d0",
              borderColor: "#5624d0",
              fontWeight: "bold",
            }}
          >
            Show all trending skills
          </Button>
        </Grid>

        {/* الأعمدة الديناميكية */}
     {categories.map((category) => (
  <Grid item xs={12} md={3} key={category.id}>
    <Typography
      variant="h5"
      fontWeight={600}
      sx={{
        color: "black",
        cursor: "pointer",
        mb: 1,
      }}
      onClick={() => handleCategoryClick(category.id)}
    >
      {category.name}
    </Typography>
    {(subCategoriesMap[category.id] || []).map((sub) => (
      <Box key={sub.id} mt={1}>
        <Typography
          variant="body1"
          sx={{
            color: "#5624d0",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => handleSubcategoryClick(sub.id)}
        >
          {sub.name}
        </Typography>
      </Box>
    ))}
  </Grid>
))}

      </Grid>
    </Box>

      {/* Booz Slider Section */}
      <Box sx={{ mb: 6 }}>
        <Slider dots arrows={false} infinite speed={500} slidesToShow={1}>
          {boozData.map((item, index) => (
            <Box key={index} sx={{ px: 2 }}>
              <Grid
                container
                spacing={4}
                alignItems="center"
                justifyContent="space-between"
                direction={{ xs: "column", md: "row" }}
              >
                <Grid item xs={12} md={6}>
                  <img
                    src={item.logo}
                    alt="logo"
                    style={{ maxWidth: "120px", marginBottom: "16px" }}
                  />
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mb: 2 }}>
                    {item.stats.map((stat, i) => (
                      <Box key={i}>
                        <Typography variant="h4" fontWeight={700}>
                          {stat.percent}
                        </Typography>
                        <Typography variant="body2">{stat.text}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ mt: 3, backgroundColor: "#7560ab" }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Read full story
                  </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={item.image}
                    alt="Booz Allen Hamilton"
                    sx={{
                      width: "100%",
                      height: "60vh",
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
