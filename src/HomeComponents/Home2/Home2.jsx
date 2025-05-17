import React, { useState, useEffect } from "react";
import "./Home2.css";
import { db } from "../../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ArrowForwardIos } from "@mui/icons-material";
import logo1 from "../../assets/hands.webp";
import logo2 from "../../assets/certificate.webp";
import logo3 from "../../assets/empty.webp";
import logo4 from "../../assets/organizations.webp";
import preview1 from "../../assets/S1.png";
import preview2 from "../../assets/S2.png";
import preview3 from "../../assets/S3.png";
import preview4 from "../../assets/S4.png";

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
  const ratingValue = course.rating?.rate ?? 0;
  const ratingCount = course.rating?.count ?? 0;

  return (
    <div className="course-card">
      <img src={course.thumbnail} alt={course.title} className="course-image" />

      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        <p className="instructor">{course.description}</p>

        <div className="rating">
          <span className="rating-value">{ratingValue}</span>
          <span className="stars">
            {"☆".repeat(Math.round(ratingValue)) +
              "★".repeat(5 - Math.round(ratingValue))}
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
{(Number(course.price) + Number(course.discount)).toFixed(2)} EGP                </span>
              )}
            </>
          )}
        </div>

        {course.badge && <div className="badge">{course.badge}</div>}
      </div>
    </div>
  );
};

const Home2 = () => {
  const [selected, setSelected] = useState(1);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Courses"));
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Courses data:", coursesData); // هنا 👈
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <section className="courses-section">
        <h2 className="section-title">Learners are viewing</h2>
        <div className="courses-container">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="focus-section">
        <h2 className="section-title">Learning focused on your goals</h2>
        <div className="focus-grid">
          <div className="left-options">
            {leftCards.map((card) => (
              <div
                key={card.id}
                className={`option-card ${
                  selected === card.id ? "active" : ""
                }`}
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
    </>
  );
};

export default Home2;
