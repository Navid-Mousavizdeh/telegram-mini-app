"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/submissions"); // Redirect to /submissions
  }, [router]);

  return <CircularProgress />; // Optionally show a loading message or nothing
};

export default HomePage;
