import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const WhatYoullLearn = ({ course }) => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 1,
        p: 3,
        mb: 4,
        width: '100%',
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        What you'll learn
      </Typography>
      {course?.what_will_learn?.length > 0 ? (
        <Grid container spacing={2} columns={{ xs: 1, md: 2 }}>
          {course.what_will_learn.map((point, index) => (
            <Grid item xs={1} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  py: 1,
                }}
              >
                <CheckIcon
                  sx={{
                    fontSize: 18,
                    color: 'grey.700',
                    mt: 0.5,
                    mr: 1.5,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.5,
                  }}
                >
                  {point}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No learning objectives available
        </Typography>
      )}
    </Box>
  );
};

export default WhatYoullLearn;