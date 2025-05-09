"use client";

import { useAuth } from "@/lib/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormData, schema } from "./schema";
import { useToast } from "@/contexts/useToast";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => login(data.username, data.password),
    onError: (e) => {
      const error = e as AxiosError;
      const errorMessage = error.response?.data as { error: string };
      showToast("error", errorMessage.error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ username: data.username, password: data.password });
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
          autoCapitalize="off"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>
      <Button
        variant="text"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => router.push("/auth/signup")}
      >
        Don&apos;t have an account? Signup
      </Button>
    </Box>
  );
}
