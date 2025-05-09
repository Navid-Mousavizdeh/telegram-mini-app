import { Chip } from "@mui/material";
import { Submission } from "@/types";

export const getCategoryChip = (category: Submission["category"]) => {
  const colors: Record<string, string> = {
    technology: "info.light",
    education: "success.light",
    health: "warning.light",
  };

  return (
    <Chip
      label={category}
      size="small"
      variant="outlined"
      sx={{
        textTransform: "capitalize",
        borderColor: colors[category] || "grey.600",
        color: colors[category] || "grey.600",
      }}
    />
  );
};
