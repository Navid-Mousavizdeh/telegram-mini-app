"use client";
import { useAuth } from "@/lib/authentication";
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SubmissionCard, SubmissionTable } from "./components";
import { useSubmissions } from "./hooks";
import NoData from "@/components/shared/NoData";

export default function Submissions() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { ref, inView } = useInView();

  const {
    submissions,
    isLoading: submissionsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSubmissions(user?.username);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const isLoading = authLoading || submissionsLoading;

  return (
    <Container>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
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
            Add
          </Button>
          <Button onClick={logout} variant="outlined">
            Logout
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Typography sx={{ mt: 4 }}>Loading...</Typography>
      ) : !submissions.length ? (
        <NoData message="No Submission yet!" />
      ) : isSmallScreen ? (
        <Box mt={2}>
          {submissions.map((s) => (
            <SubmissionCard key={s._id.toString()} submission={s} />
          ))}
          <div ref={ref}>{isFetchingNextPage && "Loading more..."}</div>
        </Box>
      ) : (
        <SubmissionTable
          submissions={submissions}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          refCallback={ref}
        />
      )}
    </Container>
  );
}
