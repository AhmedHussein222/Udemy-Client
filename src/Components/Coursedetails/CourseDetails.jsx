/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
	db,
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
} from "../../Firebase/firebase";
import CourseHeader from "./CourseHeader";
import CourseSidebar from "./CourseSidebar";
import WhatYoullLearn from "./WhatYoullLearn";
import CourseContent from "./CourseContent";
import CourseRequirements from "./CourseRequirments";
import CourseDescription from "./CourseDescritption";
import CourseInstructors from "./CourseInstructors";
import CourseReviews from "./CourseReviews";

const CourseDetails = () => {
	const { id } = useParams();
	const [courseData, setCourseData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const docRef = doc(db, "Courses", id);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const courseData = { id: docSnap.id, ...docSnap.data() };

					if (courseData.instructor_id) {
						const instructorRef = doc(db, "Users", courseData.instructor_id);
						const instructorSnap = await getDoc(instructorRef);
						if (instructorSnap.exists()) {
							const instructorData = instructorSnap.data();
							const fullName = `${instructorData.first_name || ""} ${
								instructorData.last_name || ""
							}`.trim();
							courseData.instructors = [fullName || "Unknown instructor"];
							courseData.instructor_name = fullName || "Unknown instructor";
						} else {
							courseData.instructors = ["Unknown instructor"];
							courseData.instructor_name = "Unknown instructor";
						}
					} else {
						courseData.instructors = ["No instructor assigned"];
						courseData.instructor_name = "No instructor assigned";
					}

					const enrollmentsQuery = query(
						collection(db, "Enrollments"),
						where("course_id", "==", id)
					);
					const enrollmentsSnap = await getDocs(enrollmentsQuery);
					courseData.studentCount = enrollmentsSnap.size;

					setCourseData(courseData);
				} else {
					setError("Course not found");
				}
			} catch (err) {
				console.error("Error fetching course:", err);
				setError("Something went wrong");
			} finally {
				setLoading(false);
			}
		};

		fetchCourse();
	}, [id]);

	if (loading) {
		return (
			<Box sx={{ p: 4, textAlign: "center" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

	if (!courseData) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography>No course data available</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
			<CourseHeader course={courseData} />
			<Box
				sx={{
					maxWidth: "1280px",
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
					py: 4,
				}}>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", lg: "row" },
						gap: 4,
						alignItems: "flex-start",
					}}>
					{/* Main Content */}
					<Box sx={{ flex: 1 }}>
						<WhatYoullLearn course={courseData} />
						<CourseContent course={courseData} />
						<CourseRequirements course={courseData} />
						<CourseDescription course={courseData} />
						<CourseInstructors course={courseData} />
						<CourseReviews course={courseData} />
					</Box>

					{/* Sticky Sidebar */}
					<Box
						sx={{
							width: "350px",
							flexShrink: 0,
							display: { xs: "none", lg: "block" },
							position: "sticky",
							top: 32,
							alignSelf: "flex-start",
						}}>
						<CourseSidebar course={courseData} />
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default CourseDetails;
