import React, { useState } from 'react';
import './Navbar.css';
import { Typography , Box} from '@mui/material';

const Navbar = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState(null);


  const handleTabClick = (tab) => {
    setSelectedTab(prev => (prev === tab ? null : tab));
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
      { title: "CSS", desc: "9M+ learners" }
    ],
    "Communication": [
      { title: "Communication Skills", desc: "2M+ learners" },
      { title: "Presentation Skills", desc: "2M+ learners" },
      { title: "Public Speaking", desc: "3M+ learners" },
      { title: "Writing", desc: "1M+ learners" },
      { title: "PowerPoint", desc: "2M+ learners" },
      { title: "Business Communication", desc: "422.900+ learners" },
      { title: "Business Writing", desc: "289.900+ learners" },
      { title: "Email Writing and Etiquette", desc: "386.900+ learners" }
    ],
    "Business Analytics & Intelligence": [
      { title: "Microsoft Excel", desc: "18.8M+ learners" },
      { title: "SQL", desc: "14.4M+ learners" },
      { title: "Microsoft Power BI", desc: "8M+ learners" },
      { title: "Data Analysis", desc: "4M+ learners" },
      { title: "Business Analysis", desc: "4M+ learners" },
      { title: "Taleau", desc: "1M+ learners" },
      { title: "Data Visualization", desc: "1M+ learners" },
      { title: "Data Modeling", desc: "591.100+ learners" }
    ]
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
        className={`sub-item ${selectedSubItem === item.title ? 'active' : ''}`}
        onClick={() => setSelectedSubItem(item.title)}
      >
        <Typography variant='h4'>{item.title}</Typography>
        <Typography variant='body1'>{item.desc}</Typography>
      </div>
    ))}
  </div>
)}

<Box sx={{ display: "flex", justifyContent: "left", mt: 5 }}>
  <button style={{
    border: "1px solid #5624d0",
    color: "#5624d0",
    backgroundColor: "#fff",
    padding: "15px 20px",
    marginLeft: "70px",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  }}>
   Show All {selectedTab} courses
  </button>
  </Box>
    </>
  );
};

export default Navbar;
