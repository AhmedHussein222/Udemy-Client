import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const CourseRequirements = ({ course }) => {
  const requirements = course?.requirements || [];

  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Requirements
      </Typography>
      {requirements.length > 0 ? (
        <List sx={{ py: 0 }}>
          {requirements.map((requirement, index) => (
            <ListItem key={index} disablePadding sx={{ alignItems: 'flex-start', mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 32, mt: 0.25 }}>
                <CheckIcon sx={{ fontSize: 18, color: 'grey.700' }} />
              </ListItemIcon>
              <ListItemText
                primary={requirement}
                primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No requirements specified
        </Typography>
      )}
    </Box>
  );
};

export default CourseRequirements;