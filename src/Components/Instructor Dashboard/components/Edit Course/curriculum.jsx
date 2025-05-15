import {
  Delete as DeleteIcon,
  AddCircle as PlusCircle,
} from "@mui/icons-material";
import { Box, Button, Container, Paper, TextField } from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

const CurriculumBuilder = forwardRef((course_id, ref) => {
  const { register, watch, handleSubmit, control  ,formState:{isValid}} = useForm({
    defaultValues: {
      lessons: [],
    },
    mode: "onChange",
  });
  useImperativeHandle(ref, () => ({
    getValues: () => watch(),
      isvalid :()=> isValid
  }));
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessons",
  });

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

  const onSubmit = (data) => {
    console.log(data);
  };

  const onError = () => {
    console.log("Error in form submission");
  };

  return (
    <Container sx={{ py: 3 }}>
      <form ref={ref} onSubmit={handleSubmit(onSubmit, onError)}>
        <Paper elevation={1} sx={{ p: 4 }}>
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
      </form>
    </Container>
  );
});

export default CurriculumBuilder;
