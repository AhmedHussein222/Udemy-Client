/** @format */

import { createContext, useContext, useState, useEffect } from "react";
import {doc,getDoc,collection,query,where,getDocs,} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { UserContext } from "./UserContext";

export const EnrolledCoursesContext = createContext();

export const EnrolledCoursesProvider = ({ children }) => {
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useContext(UserContext);

	useEffect(() => {
		const fetchEnrolledCourses = async () => {
			if (!user) {
				setEnrolledCourses([]);
				setLoading(false);
				return;
			}
			try {
				const enrolledRef = doc(db, "Enrollments", user.uid);
				const enrolledDoc = await getDoc(enrolledRef);

				if (!enrolledDoc.exists()) {
					setEnrolledCourses([]);
					setLoading(false);
					return;
				}

				const enrolledData = enrolledDoc.data();
				const courses = enrolledData.courses || [];

				// Fetch course details and instructor details for each course
				const enrichedCourses = await Promise.all(
					courses
						.filter((course) => course && (course.id || course.course_id))
						.map(async (course) => {
							const courseId = course.id || course.course_id;

							// Get course data
							const courseRef = doc(db, "Courses", courseId);
							const courseDoc = await getDoc(courseRef);
							const courseData = courseDoc.exists() ? courseDoc.data() : {};

							// Get instructor details using instructor_id from course data
							let instructorData = {};
							try {
								if (courseData.instructor_id) {
									const instructorRef = doc(
										db,
										"Users",
										courseData.instructor_id
									);
									const instructorDoc = await getDoc(instructorRef);
									if (instructorDoc.exists()) {
										instructorData = instructorDoc.data();
									}
								}
							} catch (error) {
								console.error("Error fetching instructor:", error);
							}

							// Get lessons details
							let totalLectures = 0;
							let totalHours = 0;
							try {
								const lessonsRef = collection(db, "Lessons");
								const lessonsQuery = query(
									lessonsRef,
									where("course_id", "==", courseId)
								);
								const lessonsSnapshot = await getDocs(lessonsQuery);

								totalLectures = lessonsSnapshot.size;
								totalHours =
									lessonsSnapshot.docs.reduce((acc, doc) => {
										return acc + (doc.data().duration || 0);
									}, 0) / 60; // Convert minutes to hours
							} catch (error) {
								console.error(
									`Error fetching lessons for course ${courseId}:`,
									error
								);
							}

							return {
								...course,
								...courseData,
								enrolledDate: enrolledData.timestamp,
								instructor: {
									firstName: instructorData.first_name || "",
									lastName: instructorData.last_name || "",
									fullName:
										instructorData.first_name && instructorData.last_name
											? `${instructorData.first_name} ${instructorData.last_name}`
											: "Unknown Instructor",
								},
								courseDetails: {
									totalLectures,
									totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal place
								},
							};
						})
				);

				setEnrolledCourses(enrichedCourses);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching enrolled courses:", error);
				setLoading(false);
			}
		};

		fetchEnrolledCourses();
	}, [user]);

	return (
		<EnrolledCoursesContext.Provider value={{ enrolledCourses, loading }}>
			{children}
		</EnrolledCoursesContext.Provider>
	);
};

export const useEnrolledCourses = () => {
	const context = useContext(EnrolledCoursesContext);
	if (!context) {
		throw new Error("useEnrolledCourses must be used within an EnrolledCoursesProvider");
	}
	return context;
};
