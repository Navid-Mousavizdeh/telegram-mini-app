"use client";

import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Submission } from "@/types";
import { Fragment, useState } from "react";
import { getCategoryChip } from "../../utils";

interface Props {
  submissions: Submission[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refCallback: (node?: Element | null) => void;
}

export const SubmissionTable: React.FC<Props> = ({
  submissions,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refCallback,
}) => {
  const theme = useTheme();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <Table size="small" sx={{ mt: 2 }}>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Title</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Image</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {submissions.map((submission, idx) => {
          const isOpen = expandedRow === submission._id.toString();
          const bgColor =
            idx % 2 === 0 ? theme.palette.action.hover : "transparent";

          return (
            <Fragment key={submission._id.toString()}>
              <TableRow sx={{ backgroundColor: bgColor }}>
                <TableCell>
                  <IconButton
                    onClick={() => handleToggle(submission._id.toString())}
                  >
                    {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
                <TableCell>{submission.title}</TableCell>
                <TableCell>{getCategoryChip(submission.category)}</TableCell>
                <TableCell>
                  <img
                    src={submission.imageUrl}
                    alt={submission.title}
                    style={{
                      width: isOpen ? 120 : 50,
                      height: isOpen ? 120 : 50,
                      objectFit: "cover",
                      borderRadius: 4,
                      transition: "0.3s",
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} sx={{ p: 0 }}>
                  <Collapse in={isOpen} timeout={250} unmountOnExit>
                    <Box p={2}>
                      <Typography variant="subtitle2">Description:</Typography>
                      <Typography variant="body2">
                        {submission.description}
                      </Typography>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
        {hasNextPage && (
          <TableRow>
            <TableCell colSpan={4} ref={refCallback} align="center">
              {isFetchingNextPage && <CircularProgress size={24} />}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
