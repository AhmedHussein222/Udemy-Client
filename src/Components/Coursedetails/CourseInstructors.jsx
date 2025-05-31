import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Divider,
  CircularProgress,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ReviewsIcon from '@mui/icons-material/Reviews';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PeopleIcon from '@mui/icons-material/People';
import { db, doc, getDoc, collection, query, where, getDocs } from '../../Firebase/firebase';
import { Link } from 'react-router-dom';

const ReviewCard = ({ review, courseTitle }) => {
  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      console.log('Invalid timestamp:', isoString);
      return 'Unknown date';
    }
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 1,
        p: 2,
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'grey.300',
            color: 'grey.700',
            fontWeight: 'bold',
            mr: 1.5,
          }}
        >
          {review.name ? review.name.charAt(0) : 'A'}
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {review.name || 'Anonymous'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Course: {courseTitle || 'Unknown Course'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              value={review.rating || 0}
              readOnly
              size="small"
              sx={{
                mr: 1,
                '& .MuiRating-iconFilled': { color: '#b4690e' },
                '& .MuiRating-iconEmpty': { color: 'grey.300' },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {formatDate(review.timestamp)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="body2">{review.comment || 'No comment provided'}</Typography>
    </Box>
  );
};

const InstructorCard = ({ instructor, instructorId }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
        {instructor.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {instructor.title || 'Instructor'}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Link to={`/instructor/${instructorId}`} style={{ textDecoration: 'none' }}>
            <Avatar
              src={instructor.image}
              alt={instructor.name}
              sx={{
                width: 80,
                height: 80,
                '&:hover': { cursor: 'pointer', opacity: 0.8 },
              }}
            />
          </Link>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 1,
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <StarIcon sx={{ fontSize: 16, color: '#b4690e', mr: 0.5 }} />
              <Typography variant="body2">
                {instructor.rating ? `${instructor.rating} Instructor Rating` : 'No rating available'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <ReviewsIcon sx={{ fontSize: 16, color: 'grey.600', mr: 0.5 }} />
              <Typography variant="body2">
                {instructor.reviews ? instructor.reviews.toLocaleString() : 0} Reviews
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <VideoLibraryIcon sx={{ fontSize: 16, color: 'grey.600', mr: 0.5 }} />
              <Typography variant="body2">
                {instructor.totalCourses || 0} Courses
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 16, color: 'grey.600', mr: 0.5 }} />
              <Typography variant="body2">
                {instructor.totalStudents ? instructor.totalStudents.toLocaleString() : 0} Students
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mb: 1 }}>
            {instructor.bio || 'No bio available'}
          </Typography>
          {instructor.additionalInfo && (
            <Typography variant="body2">
              {instructor.additionalInfo}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const CourseInstructors = ({ course }) => {
  const [instructor, setInstructor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (!course?.instructor_id) {
        setError('No instructor assigned');
        setLoading(false);
        return;
      }

      try {
        // Fetch instructor data from Users
        const instructorRef = doc(db, 'Users', course.instructor_id);
        const instructorSnap = await getDoc(instructorRef);

        if (!instructorSnap.exists()) {
          setError('Instructor not found');
          setLoading(false);
          return;
        }

        const instructorData = instructorSnap.data();

        // Fetch number of courses
        const coursesQuery = query(
          collection(db, 'Courses'),
          where('instructor_id', '==', course.instructor_id)
        );
        const coursesSnap = await getDocs(coursesQuery);
        const totalCourses = coursesSnap.size;

        // Fetch total students and reviews for all courses
        let totalStudents = 0;
        let allReviews = [];

        for (const courseDoc of coursesSnap.docs) {
          const courseId = courseDoc.id;
          const courseTitle = courseDoc.data().title || 'Unknown Course';

          // Fetch number of students from Enrollments
          const enrollmentsQuery = query(
            collection(db, 'Enrollments'),
            where('course_id', '==', courseId)
          );
          const enrollmentsSnap = await getDocs(enrollmentsQuery);
          totalStudents += enrollmentsSnap.size;

          // Fetch reviews from Reviews
          const reviewsQuery = query(
            collection(db, 'Reviews'),
            where('course_id', '==', courseId)
          );
          const reviewsSnap = await getDocs(reviewsQuery);

          // Fetch user data for each review
          const courseReviews = await Promise.all(
            reviewsSnap.docs.map(async (reviewDoc) => {
              const reviewData = reviewDoc.data();
              let userName = 'Anonymous';

              // Fetch user name from Users
              if (reviewData.user_id) {
                const userRef = doc(db, 'Users', reviewData.user_id);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  const userData = userSnap.data();
                  userName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Anonymous';
                }
              }

              return {
                reviewId: reviewDoc.id,
                name: userName,
                comment: reviewData.comment || 'No comment provided',
                rating: reviewData.rating || 0,
                timestamp: reviewData.timestamp || new Date().toISOString(),
                courseTitle,
              };
            })
          );

          allReviews = [...allReviews, ...courseReviews];
        }

        // Calculate average rating from reviews
        const totalRatings = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = allReviews.length > 0 ? (totalRatings / allReviews.length).toFixed(1) : null;

        // Construct instructor object
        setInstructor({
          name: `${instructorData.first_name || ''} ${instructorData.last_name || ''}`.trim() || 'Unknown Instructor',
          title: instructorData.title || 'Instructor',
          image: instructorData.profile_picture || '',
          rating: averageRating,
          reviews: allReviews.length,
          totalCourses,
          totalStudents,
          bio: instructorData.bio || 'No bio available',
          id: course.instructor_id,
        });

        setReviews(allReviews);
      } catch (err) {
        console.error('Error fetching instructor data:', err);
        setError('Failed to load instructor data');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [course]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
        <CircularProgress sx={{ color: '#1976d2' }} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!instructor) {
    return <Typography>No instructor data available</Typography>;
  }

  return (
    <Box id="instructor" sx={{ mb: 4, width: '100%' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Instructor
      </Typography>
      <InstructorCard instructor={instructor} instructorId={instructor.id} />
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Instructor Reviews
      </Typography>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard key={review.reviewId} review={review} courseTitle={review.courseTitle} />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No reviews available for this instructor's courses.
        </Typography>
      )}
    </Box>
  );
};

export default CourseInstructors;