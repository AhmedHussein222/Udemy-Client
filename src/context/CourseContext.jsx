import { createContext, useContext, useState } from "react";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: 0,
    instructor_id: "",
    category_id: "",
    subcategory_id: "",
    thumbnail: "",
    duration: 0,
    discount: 0,
    what_will_learn: [],
    requirements: [],
    language: "English",
    is_published: false,
    created_at: new Date().toISOString(),
  });

  const updateCourseData = (updates, component = null) => {
    setCourseData((prev) => {
      // Deep merge for nested updates
      const newData = { ...prev };

      if (component) {
        // Handle component-specific updates
        newData[component] = {
          ...(newData[component] || {}),
          ...updates,
        };
      } else {
        // Handle direct updates
        Object.entries(updates).forEach(([key, value]) => {
          if (typeof value === "object" && !Array.isArray(value)) {
            newData[key] = { ...(newData[key] || {}), ...value };
          } else {
            newData[key] = value;
          }
        });
      }

      return newData;
    });
  };

  const validateSection = (section) => {
    switch (section) {
      case "landing_page":
        return !!(courseData.description && courseData.thumbnail);
      case "curriculum":
        return (
          Array.isArray(courseData.curriculum) &&
          courseData.curriculum.length > 0
        );
      // Add more validation cases
      default:
        return true;
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courseData,
        updateCourseData,
        validateSection,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourseContext = () => useContext(CourseContext);
