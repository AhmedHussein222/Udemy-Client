import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase.js";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const SubcategoryPage = () => {
  const { subcategoryId } = useParams();
  const [courses, setCourses] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const FilterSection = ({ label, options, selectedValue, onChange }) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <RadioGroup value={selectedValue} onChange={onChange}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </AccordionDetails>
    </Accordion>
  );

  const [selectedRating, setSelectedRating] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  const durationOptions = [
    { value: "short", label: "Less than 1 hour" },
    { value: "medium", label: "1 to 3 hours" },
    { value: "long", label: "More than 3 hours" },
  ];

  const ratingOptions = [
    { value: "4", label: "★★★★☆ & up" },
    { value: "3", label: "★★★☆☆ & up" },
    { value: "2", label: "★★☆☆☆ & up" },
  ];

  const subcategoryOptions = subCategories.map((sub) => ({
    value: sub.id,
    label: sub.name,
  }));

  const priceOptions = [
    { value: "free", label: "Free" },
    { value: "0-50", label: "Under $50" },
    { value: "50+", label: "Above $50" },
  ];

  const handleRatingChange = (e) => setSelectedRating(e.target.value);
  const handleSubcategoryChange = (e) => setSelectedSubcategory(e.target.value);
  const handlePriceChange = (e) => setSelectedPrice(e.target.value);
  const handleDurationChange = (e) => setSelectedDuration(e.target.value);

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory && course.category !== selectedCategory) return false;

    if (selectedRating) {
      const ratingThreshold = Number(selectedRating);
      if (!course.rating || course.rating.rate < ratingThreshold) return false;
    }

    if (selectedPrice) {
      const price = Number(course.price) || 0;
      if (selectedPrice === "free" && price !== 0) return false;
      if (selectedPrice === "0-50" && (price <= 0 || price > 50)) return false;
      if (selectedPrice === "50+" && price <= 50) return false;
    }

    if (selectedDuration) {
      const duration = course.duration;
      if (selectedDuration === "short" && duration >= 60) return false;
      if (selectedDuration === "medium" && (duration < 60 || duration > 180))
        return false;
      if (selectedDuration === "long" && duration <= 180) return false;
    }

    return true;
  });

  const selectedCourses = courses.slice(0, 2);

  const totalPriceSelected = selectedCourses.reduce((acc, course) => {
    const price = Number(course.price) || 0;
    return acc + price;
  }, 0);
  const discountPercentage = 20;

  // حساب قيمة الخصم
  const discountValue = (totalPriceSelected * discountPercentage) / 100;

  // السعر بعد الخصم
  const discountedPrice = totalPriceSelected - discountValue;

  console.log(totalPriceSelected);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const reviewsSnapshot = await getDocs(collection(db, "Reviews"));
        const ratingsMap = {};

        reviewsSnapshot.forEach((doc) => {
          const data = doc.data();
          const courseId = data.course_id;
          const rating = data.rating;

          if (ratingsMap[courseId]) {
            ratingsMap[courseId].push(rating);
          } else {
            ratingsMap[courseId] = [rating];
          }
        });

        const averageRatings = {};
        Object.keys(ratingsMap).forEach((courseId) => {
          const ratings = ratingsMap[courseId];
          const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          averageRatings[courseId] = avg;
        });

        const coursesSnapshot = await getDocs(
          query(
            collection(db, "Courses"),
            where("subcategory_id", "==", subcategoryId)
          )
        );

        const loadedCourses = coursesSnapshot.docs.map((doc) => {
          const courseData = doc.data();
          const avgRating = averageRatings[doc.id] || 0;
          return {
            id: doc.id,
            ...courseData,
            rating: {
              rate: Number(avgRating.toFixed(1)),
              count: ratingsMap[doc.id]?.length || 0,
            },
          };
        });

        setCourses(loadedCourses);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };

    const fetchSubCategoryName = async () => {
      try {
        const docRef = doc(db, "SubCategories", subcategoryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSubCategoryName(docSnap.data().name);
        } else {
          console.warn("No such subcategory with ID:", subcategoryId);
        }
      } catch (error) {
        console.error("Error fetching subcategory name: ", error);
      }
    };

    const loadSubCategories = async () => {
      const data = await fetchSubCategories(subcategoryId);
      setSubCategories(data);
    };
    const fetchSubCategories = async (subcategoryId) => {
      const q = query(
        collection(db, "SubCategories"),
        where("category_id", "==", subcategoryId)
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    };

    fetchCourses();
    fetchSubCategoryName();
    fetchSubCategories();
    loadSubCategories();
  }, [subcategoryId]);

  useEffect(() => {
    const fetchFilteredCourses = async () => {
      if (!selectedSubcategory) return;

      try {
        // Fetch all reviews
        const reviewsSnapshot = await getDocs(collection(db, "Reviews"));
        const ratingsMap = {};

        reviewsSnapshot.forEach((doc) => {
          const data = doc.data();
          const courseId = data.course_id;
          const rating = data.rating;

          if (ratingsMap[courseId]) {
            ratingsMap[courseId].push(rating);
          } else {
            ratingsMap[courseId] = [rating];
          }
        });

        const averageRatings = {};
        Object.keys(ratingsMap).forEach((courseId) => {
          const ratings = ratingsMap[courseId];
          const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          averageRatings[courseId] = avg;
        });

        // Fetch courses filtered by selected subcategory
        const q = query(
          collection(db, "Courses"),
          where("subcategory_id", "==", selectedSubcategory)
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const courseData = doc.data();
          const avgRating = averageRatings[doc.id] || 0;

          return {
            id: doc.id,
            ...courseData,
            rating: {
              rate: Number(avgRating.toFixed(1)),
              count: ratingsMap[doc.id]?.length || 0,
            },
          };
        });

        setCourses(data);
      } catch (error) {
        console.error("Error filtering courses by subcategory:", error);
      }
    };

    fetchFilteredCourses();
  }, [selectedSubcategory]);

  return (
    <Box sx={{ padding: 4 }}>
      {/* عنوان رئيسي */}
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        textAlign="left"
        fontFamily="initial"
      >
        {subCategoryName} Courses
      </Typography>

      {/* البوكس الرئيسي (يسار معلومات + يمين كورسات) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // عمودي على الشاشات الصغيرة، أفقي على الكبيرة
          gap: 1,
          maxWidth: "1500px",
          border: "1px solid #000",
          padding: 2,
        }}
      >
        {/* الشمال */}
        <Box sx={{ flex: "1 1 300px" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Looking to advance your skills in {subCategoryName}? We've got you.
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Get everything you need to reach your goals in one convenient
            bundle.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              • Top-rated courses
            </Typography>
            <Typography variant="body1" gutterBottom>
              • Popular with learners just like you
            </Typography>
            <Typography variant="body1" gutterBottom>
              • Guidance from real-world experts
            </Typography>
          </Box>

          {/* السعر المجمع (مشطوب عليه ورمادي) والسعر الأقل بالأسود */}
          <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body1"
              sx={{ textDecoration: "line-through", color: "gray" }}
            >
              ${totalPriceSelected.toFixed(2)}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="dark">
              ${discountedPrice.toFixed(2)}
            </Typography>
            <Typography
              variant="body2"
              color="green"
              sx={{ fontWeight: "bold" }}
            >
              (20% off)
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Box
              component="button"
              sx={{
                backgroundColor: "purple",
                color: "white",
                px: { xs: 2, md: 10 },
                py: 1.5,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                width: { xs: "100%", md: "auto" },
              }}
            >
              Add To Cart
            </Box>
          </Box>
        </Box>

        {/* اليمين: الكاردين مع علامة + بينهم */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-start" },
            flexDirection: { xs: "column", md: "row" }, // على الموبايل يبقى عمودي
            gap: 1,
            mt: { xs: 2, md: 0 }, // مسافة بسيطة فوق لما يبقوا تحت بعض
          }}
        >
          {selectedCourses.map((course, idx) => (
            <React.Fragment key={idx}>
              <Link
                to={`/course-details/${course.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                key={course.id}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    width: 300,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      course.thumbnail || "https://via.placeholder.com/200x120"
                    }
                    alt={course.title}
                    sx={{ width: "100%", height: 120, objectFit: "cover" }}
                  />
                  <Box sx={{ padding: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      noWrap
                    >
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ mb: 1 }}
                    >
                      {course.description}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      Price: ${course.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Rating: ⭐ {course.rating?.rate} ({course.rating?.count}{" "}
                      reviews)
                    </Typography>
                  </Box>
                </Box>
              </Link>

              {/* علامة + بين الكاردين بعد الأول */}
              {idx === 0 && (
                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: 40,
                    color: "#800080",
                    userSelect: "none",
                    mx: 1,
                  }}
                >
                  +
                </Box>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Section: Popular Topics */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Popular topics
        </Typography>

        <Box
          sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            "&::-webkit-scrollbar": { display: "none" },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: 140,
          }}
        >
          {/* الصف الأول */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {courses
              .slice(0, Math.ceil(courses.length / 2))
              .map((course, index) => (
                <button
                  key={`btn1-${index}`}
                  style={{
                    padding: "20px 32px",
                    backgroundColor: "#eee",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    whiteSpace: "normal",
                    flexShrink: 0,
                    fontWeight: "bold",
                    borderRadius: "4px",
                  }}
                  onClick={() => navigate(`/course/${course.id}`)} // هنا الرابط
                >
                  {course.title}
                </button>
              ))}
          </Box>

          {/* الصف الثاني */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {courses
              .slice(Math.ceil(courses.length / 2))
              .map((course, index) => (
                <button
                  key={`btn2-${index}`}
                  style={{
                    padding: "20px 32px",
                    backgroundColor: "#eee",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    whiteSpace: "normal",
                    flexShrink: 0,
                  }}
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  {course.title}
                </button>
              ))}
          </Box>
        </Box>
      </Box>

      {/* Section: All Business Courses + Filter */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold">
          All {subCategoryName} Courses
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            mb: 2,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              color: "#000",
              backgroundColor: "#fff",
              borderColor: "#000",
              fontWeight: "bold",
            }}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "purple",
              backgroundColor: "#fff",
              border: "none",
              fontWeight: "bold",
            }}
            onClick={() => {
              setSelectedRating("");
              setSelectedPrice("");
              setSelectedSubcategory("");
              setSelectedDuration("");
            }}
          >
            Reset Filters
          </Button>
        </Box>

        {/* Slide Filter Section */}
        {showFilter && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Filter by
            </Typography>
            <FilterSection
              label="Rating"
              options={ratingOptions}
              selectedValue={selectedRating}
              onChange={handleRatingChange}
            />
            <FilterSection
              label="Subcategories"
              options={subcategoryOptions}
              selectedValue={selectedSubcategory}
              onChange={handleSubcategoryChange}
            />

            <FilterSection
              label="Price"
              options={priceOptions}
              selectedValue={selectedPrice}
              onChange={handlePriceChange}
            />

            <FilterSection
              label="Duration"
              options={durationOptions}
              selectedValue={selectedDuration}
              onChange={handleDurationChange}
            />
          </Box>
        )}

        {/* عرض الكورسات بعد الفلترة */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {courses
            .filter((course) => {
              // Rating Filter
              if (
                selectedRating &&
                course.rating?.rate < parseInt(selectedRating)
              )
                return false;

              // Subcategory Filter
              if (
                selectedSubcategory &&
                course.subcategory_id !== selectedSubcategory
              )
                return false;

              // Price Filter
              if (selectedPrice === "free" && course.price > 0) return false;
              if (
                selectedPrice === "0-50" &&
                !(course.price > 0 && course.price <= 50)
              )
                return false;
              if (selectedPrice === "50+" && course.price <= 50) return false;

              return true;
            })
            .map((course, index) => (
              <Box
                key={`filtered-${index}`}
                onClick={() => navigate(`/course/${course.id}`)}
                sx={{
                  width: 300,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <Box
                  component="img"
                  src={
                    course.thumbnail || "https://via.placeholder.com/300x180"
                  }
                  alt={course.title}
                  sx={{ width: "100%", height: 180, objectFit: "cover" }}
                />
                <Box sx={{ padding: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {course.description}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mt: 1 }}
                  >
                    Price: ${course.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: ⭐ {course.rating?.rate} ({course.rating?.count}{" "}
                    reviews)
                  </Typography>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SubcategoryPage;
