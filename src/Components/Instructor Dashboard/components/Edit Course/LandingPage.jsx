import { Box, Button, TextField, Typography } from "@mui/material";
import { useCourseContext } from "../../../../context/CourseContext";

const LandingPage = () => {
  const { courseData, updateCourseData } = useCourseContext();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // You would normally upload to backend here
        const imageUrl = URL.createObjectURL(file);
        updateCourseData(
          {
            thumbnail: imageUrl,
            landing_page: { image_updated: true },
          },
          "landing_page"
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleDescriptionChange = (e) => {
    updateCourseData(
      {
        description: e.target.value,
        landing_page: {
          last_edited: new Date().toISOString(),
        },
      },
      "landing_page"
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Course Landing Page
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Course Description"
        value={courseData.description || ""}
        onChange={handleDescriptionChange}
        error={!courseData.description}
        helperText={!courseData.description ? "Description is required" : ""}
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 3 }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="thumbnail-upload"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="thumbnail-upload">
          <Button variant="outlined" component="span" sx={{ mr: 2 }}>
            Upload Thumbnail
          </Button>
        </label>
        {courseData.thumbnail && (
          <Box
            component="img"
            src={courseData.thumbnail}
            alt="Course thumbnail"
            sx={{ maxWidth: 200, mt: 2 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default LandingPage;
