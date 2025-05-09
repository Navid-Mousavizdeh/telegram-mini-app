"use client";
import { useAuth } from "@/lib/authentication";
import { Submission } from "@/types";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const getCategoryChip = (category: Submission["category"]) => {
  return (
    <Chip
      label={category}
      size="small"
      variant="outlined"
      sx={{
        textTransform: "capitalize",
        borderColor:
          category === "technology"
            ? "info.light"
            : category === "education"
            ? "success.light"
            : category === "health"
            ? "warning.light"
            : "grey.300",
        color:
          category === "technology"
            ? "info.light"
            : category === "education"
            ? "success.light"
            : category === "health"
            ? "warning.light"
            : "grey.300",
      }}
    />
  );
};

export default function SubmissionsPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const PAGE_SIZE = 5;

  const { ref, inView } = useInView();

  const {
    data: submissions,
    isLoading: submissionsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Submission[], Error>({
    queryKey: ["submissions", user?.username],
    enabled: !!user,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined,
    queryFn: async ({ pageParam = 1 }) => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `/api/submissions?page=${pageParam}&limit=${PAGE_SIZE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const isLoading = authLoading || submissionsLoading;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const handleToggle = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleCollapseEntered = (submissionId: string) => {
    setLoadedImage(submissionId);
  };

  return (
    <Container>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
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
        // Skeleton Loading
        <Table sx={{ mt: 2 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton variant="text" width={40} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
              {!isSmallScreen && (
                <TableCell>
                  <Skeleton variant="text" width={120} />
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width={40} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={180} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={180} />
                </TableCell>
                {!isSmallScreen && (
                  <TableCell>
                    <Skeleton variant="rectangular" width={50} height={50} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        // Actual Data
        <Table sx={{ mt: 2 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>

              {!isSmallScreen && <TableCell>Image</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions?.pages.flat().map((submission, idx) => {
              const isOpen = expandedRow === submission._id.toString();
              const bgColor =
                idx % 2 === 0 ? theme.palette.action.hover : "transparent";

              return (
                <React.Fragment key={submission._id.toString()}>
                  <TableRow sx={{ backgroundColor: bgColor }}>
                    <TableCell>
                      <IconButton
                        onClick={() => handleToggle(submission._id.toString())}
                      >
                        {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{submission.title}</TableCell>
                    <TableCell>
                      {getCategoryChip(submission.category)}
                    </TableCell>
                    {!isSmallScreen && (
                      <TableCell>
                        <img
                          src={submission.imageUrl}
                          alt={submission.title}
                          style={{
                            width: isOpen ? 120 : 50,
                            height: isOpen ? 120 : 50,
                            transition: "all 0.3s ease-in-out",
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} style={{ padding: 0 }}>
                      <Collapse
                        in={isOpen}
                        timeout={250}
                        unmountOnExit
                        onEntered={() =>
                          handleCollapseEntered(submission._id.toString())
                        }
                      >
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: theme.palette.background.default,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Description:
                          </Typography>
                          <Typography variant="body2">
                            {submission.description}
                          </Typography>
                        </Box>
                        {isSmallScreen && isOpen && (
                          <Box sx={{ mb: 1 }}>
                            {loadedImage === submission._id.toString() && (
                              <img
                                src={submission.imageUrl}
                                alt={submission.title}
                                loading="lazy"
                                style={{
                                  width:
                                    loadedImage === submission._id.toString()
                                      ? "100%"
                                      : 50,
                                  maxWidth: 300,
                                  height: "auto",
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  transition: "all 0.3s ease-in-out",
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}

            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <TableRow>
                <TableCell colSpan={4} ref={ref} sx={{ textAlign: "center" }}>
                  {isFetchingNextPage && <CircularProgress size={24} />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
