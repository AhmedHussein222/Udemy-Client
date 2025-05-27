import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Link,
  Modal,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { db, collection, query, where, getDocs } from '../../Firebase/firebase';

const CourseContent = ({ course }) => {
  const [expandedSection, setExpandedSection] = useState('section1');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLectures, setTotalLectures] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState(() => {
    const saved = localStorage.getItem(`watchedVideos_${course?.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoError, setVideoError] = useState(null);

  const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    return `${hours} hr ${mins} min`;
  };

  const markAsWatched = (lessonId) => {
    const updatedWatched = { ...watchedVideos, [lessonId]: true };
    setWatchedVideos(updatedWatched);
    localStorage.setItem(`watchedVideos_${course?.id}`, JSON.stringify(updatedWatched));
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
      return true; // YouTube URLs are handled via iframe
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

  const handleOpenModal = async (videoUrl, lessonId) => {
    if (!videoUrl) {
      setVideoError('No video URL provided for this lesson.');
      setOpenModal(true);
      return;
    }
    const isValid = await validateVideoUrl(videoUrl);
    if (!isValid && !isYouTubeUrl(videoUrl)) {
      setVideoError('Invalid or inaccessible video URL. Try opening the video directly.');
      setSelectedVideo(videoUrl);
      setOpenModal(true);
      return;
    }
    setSelectedVideo(videoUrl);
    setVideoError(null);
    setOpenModal(true);
    markAsWatched(lessonId);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVideo(null);
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

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonsQuery = query(
          collection(db, 'Lessons'),
          where('course_id', '==', course.id)
        );
        const lessonsSnap = await getDocs(lessonsQuery);

        const lessons = lessonsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        lessons.sort((a, b) => a.order - b.order);

        const lecturesCount = lessons.length;
        const totalMins = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);

        const defaultSection = {
          id: 'section1',
          title: 'Course Lessons',
          length: formatDuration(totalMins),
          lectures: lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            duration: formatDuration(lesson.duration),
            preview: lesson.is_preview,
            video_url: lesson.video_url,
          })),
        };

        setSections([defaultSection]);
        setTotalLectures(lecturesCount);
        setTotalDuration(totalMins);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lessons:', err);
        setLoading(false);
      }
    };

    if (course?.id) {
      fetchLessons();
    }
  }, [course]);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (loading) {
    return <Typography>Loading course content...</Typography>;
  }

  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Course Content
        </Typography>
        <Button
          variant="text"
          color="primary"
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
          onClick={() => setExpandedSection(expandedSection ? null : 'section1')}
        >
          {expandedSection ? 'Collapse all sections' : 'Expand all sections'}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {sections.length} section{sections.length !== 1 ? 's' : ''} • {totalLectures} lecture{totalLectures !== 1 ? 's' : ''} • {formatDuration(totalDuration)} total length
      </Typography>

      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={() => toggleSection(section.id)}
            sx={{ borderBottom: section.id !== sections[sections.length - 1].id ? 1 : 0, borderColor: 'divider' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: 'grey.50',
                '&:hover': { bgcolor: 'grey.100' },
                py: 1,
              }}
            >
              <Typography fontWeight="bold">{section.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                {section.lectures.length} lecture{section.lectures.length !== 1 ? 's' : ''} • {section.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List disablePadding>
                {section.lectures.map((lecture, idx) => (
                  <ListItem
                    key={idx}
                    sx={{
                      borderTop: 1,
                      borderColor: 'grey.100',
                      '&:hover': { bgcolor: 'grey.50' },
                      py: 1,
                    }}
                  >
                    <ListItemIcon>
                      {lecture.preview ? (
                        <PlayCircleOutlineIcon sx={{ color: 'grey.600' }} />
                      ) : (
                        <LockIcon sx={{ color: 'grey.600' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {lecture.preview ? (
                              <Link
                                component="button"
                                onClick={() => handleOpenModal(lecture.video_url, lecture.id)}
                                underline="hover"
                                sx={{
                                  color: watchedVideos[lecture.id] ? '#ce93d8' : 'text.primary',
                                  fontSize: '0.875rem',
                                  '&:hover': { color: '#ce93d8' },
                                  textAlign: 'left',
                                }}
                              >
                                {lecture.title}
                              </Link>
                            ) : (
                              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                {lecture.title}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {lecture.preview && (
                              <Chip
                                label="Preview"
                                size="small"
                                component="button"
                                onClick={() => handleOpenModal(lecture.video_url, lecture.id)}
                                sx={{
                                  bgcolor: watchedVideos[lecture.id] ? '#ce93d8' : 'grey.200',
                                  color: watchedVideos[lecture.id] ? 'white' : 'grey.700',
                                  '&:hover': { bgcolor: '#ce93d8', color: 'white' },
                                  cursor: 'pointer',
                                }}
                              />
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {lecture.duration}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
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
          {selectedVideo && !videoError ? (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
              {isYouTubeUrl(selectedVideo) ? (
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo)}
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
                  key={selectedVideo}
                  controls
                  src={selectedVideo}
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
                  <source src={selectedVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error" sx={{ mb: 2 }}>
                {videoError || 'No video selected.'}
              </Typography>
              {selectedVideo && (
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  href={selectedVideo}
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

export default CourseContent;