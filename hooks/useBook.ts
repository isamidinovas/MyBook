import { fetchBook } from "@/api/fetchBook";
import { useQuery } from "@tanstack/react-query";

const useBook = (bookId: any) => {
  return useQuery({
    queryKey: ["book"],
    queryFn: () => fetchBook(bookId),
    enabled: !!bookId,
  });
};

export default useBook;
