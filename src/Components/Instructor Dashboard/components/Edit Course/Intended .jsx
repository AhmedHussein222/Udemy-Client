import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { getCategories, getSubcategories } from "../../../../Firebase/courses";

const IntendedLearnersForm = forwardRef(
  ({ onSubmitSuccess, onSubmitError  ,instructor_id}, ref) => {
    const {
      register,
      control,
      handleSubmit,
      watch,
      formState: { isValid ,errors },
    } = useForm({
      defaultValues: {
        title: "",
        instructor_id,
        description: "",
        price: "",
        category_id: "",
        subcategory_id: "",
        thumbnail: "",
        duration: 0,
        discount: 0,
        what_will_learn: [
          { text: "" },
          { text: "" },
          { text: "" },
          { text: "" },
        ],
        requirements: [{ text: "" }],
        language: "",
        level: "",
      },
      mode: "onChange",
    });
    useImperativeHandle(ref, () => ({
      getValues: () => watch(),
      isvalid :()=> isValid
    }));

    const {
      fields: learningFields,
      append: appendLearning,
      remove: removeLearning,
    } = useFieldArray({
      control,
      name: "what_will_learn",
    });

    const {
      fields: prerequisiteFields,
      append: appendPrerequisite,
      remove: removePrerequisite,
    } = useFieldArray({
      control,
      name: "requirements",
    });

    const onSubmit = (data) => {
      if (onSubmitSuccess) onSubmitSuccess(data);
    };

    const onError = () => {
      if (onSubmitError) onSubmitError();
    };
    let [categories, setCats] = useState([]);
    let [subCategories, setSubCats] = useState([]);
    const categoryId = watch("category_id");
    useEffect(() => {
      getCategories().then((data) => {
        setCats(data);
        if (
          data.length > 0 &&
          !data.some((cat) => cat.category_id === categoryId)
        ) {
          if (typeof control._updateFormState === "function") {
            control._updateFormState({
              values: {
                ...control._formValues,
                category_id: data[0].category_id,
              },
            });
          }
        }
      });
      getSubcategories(categoryId).then((data) => {
        setSubCats(data);
      });
    }, [categoryId, control]);

    return (
      <Container maxWidth="md" sx={{ py: 0, px: 5 }}>
        <Box sx={{ bgcolor: "background.paper" }}>
          <Typography variant="h4" gutterBottom>
            Course Information
          </Typography>
          <Divider sx={{ my: 2 }} />

          <form ref={ref} onSubmit={handleSubmit(onSubmit, onError)}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Basic Course Information
              </Typography>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
              >
                <TextField
                  fullWidth
                  label="Course Title"
                  size="small"
                  {...register("title", {
                    required: "Title is required",
                  })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />

                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    defaultValue=""
                    {...register("category_id", {
                      required: "Category is required",
                    })}
                    error={!!errors.category_id}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category_id && (
                    <Typography color="error" variant="caption">
                      {errors.category_id.message}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    label="Subcategory"
                    defaultValue=""
                    {...register("subcategory_id", {
                      required: "Subcategory is required",
                    })}
                    error={!!errors.subcategory_id}
                  >
                    <MenuItem value="">Select Subcategory</MenuItem>
                    {subCategories.map((subcategory) => (
                      <MenuItem
                        key={subcategory.subcategory_id}
                        value={subcategory.subcategory_id}
                      >
                        {subcategory.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subcategory_id && (
                    <Typography color="error" variant="caption">
                      {errors.subcategory_id.message}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    label="Language"
                    {...register("language", {
                      required: "Course language is required",
                    })}
                    defaultValue={"english"}
                    error={!!errors.language}
                  >
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="arabic">Arabic</MenuItem>
                    <MenuItem value="spanish">Spanish</MenuItem>
                    <MenuItem value="french">French</MenuItem>
                    <MenuItem value="german">German</MenuItem>
                    <MenuItem value="japanese">Japanese</MenuItem>
                    <MenuItem value="chinese">Chinese</MenuItem>
                  </Select>
                  {errors.language && (
                    <Typography color="error" variant="caption">
                      {errors.language.message}
                    </Typography>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  size="small"
                  InputProps={{ startAdornment: "$" }}
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                  })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />

                <TextField
                  fullWidth
                  label="Discount (%)"
                  type="number"
                  size="small"
                  InputProps={{
                    endAdornment: "%",
                    inputProps: { min: 0, max: 100 },
                  }}
                  {...register("discount", {
                    min: { value: 0, message: "Discount cannot be negative" },
                    max: { value: 100, message: "Discount cannot exceed 100%" },
                  })}
                  error={!!errors.discount}
                  helperText={errors.discount?.message}
                />

                <TextField
                  fullWidth
                  label="Thumbnail URL"
                  size="small"
                  placeholder="Enter image URL"
                  {...register("thumbnail", {
                    required: "Thumbnail URL is required",
                  })}
                  error={!!errors.thumbnail}
                  helperText={
                    errors.thumbnail?.message ||
                    "Enter a direct URL to your course thumbnail image"
                  }
                />

                {watch("thumbnail") && (
                  <Box
                    component="img"
                    src={watch("thumbnail")}
                    alt="Course thumbnail preview"
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Course Description"
                  multiline
                  rows={4}
                  {...register("description", {
                    required: "Description is required",
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />

                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  size="small"
                  {...register("duration", {
                    required: "Duration is required",
                    min: {
                      value: 1,
                      message: "Duration must be at least 1 minute",
                    },
                  })}
                  error={!!errors.duration}
                  helperText={errors.duration?.message}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                What will students learn in your course?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You must enter at least 4 learning objectives or outcomes that
                learners can expect to achieve.
              </Typography>
              {learningFields.map((field, index) => (
                <Box key={field.id} sx={{ mb: 2, display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    {...register(`what_will_learn.${index}.text`, {
                      required: index < 4 ? "This field is required" : false,
                    })}
                    error={!!errors.what_will_learn?.[index]}
                    helperText={errors.what_will_learn?.[index]?.text?.message}
                  />
                  <IconButton
                    onClick={() => removeLearning(index)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => appendLearning({ text: "" })}
                sx={{ color: "primary.main", textTransform: "none" }}
              >
                Add Learning Objective
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                What are the requirements or prerequisites?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                List the required skills, experience, tools or equipment
                learners should have.
              </Typography>
              {prerequisiteFields.map((field, index) => (
                <Box key={field.id} sx={{ mb: 2, display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    {...register(`requirements.${index}.text`)}
                  />
                  <IconButton
                    onClick={() => removePrerequisite(index)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => appendPrerequisite({ text: "" })}
                sx={{ color: "primary.main", textTransform: "none" }}
              >
                Add Prerequisite
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Who is this course for?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the experience level required for this course.
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Target Level</InputLabel>
                <Select
                  label="Target Level"
                  {...register("level", {
                    required: "Please select a target level",
                  })}
                  defaultValue={"beginner"}
                  error={!!errors.level}
                >
                  <MenuItem value="beginner">
                    Beginner (No experience required)
                  </MenuItem>
                  <MenuItem value="intermediate">
                    Intermediate (Some experience needed)
                  </MenuItem>
                  <MenuItem value="advanced">
                    Advanced (Experienced learners)
                  </MenuItem>
                </Select>
                {errors.level && (
                  <Typography color="error" variant="caption">
                    {errors.level.message}
                  </Typography>
                )}
              </FormControl>
            </Box>

  
          </form>
        </Box>
      </Container>
    );
  }
);

export default IntendedLearnersForm;
