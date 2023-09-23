import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";
// import queryKeys from "@/api/pockets/queryKeys"
// import { useQueryPocketBase } from "@/pockets/useQueryPocketBase"
import {useQueryPocketBase} from "@/api/pockets/useQueryPocketBase";
import {getPagination} from "@/api/pockets";

const usePaginationQuery = ({
  pageKey = "page",
  perPage = 50,
  queryKey,
  dependency,
  options = {},
}) => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(
    () => Number(urlSearchParams.get(pageKey)) ?? 1
  );
  // const [page, setPage] = useState(1)

  const {isLoading, isPreviousData, data, error, refetch} = useQueryPocketBase(
    queryKey,
    page,
    perPage,
    dependency,
    options
  );

  // dependency가 바뀌면 page를 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [dependency]);

  useEffect(() => {
    if (data) {
      const {page, totalPages} = data;
      const hasPreviousData = 1 < page;
      const hasNextData = page < totalPages;
      if (!isPreviousData && hasNextData) {
        const nextPageIndex = page + 1;
        queryClient.prefetchQuery({
          queryKey: [queryKey, nextPageIndex],
          queryFn: () =>
            getPagination(queryKey, nextPageIndex, perPage, options),
        });
      }
      if (hasPreviousData) {
        const previousPageIndex = page - 1;
        queryClient.prefetchQuery({
          queryKey: [queryKey, previousPageIndex],
          queryFn: () =>
            getPagination(queryKey, previousPageIndex, perPage, options),
        });
      }
    }
  }, [data, isPreviousData, page, queryClient]);

  const changePage = (pageIndex, e) => {
    e.preventDefault();
    setUrlSearchParams({page: pageIndex});
    setPage(pageIndex);
  };

  const gotoFirstPage = (e) => {
    e.preventDefault();
    const firstPageIndex = 1;
    setUrlSearchParams({page: firstPageIndex});
    setPage(firstPageIndex);
  };

  const gotoPreviousPage = (e) => {
    e.preventDefault();
    let previousPageIndex = page - 1;
    previousPageIndex = previousPageIndex < 1 ? 1 : previousPageIndex;
    setUrlSearchParams({page: previousPageIndex});
    setPage(previousPageIndex);
  };

  const gotoNextPage = (e) => {
    e.preventDefault();
    const lastPageIndex = data.totalPages;
    let nextPageIndex = page + 1;
    nextPageIndex =
      nextPageIndex > lastPageIndex ? lastPageIndex : nextPageIndex;
    setUrlSearchParams({page: nextPageIndex});
    setPage(nextPageIndex);
  };

  const gotoLastPage = (e) => {
    e.preventDefault();
    const lastPageIndex = data.totalPages;
    setUrlSearchParams({page: lastPageIndex});
    setPage(lastPageIndex);
  };

  return {
    isLoading,
    error,
    page,
    data,
    gotoFirstPage,
    gotoLastPage,
    gotoPreviousPage,
    gotoNextPage,
    changePage,
    refetch,
  };
};

export default usePaginationQuery;
