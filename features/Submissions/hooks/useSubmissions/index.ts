import { useToast } from "@/contexts/useToast";
import { Submission } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";

const PAGE_SIZE = 5;

export function useSubmissions(username?: string) {
  const { showToast } = useToast();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<Submission[], Error>({
      queryKey: ["submissions", username],
      enabled: !!username,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined,
      queryFn: async ({ pageParam = 1 }) => {
        const token = localStorage.getItem("token");
        try {
          const { data } = await axios.get(
            `/api/submissions?page=${pageParam}&limit=${PAGE_SIZE}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return data;
        } catch (e) {
          const error = e as AxiosError;
          const errorMessage = error.response?.data as { error: string };
          showToast("error", errorMessage.error);
        }
      },
    });

  return {
    submissions: data?.pages.flat() || [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
