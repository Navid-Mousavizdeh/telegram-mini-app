// hooks/useNewSubmissionForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { SubmissionFormData, submissionSchema } from "../../schema";
import { useToast } from "@/contexts/useToast";

export function useNewSubmissionForm() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const mutation = useMutation<void, Error, SubmissionFormData>({
    mutationFn: async (data) => {
      try {
        await axios.post("/api/submissions", data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (e) {
        const error = e as AxiosError;
        const errorMessage = error.response?.data as { error: string };
        showToast("error", errorMessage.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      router.push("/");
    },
  });

  const handleSubmitForm = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    ...form,
    handleSubmitForm,
    mutation,
  };
}
