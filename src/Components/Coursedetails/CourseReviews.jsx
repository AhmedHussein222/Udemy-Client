import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  LinearProgress,
  Avatar,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { db, collection, query, where, getDocs, doc, getDoc } from '../../Firebase/firebase';

const RatingBar = ({ stars, percentage }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: 48 }}>
        <Typography variant="body2" sx={{ mr: 0.5 }}>
          {stars}
        </Typography>
        <StarIcon sx={{ fontSize: 14 }} />
      </Box>
      <Box sx={{ flexGrow: 1, mx: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': { bgcolor: '#b4690e', borderRadius: 4 },
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ width: 32 }}>
        {percentage}%
      </Typography>
    </Box>
  );
};

const ReviewCard = ({ review }) => {
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

const CourseReviews = ({ course }) => {
  const [reviews, setReviews] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!course?.id) {
        setError('No course ID provided');
        setLoading(false);
        return;
      }

      try {
        // جلب الـ reviews من Reviews collection
        const reviewsQuery = query(
          collection(db, 'Reviews'),
          where('course_id', '==', course.id)
        );
        const reviewsSnap = await getDocs(reviewsQuery);

        // جلب بيانات المستخدم وتنسيق الـ reviews
        const reviewsData = await Promise.all(
          reviewsSnap.docs.map(async (reviewDoc) => {
            const reviewData = reviewDoc.data();
            let userName = 'Anonymous';

            // جلب اسم المستخدم من Users
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
            };
          })
        );

        // حساب متوسط الـ rating
        const totalRatings = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = reviewsData.length > 0 ? (totalRatings / reviewsData.length).toFixed(1) : 0;

        // حساب توزيع الـ ratings لـ RatingBar
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewsData.forEach((review) => {
          if (review.rating >= 1 && review.rating <= 5) {
            ratingCounts[Math.round(review.rating)]++;
          }
        });

        const totalReviews = reviewsData.length;
        const ratingPercentages = [
          { stars: 5, percentage: totalReviews > 0 ? Math.round((ratingCounts[5] / totalReviews) * 100) : 0 },
          { stars: 4, percentage: totalReviews > 0 ? Math.round((ratingCounts[4] / totalReviews) * 100) : 0 },
          { stars: 3, percentage: totalReviews > 0 ? Math.round((ratingCounts[3] / totalReviews) * 100) : 0 },
          { stars: 2, percentage: totalReviews > 0 ? Math.round((ratingCounts[2] / totalReviews) * 100) : 0 },
          { stars: 1, percentage: totalReviews > 0 ? Math.round((ratingCounts[1] / totalReviews) * 100) : 0 },
        ];

        setReviews(reviewsData);
        setRatingData(ratingPercentages);
        setAverageRating(parseFloat(avgRating));
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
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

  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Student Feedback
      </Typography>

      {reviews.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mb: 4,
            bgcolor: 'grey.50',
            p: 3,
            border: 1,
            borderColor: 'grey.200',
            borderRadius: 1,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ color: '#b4690e', mb: 0.5 }}
            >
              {averageRating || '0.0'}
            </Typography>
            <Rating
              value={averageRating || 0}
              precision={0.1}
              readOnly
              sx={{
                '& .MuiRating-iconFilled': { color: '#b4690e' },
                '& .MuiRating-iconEmpty': { color: 'grey.300' },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Course Rating
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            {ratingData.map((item) => (
              <RatingBar key={item.stars} stars={item.stars} percentage={item.percentage} />
            ))}
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          No reviews available for this course.
        </Typography>
      )}

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Reviews
      </Typography>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No reviews available.
        </Typography>
      )}

      {reviews.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            color="inherit"
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              borderColor: 'grey.800',
              color: 'grey.800',
              '&:hover': {
                bgcolor: 'grey.50',
                borderColor: 'grey.800',
              },
            }}
          >
            See all reviews
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CourseReviews;