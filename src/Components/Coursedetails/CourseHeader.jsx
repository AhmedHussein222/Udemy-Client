import React from 'react';
import { Box, Typography, Chip, Rating, Link, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import SubtitlesIcon from '@mui/icons-material/Subtitles';

const CourseHeader = ({ course }) => {
 
  if (!course) {
    return (
      <Box sx={{ bgcolor: '#1c1d1f', color: 'white', py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#1c1d1f', color: 'white', py: 8 }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box sx={{ width: { lg: '66.67%' } }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' }, color: 'white' }}
          >
            {course.title}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
            {course.description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Chip
              label="BESTSELLER"
              sx={{
                bgcolor: '#f69c08',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                px: 0.5,
                py: 0.25,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold', color: '#f69c08', mr: 0.5 }}>
                {course.rating?.rate }
              </Typography>
              <Rating
                value={course.rating?.rate}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  color: '#f69c08',
                  '& .MuiRating-iconEmpty': { color: 'grey.400' },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'grey.300' }}>
              ({course.rating?.count ? course.rating.count.toLocaleString() : '0'} ratings)
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300' }}>
              ({course.studentCount ? course.studentCount.toLocaleString() : '0'} students)
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Created by{' '}
            {course.instructors?.length > 0 ? (
              course.instructors.map((instructor, i) => (
                <Link
                  key={i}
                  // href="#instructor"
                  underline="always"
                  sx={{ fontWeight: 'bold', color: 'white' }}
                >
                  {instructor}
                  {i < course.instructors.length - 1 ? ', ' : ''}
                </Link>
              ))
            ) : (
              'Unknown instructor'
            )}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: 'grey.300' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2">
                Last updated {course.created_at || 'Unknown'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LanguageIcon fontSize="small" />
              <Typography variant="body2">{course.language || 'Unknown'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SubtitlesIcon fontSize="small" />
              <Typography variant="body2">
                {course.subtitles?.length > 0 ? course.subtitles.join(', ') : 'None'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseHeader;