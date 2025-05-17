import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ShareIcon from '@mui/icons-material/Share';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { db, doc, getDoc, collection, query, where, getDocs } from '../../Firebase/firebase';

const CourseSidebar = ({ course }) => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!course?.id) {
        setError('No course ID provided');
        setLoading(false);
        return;
      }

      try {
        // جلب بيانات الكورس من Courses
        const courseRef = doc(db, 'Courses', course.id);
        const courseSnap = await getDoc(courseRef);

        if (!courseSnap.exists()) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        const courseDocData = courseSnap.data();
        console.log('Course Data:', courseDocData);

        // جلب الفيديوهات من Lessons
        const lessonsQuery = query(
          collection(db, 'Lessons'),
          where('course_id', '==', course.id.toString())
        );
        const lessonsSnap = await getDocs(lessonsQuery);

        // حساب إجمالي الثواني
        let totalSeconds = 0;
        lessonsSnap.docs.forEach(doc => {
          const lessonData = doc.data();
          const duration = Number(lessonData.duration) || 0;
        
          totalSeconds += duration * 60; // تحويل الدقايق لثواني
        });

        

        // تحويل لساعات أو دقايق للعرض
        const totalHours = totalSeconds > 0 ? (totalSeconds / 3600).toFixed(1) : 0;
        let displayText;

        if (totalSeconds >= 3600) {
          // أكتر من ساعة، نعرض بالساعات
         
          displayText = `${totalHours} hours on-demand video`;
        } else if (totalSeconds > 0) {
          // أقل من ساعة، نعرض بالدقايق
         
          displayText = `${Math.round(totalSeconds / 60)} minutes on-demand video`;
        } else {
          // مافيش فيديوهات
        
          displayText = 'No video content';
        }

        console.log('Total Hours:', totalHours);
        console.log('Display Text:', displayText);

        // حساب السعر بعد الخصم
       const price = Number(courseDocData.price) || 0;
const discount = Number(courseDocData.discount) || 0;

        const discountedPrice = discount > 0 && price > 0 ? price * (1 - discount / 100) : null;

        setCourseData({
          price,
          discountedPrice,
          hoursOfContent: totalHours,
          displayText,
          articleCount: courseDocData.articleCount || 0,
          resourceCount: courseDocData.resourceCount || 0,
          thumbnail: courseDocData.thumbnail || 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        });
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course?.id]);

  // حساب نسبة الخصم
  const calculateDiscount = (price, discountedPrice) => {
    if (!price || !discountedPrice || discountedPrice >= price) return null;
    const discount = ((price - discountedPrice) / price) * 100;
    return Math.round(discount);
  };

  // حالة الـ loading
  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: 'white', border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
        <Typography>Loading course data...</Typography>
      </Box>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: 'white', border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // لو مافيش بيانات
  if (!courseData) {
    return (
      <Box sx={{ p: 3, bgcolor: 'white', border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
        <Typography>No course data available</Typography>
      </Box>
    );
  }

  const discountPercentage = calculateDiscount(courseData.price, courseData.discountedPrice);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 1,
        boxShadow: 3,
        bgcolor: 'white',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
        <Box
          component="img"
          src={courseData.thumbnail}
          alt="Course Preview"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'black',
            opacity: 0.2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover .play-button': { transform: 'scale(1.1)' },
          }}
        >
          <Box
            className="play-button"
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'white',
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderLeft: '16px solid black',
                borderBottom: '8px solid transparent',
                ml: '4px',
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
          {courseData.price === 0 ? (
            <Typography variant="h5" fontWeight="bold">
              Free
            </Typography>
          ) : (
            <>
              <Typography variant="h5" fontWeight="bold">
                ${courseData.discountedPrice ? courseData.discountedPrice.toFixed(2) : courseData.price.toFixed(2)}
              </Typography>
              {courseData.discountedPrice && courseData.discountedPrice < courseData.price && (
                <>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through', ml: 1 }}
                  >
                    ${courseData.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: '#ffe7e4',
                      color: '#6a2c2c',
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      ml: 1,
                    }}
                  >
                    {discountPercentage}% off
                  </Typography>
                </>
              )}
            </>
          )}
        </Box>

        {courseData.discountedPrice && courseData.discountedPrice < courseData.price && (
          <Typography
            variant="body2"
            color="error"
            fontWeight="medium"
            sx={{ mb: 2 }}
          >
            <span>2 days</span> left at this price!
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            bgcolor: '#a435f0',
            '&:hover': { bgcolor: '#8710d8' },
            fontWeight: 'bold',
            py: 1.5,
            mb: 1,
            textTransform: 'none',
          }}
          startIcon={<ShoppingCartIcon />}
        >
          Add to cart
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          sx={{
            borderColor: 'grey.800',
            color: 'grey.800',
            fontWeight: 'bold',
            py: 1.5,
            mb: 2,
            textTransform: 'none',
            '&:hover': { bgcolor: 'grey.50', borderColor: 'grey.800' },
          }}
        >
          Buy now
        </Button>

        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          30-Day Money-Back Guarantee
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            This course includes:
          </Typography>
          <List dense sx={{ py: 0 }}>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <VideoLibraryIcon sx={{ fontSize: 16, color: 'grey.600' }} />
              </ListItemIcon>
              <ListItemText
                primary={courseData.displayText}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <ArticleIcon sx={{ fontSize: 16, color: 'grey.600' }} />
              </ListItemIcon>
              <ListItemText
                primary={`${courseData.articleCount || 0} articles`}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <DownloadIcon sx={{ fontSize: 16, color: 'grey.600' }} />
              </ListItemIcon>
              <ListItemText
                primary={`${courseData.resourceCount || 0} downloadable resources`}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <SmartphoneIcon sx={{ fontSize: 16, color: 'grey.600' }} />
              </ListItemIcon>
              <ListItemText
                primary="Access on mobile and TV"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CardMembershipIcon sx={{ fontSize: 16, color: 'grey.600' }} />
              </ListItemIcon>
              <ListItemText
                primary="Certificate of completion"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="text"
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 'medium',
              color: '#5624d0',
              '&:hover': { color: '#401b9c' },
            }}
            startIcon={<ShareIcon sx={{ fontSize: 14 }} />}
          >
            Share
          </Button>
          <Button
            variant="text"
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 'medium',
              color: '#5624d0',
              '&:hover': { color: '#401b9c' },
            }}
            startIcon={<CardGiftcardIcon sx={{ fontSize: 14 }} />}
          >
            Gift
          </Button>
          <Button
            variant="text"
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 'medium',
              color: '#5624d0',
              '&:hover': { color: '#401b9c' },
            }}
            startIcon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
          >
            Coupon
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseSidebar;