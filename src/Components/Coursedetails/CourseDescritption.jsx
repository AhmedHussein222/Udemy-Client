import React, { useState } from 'react';
import { Box, Typography, Button, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CourseDescription = ({ course }) => {
  const [expanded, setExpanded] = useState(false);
  const description = course?.description || 'No description available';

  // تقسيم الوصف لجزء قصير (أول 100 كلمة كمثال)
  const getShortDescription = (text) => {
    if (!text || text === 'No description available') return text;
    const words = text.split(' ');
    if (words.length <= 100) return text; // لو الوصف قصير، نرجعه كله
    return words.slice(0, 100).join(' ') + '...';
  };

  // تحديد إذا كان فيه حاجة نعرضها في "Show more"
  const needsShowMore = description !== 'No description available' && description.split(' ').length > 100;

  return (
    <Box sx={{ mb: 8, width: '100%' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Description
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Collapse in={expanded} collapsedSize={150}>
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
          >
            {expanded ? description : getShortDescription(description)}
          </Typography>
        </Collapse>
        {needsShowMore && (
          <Button
            variant="text"
            color="primary"
            onClick={() => setExpanded(!expanded)}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              '&:hover': { color: 'primary.dark' },
            }}
          >
            {expanded ? 'Show less' : 'Show more'}
            <ExpandMoreIcon
              sx={{
                ml: 0.5,
                fontSize: 16,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CourseDescription;