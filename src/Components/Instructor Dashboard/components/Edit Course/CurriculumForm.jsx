import {
  Delete as DeleteIcon,
  AddCircle as PlusCircle,
} from "@mui/icons-material";
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
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";
import { deleteLessons } from "../../../../Firebase/courses";

const CurriculumForm = ({ course_id, defaultlessons, onChange }) => {
  const { t } = useTranslation();
  const { register, watch, control, reset } = useForm({
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
    if (defaultlessons && defaultlessons.length > 0) {
      reset({ lessons: defaultlessons });
    }
  }, [defaultlessons, reset]);

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

  const handleRemoveLesson = async (index, lessonId) => {
    // Remove from DB if lessonId exists (i.e., already saved in DB)
    if (lessonId) {
      try {
        await deleteLessons([lessonId]);
      } catch (err) {
        // يمكنك عرض رسالة خطأ هنا إذا أردت
        console.error("Error deleting lesson from DB:", err);
      }
    }
    remove(index);
  };

  return (
    <Container sx={{ py: 3 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t("Course Curriculum")}
        </Typography>
        {fields.map((lesson, index) => (
          <Box
            key={lesson.id}
            sx={{ mt: 2, p: 2, bgcolor: "white", position: "relative" }}
          >
            <Button
              onClick={() => handleRemoveLesson(index, lesson.lesson_id)}
              sx={{ position: "absolute", right: 8, top: -15 }}
              color="error"
              startIcon={<DeleteIcon />}
            >
              {t("Remove")}
            </Button>
            <TextField
              {...register(`lessons.${index}.title`)}
              label={t("Lesson Title")}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              {...register(`lessons.${index}.description`)}
              label={t("Description")}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              {...register(`lessons.${index}.video_url`)}
              label={t("Video URL")}
              fullWidth
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
              <TextField
                {...register(`lessons.${index}.duration`, {
                  valueAsNumber: true,
                })}
                label={t("Duration (minutes)")}
                type="number"
                sx={{ width: 150 }}
              />
              <TextField
                {...register(`lessons.${index}.order`, {
                  valueAsNumber: true,
                })}
                label={t("Order")}
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
                {t("Preview Lesson")}
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
            {t("Add Lesson")}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CurriculumForm;
