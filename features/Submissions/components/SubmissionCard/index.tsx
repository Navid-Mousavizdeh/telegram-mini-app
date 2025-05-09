"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Submission } from "@/types";
import { useState } from "react";
import { getCategoryChip } from "../../utils";

export const SubmissionCard: React.FC<{ submission: Submission }> = ({
  submission,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: "none",
        border: (theme) => `1px solid ${theme.palette.primary.main}50`,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            width: "100%",
            gap: 1,
          }}
        >
          <Typography variant="h6">{submission.title}</Typography>
          {getCategoryChip(submission.category)}
        </CardContent>
        <IconButton onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardMedia
          component="img"
          height="200"
          image={submission.imageUrl}
          alt={submission.title}
        />
        <CardContent>
          <Typography variant="subtitle2">Description:</Typography>
          <Typography variant="body2">{submission.description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
