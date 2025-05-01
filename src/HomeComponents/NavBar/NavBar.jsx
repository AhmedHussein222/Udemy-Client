import React, { useState } from "react";
import "./Navbar.css";
import { Typography, Box } from "@mui/material";
//DevImg
import corse1 from '../../assets/DevCourses/course1.webp'
import corse2 from '../../assets/DevCourses/Bootcamp.jpg'
import corse3 from '../../assets/DevCourses/Masterclass.jpg'
import corse4 from '../../assets/DevCourses/DevCo.webp'
import Js1 from '../../assets/DevCourses/compJS.webp'
import Js2 from '../../assets/DevCourses/Js2.jpg'


const Navbar = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardsData, setCardsData] = useState([]);

  const handleTabClick = (tab) => {
    setSelectedTab((prev) => (prev === tab ? null : tab));
    setSelectedSubItem(null);
    setCardsData([]);
  };

  const handleSubItemClick = (title) => {
    setSelectedSubItem(title);
    setLoading(true);
  
    setTimeout(() => {
      const selectedCourses = coursesData[title] || [];
      setCardsData(selectedCourses);
      setLoading(false);
    }, 1000);
  };
  
  const tabs = [
    "Web Development",
    "Communication",
    "Business Analytics & Intelligence",
  ];

  const subsections = {
    "Web Development": [
      { title: "Web Development", desc: "14.4M+ learners" },
      { title: "JavaScript", desc: "17.7M+ learners" },
      { title: "React JS", desc: "8M+ learners" },
      { title: "Angular", desc: "4M+ learners" },
      { title: "Java", desc: "16.6M+ learners" },
      { title: "Android Development", desc: "8M+ learners" },
      { title: "iOS Development", desc: "4M+ learners" },
      { title: "CSS", desc: "9M+ learners" },
    ],
    Communication: [
      { title: "Communication Skills", desc: "2M+ learners" },
      { title: "Presentation Skills", desc: "2M+ learners" },
      { title: "Public Speaking", desc: "3M+ learners" },
      { title: "Writing", desc: "1M+ learners" },
      { title: "PowerPoint", desc: "2M+ learners" },
      { title: "Business Communication", desc: "422.900+ learners" },
      { title: "Business Writing", desc: "289.900+ learners" },
      { title: "Email Writing and Etiquette", desc: "386.900+ learners" },
    ],
    "Business Analytics & Intelligence": [
      { title: "Microsoft Excel", desc: "18.8M+ learners" },
      { title: "SQL", desc: "14.4M+ learners" },
      { title: "Microsoft Power BI", desc: "8M+ learners" },
      { title: "Data Analysis", desc: "4M+ learners" },
      { title: "Business Analysis", desc: "4M+ learners" },
      { title: "Taleau", desc: "1M+ learners" },
      { title: "Data Visualization", desc: "1M+ learners" },
      { title: "Data Modeling", desc: "591.100+ learners" },
    ],
  };
  
  //data subsections
  const coursesData = {
    "Web Development": [
      {
        title: "The Complete Full-Stack Web Development Bootcamp",
        desc: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps",
        image: corse1,
        rating: 4.7,
        learners: "435.028",
        price: 349.99,
        oldPrice: "1,799.99",
      },
      {
        title: "The Web Developer Bootcamp 2025",
        desc: "With 10 Hours of React added. Become a Developer With ONE course - HTML, CSS, JavaScript, React, Node, MongoDB and More!",
        image: corse2,
        rating: 4.7,
        learners: "280,362",
        price: 200.99,
        oldPrice: "1,699.99",
      },
      {
        title: "Web Development Masterclass - Online Certification Course",
        desc: "Cloud Computing | Web Apps | Linux | Web Servers | DBMS | LAMP Stack | HTML | CSS | JavaScript | PHP | + More",
        image: corse3,
        rating: 4.6,
        learners: "10,147",
        price: "1,089.99",
      },
      {
        title: "The Complete Web Developer Course 3.0",
        desc: "Learn Web Development in 2024! Build apps, website, projects using HTML, CSS, Javascript, PHP, Python, MySQL & more!",
        image: corse4,
        rating: 4.3,
        learners: "72,472",
        price: "2,289.99",
      },
    ],
    "JavaScript": [
      {
        title: "The Complete JavaScript Course 2025: From Zero to Expert!",
        desc: "The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory. Many courses in one!",
        image: Js1,
        rating: 4.7,
        learners: "222,555",
        price: 599.99,
        oldPrice: "3,099.99",
      },
      {
        title: "JavaScript for Beginners - The Complete introduction to JS",
        desc: "Deep dive into JS",
        image: Js2,
        rating: 4.3,
        learners: "2,600",
        price: 599.99,
      },
      {
        title: "JavaScript for Beginners - The Complete introduction to JS",
        desc: "Deep dive into JS",
        image: Js1,
        rating: 4.8,
        learners: "1.1M",
        price: 16.99,
        oldPrice: 89.99,
      },
      {
        title: "JavaScript for Beginners - The Complete introduction to JS",
        desc: "Deep dive into JS",
        image: Js2,
        rating: 4.8,
        learners: "1.1M",
        price: 16.99,
        oldPrice: 89.99,
      },
    ],
    "React JS": [
      {
        title: "React Fundamentals",
        desc: "Build your first UI",
        image: corse1,
        rating: 4.7,
        learners: "1.9M",
        price: 14.99,
        oldPrice: 84.99,
      },
      {
        title: "React with Redux",
        desc: "Manage state effectively",
        image: corse2,
        rating: 4.5,
        learners: "980K",
        price: 12.99,
        oldPrice: 59.99,
      },
    ],
    "Java": [
      {
        title: "Angular Crash Course",
        desc: "Quick start guide",
        image: corse3,
        rating: 4.4,
        learners: "1.3M",
        price: 11.99,
        oldPrice: 69.99,
      },
      {
        title: "Angular for Pros",
        desc: "Take your skills further",
        image: corse4,
        rating: 4.6,
        learners: "730K",
        price: 15.99,
        oldPrice: 79.99,
      },
    ],
    "Angular": [
      {
        title: "Angular Crash Course",
        desc: "Quick start guide",
        image: "https://via.placeholder.com/250x150",
        rating: 4.4,
        learners: "1.3M",
        price: 11.99,
        oldPrice: 69.99,
      },
      {
        title: "Angular for Pros",
        desc: "Take your skills further",
        image: "https://via.placeholder.com/250x150",
        rating: 4.6,
        learners: "730K",
        price: 15.99,
        oldPrice: 79.99,
      },
    ],
    "Angular": [
      {
        title: "Angular Crash Course",
        desc: "Quick start guide",
        image: "https://via.placeholder.com/250x150",
        rating: 4.4,
        learners: "1.3M",
        price: 11.99,
        oldPrice: 69.99,
      },
      {
        title: "Angular for Pros",
        desc: "Take your skills further",
        image: "https://via.placeholder.com/250x150",
        rating: 4.6,
        learners: "730K",
        price: 15.99,
        oldPrice: 79.99,
      },
    ],
  };
  

  return (
    <>
      <div className="navbar-container">
        <ul className="navbar">
          {tabs.map((tab) => (
            <li
              key={tab}
              className={`nav-item ${selectedTab === tab ? "selected" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      {selectedTab && (
        <div className="subsection">
          {subsections[selectedTab].map((item, index) => (
            <div
              key={index}
              className={`sub-item ${
                selectedSubItem === item.title ? "active" : ""
              }`}
              onClick={() => handleSubItemClick(item.title)}
            >
              <Typography variant="h4">{item.title}</Typography>
              <Typography variant="body1">{item.desc}</Typography>
            </div>
          ))}
        </div>
      )}
      {selectedSubItem && (
        <div className="cards-container">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </>
          ) : (
            cardsData.map((card, index) => (
              <div key={index} className="card">
                <img src={card.image} alt={card.title} className="card-image" />
            
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {card.title}
                </Typography>
            
                <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                  {card.desc}
                </Typography>
            
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    4.5
                  </Typography>
                  <Box sx={{ color: '#f5c518' }}>
                    {"★★★★☆"}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    (1.2M learners)
                  </Typography>
                </Box>
            
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    €14.99
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: 'line-through', color: '#888' }}
                  >
                    €79.99
                  </Typography>
                </Box>
              </div>
            )) 
          )}
            
        </div>
      )}
      <Box sx={{ display: "flex", justifyContent: "left", mt: 5 }}>
        <button
          style={{
            border: "1px solid #5624d0",
            color: "#5624d0",
            backgroundColor: "#fff",
            padding: "15px 20px",
            marginLeft: "10px",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Show All {selectedTab} courses
        </button>
      </Box>
    </>
  );
};

export default Navbar;


// import React, { useState } from "react";
// import "./Navbar.css";
// import { Typography, Box } from "@mui/material";
// const Navbar = () => {
//   const [selectedTab, setSelectedTab] = useState(null);
//   const [selectedSubItem, setSelectedSubItem] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [cardsData, setCardsData] = useState([]);

//   const handleTabClick = (tab) => {
//     setSelectedTab((prev) => (prev === tab ? null : tab));
//     setSelectedSubItem(null);
//     setCardsData([]);
//   };

//   const handleSubItemClick = (title) => {
//     setSelectedSubItem(title);
//     setLoading(true);
    
//     fetch(`https://api.example.com/courses?category=${title}`)
//       .then(response => response.json())
//       .then(data => {
//         setCardsData(data.courses); 
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       });
//   };

//   const tabs = [
//     "Web Development",
//     "Communication",
//     "Business Analytics & Intelligence",
//   ];

//   const subsections = {
//     "Web Development": [
//       { title: "Web Development", desc: "14.4M+ learners" },
//       { title: "JavaScript", desc: "17.7M+ learners" },
//       { title: "React JS", desc: "8M+ learners" },
//       { title: "Angular", desc: "4M+ learners" },
//       { title: "Java", desc: "16.6M+ learners" },
//       { title: "Android Development", desc: "8M+ learners" },
//       { title: "iOS Development", desc: "4M+ learners" },
//       { title: "CSS", desc: "9M+ learners" },
//     ],
//     Communication: [
//       { title: "Communication Skills", desc: "2M+ learners" },
//       { title: "Presentation Skills", desc: "2M+ learners" },
//       { title: "Public Speaking", desc: "3M+ learners" },
//       { title: "Writing", desc: "1M+ learners" },
//       { title: "PowerPoint", desc: "2M+ learners" },
//       { title: "Business Communication", desc: "422.900+ learners" },
//       { title: "Business Writing", desc: "289.900+ learners" },
//       { title: "Email Writing and Etiquette", desc: "386.900+ learners" },
//     ],
//     "Business Analytics & Intelligence": [
//       { title: "Microsoft Excel", desc: "18.8M+ learners" },
//       { title: "SQL", desc: "14.4M+ learners" },
//       { title: "Microsoft Power BI", desc: "8M+ learners" },
//       { title: "Data Analysis", desc: "4M+ learners" },
//       { title: "Business Analysis", desc: "4M+ learners" },
//       { title: "Taleau", desc: "1M+ learners" },
//       { title: "Data Visualization", desc: "1M+ learners" },
//       { title: "Data Modeling", desc: "591.100+ learners" },
//     ],
//   };

//   return (
//     <>
//       <div className="navbar-container">
//         <ul className="navbar">
//           {tabs.map((tab) => (
//             <li
//               key={tab}
//               className={`nav-item ${selectedTab === tab ? "selected" : ""}`}
//               onClick={() => handleTabClick(tab)}
//             >
//               {tab}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {selectedTab && (
//         <div className="subsection">
//           {subsections[selectedTab].map((item, index) => (
//             <div
//               key={index}
//               className={`sub-item ${
//                 selectedSubItem === item.title ? "active" : ""
//               }`}
//               onClick={() => handleSubItemClick(item.title)}
//             >
//               <Typography variant="h4">{item.title}</Typography>
//               <Typography variant="body1">{item.desc}</Typography>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="bigConainer">
//         {selectedSubItem && (
//           <div className="cards-container">
//             {loading ? (
//               <>
//                 {[...Array(4)].map((_, i) => (
//                   <div key={i} className="skeleton-card" />
//                 ))}
//               </>
//             ) : (
//               cardsData.map((card, index) => (
//                 <div key={index} className="card">
//                   <img src={card.image} alt={card.title} className="card-image" />
//                   <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
//                     {card.title}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
//                     {card.desc}
//                   </Typography>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                       {card.rating}
//                     </Typography>
//                     <Box sx={{ color: '#f5c518' }}>
//                       {"★★★★☆"}
//                     </Box>
//                     <Typography variant="body2" sx={{ color: '#757575' }}>
//                       ({card.learners} learners)
//                     </Typography>
//                   </Box>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//                       €{card.price}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ textDecoration: 'line-through', color: '#888' }}
//                     >
//                       €{card.oldPrice}
//                     </Typography>
//                   </Box>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Navbar;