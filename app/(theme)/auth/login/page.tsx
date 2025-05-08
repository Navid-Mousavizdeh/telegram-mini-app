"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/lib/authentication";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.username, data.password);
    } catch {
      alert("Login failed");
    }
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
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      <Divider sx={{ mt: 3, mb: 3 }}>OR</Divider>
      <Button variant="outlined" fullWidth startIcon={<TelegramIcon />}>
        Login with Telegram
      </Button>
      <Button
        variant="text"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => router.push("/auth/signup")}
      >
        Don't have an account? Signup
      </Button>
    </Box>
  );
}
