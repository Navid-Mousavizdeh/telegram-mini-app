"use client";
import { useAuth } from "@/lib/authentication";
import { Submission } from "@/types";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubmissionsPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const { data: submissions, isLoading: submissionsLoading } = useQuery<
    Submission[]
  >({
    queryKey: ["submissions", `submissions-${user?.username}`],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/submissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!user, // Only fetch submissions if the user is authenticated
  });

  // Combine the two loading states
  const isLoading = authLoading || submissionsLoading;

  // Handle redirection after the component mounts
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]); // Ensure this effect only runs when the user state changes

  return (
    <Container>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Submissions</Typography>
        <Box>
          <Button
            component={Link}
            href="/submissions/new"
            variant="contained"
            sx={{ mr: 2 }}
          >
            New
          </Button>
          <Button onClick={logout} variant="outlined">
            Logout
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        // Skeleton Loading for Table
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width={180} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={180} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={50} height={50} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        // Actual Data Displayed After Loading
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions?.map((submission) => (
              <TableRow key={submission._id.toString()}>
                <TableCell>{submission.title}</TableCell>
                <TableCell>{submission.category}</TableCell>
                <TableCell>
                  <img
                    src={submission.imageUrl}
                    alt={submission.title}
                    style={{ width: 50 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
