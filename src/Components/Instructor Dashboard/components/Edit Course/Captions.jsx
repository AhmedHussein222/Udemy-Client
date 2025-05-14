import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useCourseContext } from "../../../../context/CourseContext";

const Captions = () => {
  const { courseData, updateCourseData } = useCourseContext();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Course Language and Captions
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Primary Language
        </Typography>
        <Select
          value={courseData.language || "English"}
          onChange={(e) => updateCourseData({ language: e.target.value })}
        >
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Spanish">Spanish</MenuItem>
          <MenuItem value="Arabic">Arabic</MenuItem>
          {/* Add more languages as needed */}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Captions;
