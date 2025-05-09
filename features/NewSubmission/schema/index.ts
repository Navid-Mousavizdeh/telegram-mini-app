import { z } from "zod";

const categories = ["technology", "education", "health", "other", ""] as const;

export const submissionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be under 1000 characters"),

  category: z.string().nonempty("Category is required"),

  imageUrl: z
    .string()
    .trim()
    .url("Please enter a valid image URL")
    .refine((url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url), {
      message: "Image URL must end with .jpg, .png, .gif, or .webp",
    }),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
