import React, { useState } from "react";
import "./Home2.css";
import C1 from '../../assets/DevCourses/C1.webp'
import C2 from '../../assets/DevCourses/C2.webp'
import C3 from '../../assets/DevCourses/C3.webp'
import C4 from '../../assets/DevCourses/C4.jpg'
import C5 from '../../assets/DevCourses/C5.webp'
import { ArrowForwardIos } from '@mui/icons-material';
import logo1 from '../../assets/hands.webp'
import logo2 from '../../assets/certificate.webp'
import logo3 from '../../assets/empty.webp'
import logo4 from '../../assets/organizations.webp'

const courses = [
  {
    id: 1,
    image: C1,
    title: "Web Development Bootcamp",
    description: "Learn web development from scratch.",
    rating: 4.5,
    students: 1200,
    price: "€49.99",
    oldPrice: "€99.99",
  },
  {
    id: 2,
    image: C2,
    title: "Python for Data Science",
    description: "Master Python and data science.",
    rating: 4.7,
    students: 1500,
    price: "€39.99",
    oldPrice: "€79.99",
  },
  {
    id: 3,
    image: C3,
    title: "Python for Data Science",
    description: "Master Python and data science.",
    rating: 4.7,
    students: 1500,
    price: "€39.99",
    oldPrice: "€79.99",
  },
  {
    id: 4,
    image: C4,
    title: "Python for Data Science",
    description: "Master Python and data science.",
    rating: 4.7,
    students: 1500,
    price: "€39.99",
    oldPrice: "€79.99",
  },
  {
    id: 5,
    image: C5,
    title: "Python for Data Science",
    description: "Master Python and data science.",
    rating: 4.7,
    students: 1500,
    price: "€39.99",
    oldPrice: "€79.99",
  },
];

const leftCards = [
  {
    id: 1,
    img: logo1,
    title: "Hands-on training",
    description: "Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.",
  },
  {
    id: 2,
    img:logo2,
    title: "Expert-led content",
    description: "Learn from industry professionals with real-world experience.",
  },
  {
    id: 3,
    img: logo3,
    title: "Interactive learning",
    description: "Engage with content that adapts to your pace and style.",
  },
  {
    id: 4,
    img: logo4,
    title: "Certification programs",
    description: "Earn credentials that boost your career prospects.",
  },
];

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} className="course-image" />
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="rating">
        <span>{course.rating}</span>
        <span className="stars">{"★".repeat(Math.round(course.rating)) + "☆".repeat(5 - Math.round(course.rating))}</span>
        <span>({course.students} learners)</span>
      </div>
      <div className="pricing">
        <span className="price">{course.price}</span>
        <span className="old-price">{course.oldPrice}</span>
      </div>
    </div>
  );
};

const Home2 = () => {
  const [selected, setSelected] = useState(1);

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
            <img src={leftCards.find((c) => c.id === selected)?.img} alt="Preview" className="preview-img" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home2;
