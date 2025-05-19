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
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const CourseForm = ({ defaultValues, onChange, categories, subCategories }) => {
  const { t } = useTranslation();
  const {
    register,
    control,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      price: "",
      category_id: "",
      subcategory_id: "",
      thumbnail: "",
      duration: 0,
      discount: 0,
      what_will_learn: [""],
      requirements: [""],
      language: "",
      level: "",
      is_published: false,
      created_at: new Date(),
    },
    mode: "onTouched",
  });

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

  useEffect(() => {
    const subscription = watch((value) => {
      if (onChange) {
        onChange(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <Container maxWidth="md" sx={{ py: 0, px: 5 }}>
      <Box sx={{ bgcolor: "background.paper" }}>
        <Typography variant="h4" gutterBottom>
          {t("Course Information")}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t("Basic Course Information")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label={t("Course Title")}
              size="small"
              {...register("title", {
                required: t("Title is required"),
              })}
              error={!!errors.title && touchedFields.title}
              helperText={touchedFields.title && errors.title?.message}
            />
            <FormControl fullWidth size="small">
              <InputLabel>{t("Category")}</InputLabel>
              <Select
                label={t("Category")}
                defaultValue=""
                {...register("category_id", {
                  required: t("Category is required"),
                })}
                error={!!errors.category_id && touchedFields.category_id}
              >
                <MenuItem value="">{t("Select Category")}</MenuItem>
                {categories?.map((category) => (
                  <MenuItem
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && touchedFields.category_id && (
                <Typography color="error" variant="caption">
                  {errors.category_id.message}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>{t("Subcategory")}</InputLabel>
              <Select
                label={t("Subcategory")}
                defaultValue=""
                {...register("subcategory_id", {
                  required: t("Subcategory is required"),
                })}
                error={!!errors.subcategory_id && touchedFields.subcategory_id}
              >
                <MenuItem value="">{t("Select Subcategory")}</MenuItem>
                {subCategories?.map((subcategory) => (
                  <MenuItem
                    key={subcategory.subcategory_id}
                    value={subcategory.subcategory_id}
                  >
                    {subcategory.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.subcategory_id && touchedFields.subcategory_id && (
                <Typography color="error" variant="caption">
                  {errors.subcategory_id.message}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>{t("Language")}</InputLabel>
              <Select
                label={t("Language")}
                {...register("language", {
                  required: t("Course language is required"),
                })}
                defaultValue={"english"}
                error={!!errors.language && touchedFields.language}
              >
                <MenuItem value="english">{t("English")}</MenuItem>
                <MenuItem value="arabic">{t("Arabic")}</MenuItem>
                <MenuItem value="french">{t("French")}</MenuItem>
                <MenuItem value="german">{t("German")}</MenuItem>
              </Select>
              {errors.language && touchedFields.language && (
                <Typography color="error" variant="caption">
                  {errors.language.message}
                </Typography>
              )}
            </FormControl>
            <TextField
              fullWidth
              label={t("Price")}
              type="number"
              size="small"
              InputProps={{ startAdornment: "$" }}
              {...register("price", {
                required: t("Price is required"),
                min: { value: 0, message: t("Price cannot be negative") },
              })}
              error={!!errors.price && touchedFields.price}
              helperText={touchedFields.price && errors.price?.message}
            />
            <TextField
              fullWidth
              label={t("Discount (%)")}
              type="number"
              size="small"
              InputProps={{
                endAdornment: "%",
                inputProps: { min: 0, max: 100 },
              }}
              {...register("discount", {
                min: { value: 0, message: t("Discount cannot be negative") },
                max: { value: 100, message: t("Discount cannot exceed 100%") },
              })}
              error={!!errors.discount && touchedFields.discount}
              helperText={touchedFields.discount && errors.discount?.message}
            />
            <TextField
              fullWidth
              label={t("Thumbnail URL")}
              size="small"
              placeholder={t("Enter image URL")}
              {...register("thumbnail", {
                required: t("Thumbnail URL is required"),
              })}
              error={!!errors.thumbnail && touchedFields.thumbnail}
              helperText={
                touchedFields.thumbnail &&
                (errors.thumbnail?.message ||
                  t("Enter a direct URL to your course thumbnail image"))
              }
            />
            {watch("thumbnail") && (
              <Box
                component="img"
                src={watch("thumbnail")}
                alt={t("Course thumbnail preview")}
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
              label={t("Course Description")}
              multiline
              rows={4}
              {...register("description", {
                required: t("Description is required"),
              })}
              error={!!errors.description && touchedFields.description}
              helperText={
                touchedFields.description && errors.description?.message
              }
            />
            <TextField
              fullWidth
              label={t("Duration (minutes)")}
              type="number"
              size="small"
              {...register("duration", {
                required: t("Duration is required"),
                min: {
                  value: 1,
                  message: t("Duration must be at least 1 minute"),
                },
              })}
              error={!!errors.duration && touchedFields.duration}
              helperText={touchedFields.duration && errors.duration?.message}
            />
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t("What will students learn in your course?")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t(
              "You must enter at least one learning objective or outcome that learners can expect to achieve."
            )}
          </Typography>
          {learningFields.map((field, index) => (
            <Box
              key={field.id ?? index}
              sx={{ mb: 2, display: "flex", gap: 1 }}
            >
              <TextField
                fullWidth
                size="small"
                {...register(`what_will_learn.${index}`, {
                  required: index === 0 ? t("This field is required") : false,
                })}
                error={
                  !!errors.what_will_learn?.[index] &&
                  touchedFields.what_will_learn?.[index]
                }
                helperText={
                  touchedFields.what_will_learn?.[index] &&
                  errors.what_will_learn?.[index]?.message
                }
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
            onClick={() => appendLearning("")}
            sx={{ color: "primary.main", textTransform: "none" }}
          >
            {t("Add Learning Objective")}
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t("What are the requirements or prerequisites?")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t(
              "List the required skills, experience, tools or equipment learners should have."
            )}
          </Typography>
          {prerequisiteFields.map((field, index) => (
            <Box
              key={field.id ?? index}
              sx={{ mb: 2, display: "flex", gap: 1 }}
            >
              <TextField
                fullWidth
                size="small"
                {...register(`requirements.${index}`)}
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
            onClick={() => appendPrerequisite("")}
            sx={{ color: "primary.main", textTransform: "none" }}
          >
            {t("Add Prerequisite")}
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t("Who is this course for?")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("Select the experience level required for this course.")}
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>{t("Target Level")}</InputLabel>
            <Select
              label={t("Target Level")}
              {...register("level", {
                required: t("Please select a target level"),
              })}
              defaultValue={"beginner"}
              error={!!errors.level && touchedFields.level}
            >
              <MenuItem value="beginner">
                {t("Beginner (No experience required)")}
              </MenuItem>
              <MenuItem value="intermediate">
                {t("Intermediate (Some experience needed)")}
              </MenuItem>
              <MenuItem value="advanced">
                {t("Advanced (Experienced learners)")}
              </MenuItem>
            </Select>
            {errors.level && touchedFields.level && (
              <Typography color="error" variant="caption">
                {errors.level.message}
              </Typography>
            )}
          </FormControl>
        </Box>
      </Box>
    </Container>
  );
};

export default CourseForm;
