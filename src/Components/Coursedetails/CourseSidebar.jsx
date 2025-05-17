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
  Modal,
  IconButton,
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
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { db, doc, getDoc, collection, query, where, getDocs } from '../../Firebase/firebase';

const CourseSidebar = ({ course }) => {
  const [courseData, setCourseData] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [videoError, setVideoError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!course?.id) {
        setError('No course ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch course data from Courses
        const courseRef = doc(db, 'Courses', course.id);
        const courseSnap = await getDoc(courseRef);

        if (!courseSnap.exists()) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        const courseDocData = courseSnap.data();
        console.log('Course Data:', courseDocData);

        // Fetch videos from Lessons
        const lessonsQuery = query(
          collection(db, 'Lessons'),
          where('course_id', '==', course.id.toString()),
          where('is_preview', '==', true)
        );
        const lessonsSnap = await getDocs(lessonsQuery);

        // Calculate total seconds
        let totalSeconds = 0;
        let firstPreviewVideo = null;
        const lessons = lessonsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        lessons.sort((a, b) => a.order - b.order);

        lessons.forEach((lesson) => {
          const duration = Number(lesson.duration) || 0;
          totalSeconds += duration * 60; // Convert minutes to seconds
          if (!firstPreviewVideo && lesson.video_url) {
            firstPreviewVideo = lesson.video_url;
          }
        });

        // Convert to hours or minutes for display
        const totalHours = totalSeconds > 0 ? (totalSeconds / 3600).toFixed(1) : 0;
        let displayText;
        if (totalSeconds >= 3600) {
          displayText = `${totalHours} hours on-demand video`;
        } else if (totalSeconds > 0) {
          displayText = `${Math.round(totalSeconds / 60)} minutes on-demand video`;
        } else {
          displayText = 'No video content';
        }

        console.log('Total Hours:', totalHours);
        console.log('Display Text:', displayText);

        // Calculate discounted price
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
        setPreviewVideoUrl(firstPreviewVideo);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course?.id]);

  const calculateDiscount = (price, discountedPrice) => {
    if (!price || !discountedPrice || discountedPrice >= price) return null;
    const discount = ((price - discountedPrice) / price) * 100;
    return Math.round(discount);
  };

  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get('v');
      if (!videoId && url.includes('youtu.be')) {
        videoId = url.split('/').pop().split('?')[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}?controls=1` : null;
    } catch {
      return null;
    }
  };

  const validateVideoUrl = async (url) => {
    if (isYouTubeUrl(url)) {
      return true; // YouTube URLs don't need CORS validation
    }
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('video')) {
        throw new Error('URL does not point to a valid video file');
      }
      return true;
    } catch (error) {
      console.error('Video URL validation failed:', error);
      return false;
    }
  };

  const handleOpenModal = async () => {
    console.log('Attempting to open modal with video URL:', previewVideoUrl);
    if (!previewVideoUrl) {
      setVideoError('No preview video available for this course.');
      setOpenModal(true);
      return;
    }
    const isValid = await validateVideoUrl(previewVideoUrl);
    if (!isValid && !isYouTubeUrl(previewVideoUrl)) {
      setVideoError('Invalid or inaccessible video URL. Try opening the video directly.');
      setOpenModal(true);
      return;
    }
    setVideoError(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setVideoError(null);
  };

  const handleVideoError = (e) => {
    console.error('Video error details:', {
      code: e.target.error?.code,
      message: e.target.error?.message,
      src: e.target.src,
    });
    let errorMessage = 'Failed to load or play the video.';
    switch (e.target.error?.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        errorMessage += ' Playback was aborted.';
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        errorMessage += ' A network error occurred.';
        break;
      case MediaError.MEDIA_ERR_DECODE:
        errorMessage += ' The video format is not supported.';
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage += ' The video source is not supported or inaccessible (likely a CORS issue).';
        break;
      default:
        errorMessage += ' An unknown error occurred.';
    }
    setVideoError(errorMessage);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: 'white', border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
        <Typography>Loading course data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: 'white', border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
          onClick={handleOpenModal}
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="video-modal-title"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90%', sm: '70%', md: '50%' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
            outline: 'none',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          {previewVideoUrl && !videoError ? (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
              {isYouTubeUrl(previewVideoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(previewVideoUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                  }}
                />
              ) : (
                <video
                  key={previewVideoUrl}
                  controls
                  src={previewVideoUrl}
                  onError={handleVideoError}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                  }}
                >
                  <source src={previewVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error" sx={{ mb: 2 }}>
                {videoError || 'No video available.'}
              </Typography>
              {previewVideoUrl && (
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  href={previewVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                >
                  Open Video in New Tab
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CourseSidebar;