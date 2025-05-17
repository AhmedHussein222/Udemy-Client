import { Delete as DeleteIcon, AddCircle as PlusCircle } from "@mui/icons-material";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

const CurriculumForm = ({ course_id, defaultlessons, onChange }) => {
  const { register, watch, control } = useForm({
    defaultValues: {
      lessons: defaultlessons || [],
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessons",
  });

  useEffect(() => {
    const subscription = watch((value) => {
      if (onChange) {
        onChange(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const handleAddLesson = () => {
    append({
      lesson_id: v4(),
      course_id,
      title: "New Lesson",
      description: "",
      duration: 0,
      is_preview: false,
      order: fields.length + 1,
      video_url: "",
    });
  };

  return (
    <Container sx={{ py: 3 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Course Curriculum
        </Typography>
        {fields.map((lesson, index) => (
          <Box
            key={lesson.id}
            sx={{ mt: 2, p: 2, bgcolor: "white", position: "relative" }}
          >
            <Button
              onClick={() => remove(index)}
              sx={{ position: "absolute", right: 8, top: -15 }}
              color="error"
              startIcon={<DeleteIcon />}
            >
              Remove
            </Button>
            <TextField
              {...register(`lessons.${index}.title`)}
              label="Lesson Title"
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              {...register(`lessons.${index}.description`)}
              label="Description"
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              {...register(`lessons.${index}.video_url`)}
              label="Video URL"
              fullWidth
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
              <TextField
                {...register(`lessons.${index}.duration`, {
                  valueAsNumber: true,
                })}
                label="Duration (minutes)"
                type="number"
                sx={{ width: 150 }}
              />
              <TextField
                {...register(`lessons.${index}.order`, {
                  valueAsNumber: true,
                })}
                label="Order"
                type="number"
                sx={{ width: 100 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <label>
                <input
                  type="checkbox"
                  {...register(`lessons.${index}.is_preview`)}
                />
                Preview Lesson
              </label>
            </Box>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            type="button"
            onClick={handleAddLesson}
            startIcon={<PlusCircle />}
            variant="contained"
          >
            Add Lesson
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CurriculumForm; 