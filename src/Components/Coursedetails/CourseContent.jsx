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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import { db, collection, query, where, getDocs } from '../../Firebase/firebase';

const CourseContent = ({ course }) => {
  const [expandedSection, setExpandedSection] = useState('section1');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLectures, setTotalLectures] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState(() => {
    // جلب الحالة من localStorage لو موجودة
    const saved = localStorage.getItem(`watchedVideos_${course?.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  // تحويل المدة من دقايق لساعات ودقايق
  const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    return `${hours} hr ${mins} min`;
  };

  // تسجيل إن الفيديو اتشاف
  const markAsWatched = (lessonId) => {
    const updatedWatched = { ...watchedVideos, [lessonId]: true };
    setWatchedVideos(updatedWatched);
    localStorage.setItem(`watchedVideos_${course?.id}`, JSON.stringify(updatedWatched));
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // جلب الدروس من Lessons collection بناءً على course_id
        const lessonsQuery = query(
          collection(db, 'Lessons'),
          where('course_id', '==', course.id)
        );
        const lessonsSnap = await getDocs(lessonsQuery);

        // تجميع الدروس
        const lessons = lessonsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ترتيب الدروس حسب حقل order
        lessons.sort((a, b) => a.order - b.order);

        // حساب إجمالي عدد الدروس وإجمالي المدة
        const lecturesCount = lessons.length;
        const totalMins = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);

        // افتراض section واحدة لو مافيش تقسيم واضح
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
    <Box sx={{ mb: 4,width: '100%' }}>
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
                            {idx === 0 ? (
                              <Link
                                href={lecture.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                sx={{
                                  color: watchedVideos[lecture.id] ? '#ce93d8' : 'text.primary',
                                  fontSize: '0.875rem',
                                  '&:hover': { color: '#ce93d8' },
                                }}
                                onClick={() => markAsWatched(lecture.id)}
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
                                component={idx === 0 ? Link : 'span'}
                                href={idx === 0 ? lecture.video_url : undefined}
                                target={idx === 0 ? '_blank' : undefined}
                                rel={idx === 0 ? 'noopener noreferrer' : undefined}
                                sx={{
                                  bgcolor: idx === 0 && watchedVideos[lecture.id] ? '#ce93d8' : 'grey.200',
                                  color: idx === 0 && watchedVideos[lecture.id] ? 'white' : 'grey.700',
                                  '&:hover': idx === 0 ? { bgcolor: '#ce93d8', color: 'white' } : {},
                                  cursor: idx === 0 ? 'pointer' : 'default',
                                }}
                                onClick={idx === 0 ? () => markAsWatched(lecture.id) : undefined}
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
    </Box>
  );
};

export default CourseContent;