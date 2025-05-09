"use client";
import { useAuth } from "@/lib/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema validation using Zod
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["technology", "education", "health", "other"]),
  imageUrl: z.string().url("Must be a valid URL"),
});

type FormData = z.infer<typeof schema>;

export default function NewSubmissionPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login");
      }
    }
  }, [authLoading, user, router]);

  const mutation = useMutation<void, Error, FormData>({
    mutationFn: async (data: FormData) => {
      await axios.post("/api/submissions", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      router.push("/submissions");
    },
    onError: (error: Error) => {
      alert("Submission failed");
      console.error("Submission error:", error);
    },
  });

  // Handle form submission
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          New Submission
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select {...register("category")} defaultValue="">
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            {errors.category && (
              <Typography color="error">{errors.category.message}</Typography>
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
            disabled={mutation.isPending} // Disable the button during mutation
          >
            {mutation.isPending ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
