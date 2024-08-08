import { fetchBooks } from "@/api/fetchbooks";
import { useQuery } from "@tanstack/react-query";

const useSearchBooks = (search: string, category: string) => {
  return useQuery({
    queryKey: ["books", search, category],
    queryFn: () => fetchBooks(search, category),
    enabled: !!search,
  });
};

export default useSearchBooks;
