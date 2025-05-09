"use client";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNewSubmissionForm } from "./hooks";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

export default function NewSubmission() {
  const router = useRouter();
  const {
    register,
    handleSubmitForm,
    formState: { errors },
    mutation,
  } = useNewSubmissionForm();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            pb: 1,
          }}
        >
          <IconButton
            onClick={() => {
              router.push("/");
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">New Submission</Typography>
        </Box>

        <form onSubmit={handleSubmitForm}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <FormControl error={!!errors.category} fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              {...register("category")}
              label={"Category"}
              defaultValue=""
            >
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            {errors.category && (
              <FormHelperText>{errors.category.message}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            {...register("imageUrl")}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
