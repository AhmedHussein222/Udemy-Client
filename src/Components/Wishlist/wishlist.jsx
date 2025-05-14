import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Rating,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react';
import { grey } from '@mui/material/colors';

function Wishlist() {
  
  const courses = [
    {
      title: 'The Web Developer Bootcamp',
      instructor: 'Colt Steele',
      hours: '74 total hours',
      price: 'E£1,699.99',
      image: 'https://img-c.udemycdn.com/course/240x135/625204_436a_3.jpg',
    },
    {
      title: 'The Web Developer Bootcamp',
      instructor: 'Colt Steele',
      hours: '74 total hours',
      price: 'E£1,699.99',
      image: 'https://img-c.udemycdn.com/course/240x135/625204_436a_3.jpg',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ maxWidth: 345, position: 'relative' }}>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'red',
                  zIndex: 1,
                }}
              >
                <FavoriteIcon />
              </IconButton>

              <CardMedia
                component="img"
                height="140"
                image={course.image}
                alt={course.title}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  fontWeight="bold"
                >
                  {course.title}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {course.instructor}
                </Typography>
                <Rating
                  name={`rating-${index}`}
                  defaultValue={2}
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue);
                  }}
                />
                <Typography gutterBottom variant="subtitle2" component="div">
                  {course.hours}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  component="div"
                  color={grey[900]}
                  fontWeight="bold"
                >
                  {course.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Wishlist;
