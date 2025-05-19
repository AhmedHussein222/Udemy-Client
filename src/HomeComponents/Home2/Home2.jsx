import React, { useState, useEffect, useRef } from "react";
import "./Home2.css";
import { db } from "../../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ArrowForwardIos, ShoppingCart, FavoriteBorder } from "@mui/icons-material";
import logo1 from "../../assets/hands.webp";
import logo2 from "../../assets/certificate.webp";
import logo3 from "../../assets/empty.webp";
import logo4 from "../../assets/organizations.webp";
import preview1 from "../../assets/S1.png";
import preview2 from "../../assets/S2.png";
import preview3 from "../../assets/S3.png";
import preview4 from "../../assets/S4.png";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// import { useNavigate } from "react-router-dom";

const leftCards = [
  {
    id: 1,
    img: logo1,
    title: "Hands-on training",
    description:
      "Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.",
    previewImg: preview1,
  },
  {
    id: 2,
    img: logo2,
    title: "Expert-led content",
    description:
      "Learn from industry professionals with real-world experience.",
    previewImg: preview2,
  },
  {
    id: 3,
    img: logo3,
    title: "Interactive learning",
    description: "Engage with content that adapts to your pace and style.",
    previewImg: preview3,
  },
  {
    id: 4,
    img: logo4,
    title: "Certification programs",
    description: "Earn credentials that boost your career prospects.",
    previewImg: preview4,
  },
];

const CourseCard = ({ course }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const ratingValue = course.rating?.rate ?? 0;
  const ratingCount = course.rating?.count ?? 0;

  return (
   <div
  className="course-card"
  onClick={() => navigate(`/course/${course.id}`)}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>

      <img src={course.thumbnail} alt={course.title} className="course-image" />

      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        <p className="instructor">{course.description}</p>

        <div className="rating">
          <span className="rating-value">{ratingValue}</span>
          <span className="stars">
            {"★".repeat(Math.round(ratingValue)) +
              "☆".repeat(5 - Math.round(ratingValue))}
          </span>
          <span className="students">({ratingCount.toLocaleString()})</span>
        </div>
        

        <div className="pricing">
          {course.price === 0 ? (
            <>
              <span className="price free">Free</span>
              {course.discount > 0 && (
                <span className="old-price">
                  {(Number(course.price) + Number(course.discount)).toFixed(2)} EGP
                </span>
              )}
            </>
          ) : (
            <>
              <span className="price">{course.price} EGP</span>
              {course.discount > 0 && (
                <span className="old-price">
                  {(Number(course.price) + Number(course.discount)).toFixed(2)} EGP
                </span>
              )}
            </>
          )}
        </div>

        {course.badge && <div className="badge">{course.badge}</div>}
      </div>

      {hovered && (
        <div className="hover-popup">
          <h4>{course.title}</h4>
          <p>{course.description}</p>
          <p className="popup-price">
            {course.price === 0 ? "Free" : `${course.price} EGP`}
          </p>
          <div className="popup-buttons backgroundcolor">
            <button className="popup-icon">Add to cart<ShoppingCart /></button>
            {/* <button className="popup-icon"><FavoriteBorder /></button> */}
          </div>
        </div>
      )}
    </div>
  );
};

const Home2 = () => {
  const [selected, setSelected] = useState(1);
  const [courses, setCourses] = useState([]);
  const [popupCourse, setPopupCourse] = useState(null);
  const scrollRef = useRef(null);

const scrollLeft = () => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({
      left: -300, // ترجع 300 بكسل لليسار
      behavior: "smooth", // تمرير سلس
    });
  }
};

const scrollRight = () => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({
      left: 300, // تتقدم 300 بكسل لليمين
      behavior: "smooth", // تمرير سلس
    });
  }
};


  useEffect(() => {
    const fetchCoursesWithRatings = async () => {
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

        // Fetch all courses
        const querySnapshot = await getDocs(collection(db, "Courses"));
        const coursesData = querySnapshot.docs.map((doc) => {
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

        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses with ratings:", error);
      }
    };

    fetchCoursesWithRatings();
  }, []);

  // Handlers for popup buttons
  const handleAddToCart = () => {
    alert(`Added "${popupCourse.title}" to cart!`);
    setPopupCourse(null);
  };

  const handleAddToWishlist = () => {
    alert(`Added "${popupCourse.title}" to wishlist!`);
    setPopupCourse(null);
  };

  return (
    <>
      <section className="courses-section">
  <h2 className="section-title">Learners are viewing</h2>

  <div className="courses-scroll-wrapper">
    <button className="scroll-button left" onClick={scrollLeft}>
      <ArrowBackIos />
    </button>

    <div className="courses-container" ref={scrollRef}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onClick={setPopupCourse} />
      ))}
    </div>

    <button className="scroll-button right" onClick={scrollRight}>
      <ArrowForwardIos />
    </button>
  </div>
</section>

      <section className="focus-section">
        <h2 className="section-title">Learning focused on your goals</h2>
        <div className="focus-grid">
          <div className="left-options">
            {leftCards.map((card) => (
              <div
                key={card.id}
                className={`option-card ${selected === card.id ? "active" : ""}`}
                onClick={() => setSelected(card.id)}
              >
                <img src={card.img} alt={card.title} className="option-img" />
                <div>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                  <span className="explore-link">
                    Explore course <ArrowForwardIos fontSize="small" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="right-preview">
            <img
              src={leftCards.find((c) => c.id === selected)?.previewImg}
              alt="Preview"
              className="preview-img"
            />
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      {popupCourse && (
        <div className="popup-overlay" onClick={() => setPopupCourse(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{popupCourse.title}</h2>
            <p>{popupCourse.description}</p>
            <p>
              Price:{" "}
              {popupCourse.price === 0 ? (
                <span className="free">Free</span>
              ) : (
                <span>{popupCourse.price} EGP</span>
              )}
            </p>

            <div className="popup-buttons">
              <button onClick={handleAddToCart} className="btn add-to-cart "  >
                <ShoppingCart /> Add to Cart
              </button>
              <button onClick={handleAddToWishlist} className="btn wishlist">
                <FavoriteBorder  /> Wishlist
              </button>
            </div>

            <button className="close-popup" onClick={() => setPopupCourse(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home2;
