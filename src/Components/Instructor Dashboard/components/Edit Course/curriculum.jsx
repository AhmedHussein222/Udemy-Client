import {
  ExpandMore as ChevronDown,
  ExpandLess as ChevronUp,
  Description as FileText,
  AddCircle as PlusCircle,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

// Main Curriculum Builder Component
export default function CurriculumBuilder() {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Introduction",
      lectures: [
        {
          id: 1,
          title: "Introduction",
          isContentExpanded: false,
          description: "",
          videoUrl: "",
        },
        {
          id: 2,
          title: "next",
          isContentExpanded: false,
          description: "",
          videoUrl: "",
        },
      ],
    },
  ]);

  const [editingLecture, setEditingLecture] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);

  // Add a new section
  const handleAddSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      {
        id: prevSections.length + 1,
        title: `Section ${prevSections.length + 1}`,
        lectures: [],
      },
    ]);
  };

  // Add a new lecture to a section
  const handleAddLecture = (sectionId) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: [
                ...section.lectures,
                {
                  id: section.lectures.length + 1,
                  title: "New Lecture",
                  isContentExpanded: false,
                  description: "",
                  videoUrl: "",
                },
              ],
            }
          : section
      )
    );
  };

  // Toggle content expansion for a lecture
  const toggleLectureContent = (sectionId, lectureId) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lecture) =>
                lecture.id === lectureId
                  ? {
                      ...lecture,
                      isContentExpanded: !lecture.isContentExpanded,
                    }
                  : lecture
              ),
            }
          : section
      )
    );
  };

  // Update lecture title
  const handleUpdateLectureTitle = (sectionId, lectureId, newTitle) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lecture) =>
                lecture.id === lectureId
                  ? { ...lecture, title: newTitle }
                  : lecture
              ),
            }
          : section
      )
    );
  };

  // Update lecture content
  const handleUpdateLectureContent = (type, content) => {
    if (!editingLecture) return;

    setSections((prev) =>
      prev.map((section) =>
        section.id === editingLecture.sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lecture) =>
                lecture.id === editingLecture.lectureId
                  ? { ...lecture, [type]: content }
                  : lecture
              ),
            }
          : section
      )
    );
  };

  // Update section title
  const handleUpdateSectionTitle = (sectionId, newTitle) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    );
  };

  return (
    <Container sx={{ py: 3 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Curriculum
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Start putting together your course by creating sections, lectures and
          practice activities (quizzes, coding exercises and assignments). Use
          your course outline to structure your content and label your sections
          and lectures clearly. If you're intending to offer your course for
          free, the total length of video content must be less than 2 hours.
        </Typography>

        {sections.map((section) => (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
              {editingSectionId === section.id ? (
                <TextField
                  value={section.title}
                  onChange={(e) =>
                    handleUpdateSectionTitle(section.id, e.target.value)
                  }
                  variant="standard"
                  autoFocus
                  onBlur={() => setEditingSectionId(null)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setEditingSectionId(null);
                    }
                  }}
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography
                  variant="h6"
                  onClick={() => setEditingSectionId(section.id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  Section {section.id}: {section.title}
                </Typography>
              )}

              {section.lectures.map((lecture) => (
                <Box key={lecture.id} sx={{ mt: 2 }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={lecture.title}
                        onChange={(e) =>
                          handleUpdateLectureTitle(
                            section.id,
                            lecture.id,
                            e.target.value
                          )
                        }
                        variant="standard"
                        sx={{ flexGrow: 1, mr: 2 }}
                      />
                      <IconButton
                        onClick={() =>
                          toggleLectureContent(section.id, lecture.id)
                        }
                      >
                        {lecture.isContentExpanded ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </IconButton>
                    </Box>

                    {lecture.isContentExpanded && (
                      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <Button
                          startIcon={<FileText />}
                          variant="outlined"
                          onClick={() => {
                            setEditingLecture({
                              sectionId: section.id,
                              lectureId: lecture.id,
                            });
                            setIsDescriptionOpen(true);
                          }}
                        >
                          Description
                        </Button>
                        <Button
                          startIcon={<FileText />}
                          variant="outlined"
                          onClick={() => {
                            setEditingLecture({
                              sectionId: section.id,
                              lectureId: lecture.id,
                            });
                            setIsContentOpen(true);
                          }}
                        >
                          Content
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </Box>
              ))}

              <Button
                onClick={() => handleAddLecture(section.id)}
                startIcon={<PlusCircle />}
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Curriculum Item
              </Button>
            </Paper>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            onClick={handleAddSection}
            startIcon={<PlusCircle />}
            variant="contained"
            color="primary"
          >
            Add Section
          </Button>

          <Button variant="contained" color="secondary">
            Bulk Uploader
          </Button>
        </Box>
      </Paper>

      {/* Description Dialog */}
      <Dialog
        open={isDescriptionOpen}
        onClose={() => setIsDescriptionOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Lecture Description</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter lecture description..."
            value={
              editingLecture
                ? sections
                    .find((s) => s.id === editingLecture.sectionId)
                    ?.lectures.find((l) => l.id === editingLecture.lectureId)
                    ?.description || ""
                : ""
            }
            onChange={(e) =>
              handleUpdateLectureContent("description", e.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDescriptionOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => setIsDescriptionOpen(false)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content Dialog */}
      <Dialog
        open={isContentOpen}
        onClose={() => setIsContentOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Lecture Content</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Enter video URL..."
            value={
              editingLecture
                ? sections
                    .find((s) => s.id === editingLecture.sectionId)
                    ?.lectures.find((l) => l.id === editingLecture.lectureId)
                    ?.videoUrl || ""
                : ""
            }
            onChange={(e) =>
              handleUpdateLectureContent("videoUrl", e.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsContentOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setIsContentOpen(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
