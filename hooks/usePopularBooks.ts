import { useQuery } from "@tanstack/react-query";
import { fetchPopularBooks } from "@/api/fetchPopularBooks";

const usePopularBooks = (category: string) => {
  return useQuery({
    queryKey: ["popularBooks", category],
    queryFn: () => fetchPopularBooks(category),
    refetchOnWindowFocus: false,
    enabled: true,
  });
};

export default usePopularBooks;
