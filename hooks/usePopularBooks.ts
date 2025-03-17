import { useQuery } from "@tanstack/react-query";
import { fetchPopularBooks } from "@/api/fetchPopularBooks";

const usePopularBooks = (category?: string) => {
  return useQuery({
    queryKey: ["books", category],
    queryFn: () => fetchPopularBooks(category),
    refetchOnWindowFocus: false,
  });
};

export default usePopularBooks;
