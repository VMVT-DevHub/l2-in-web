import { TableData, TableRow } from '@aplinkosministerija/design-system';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { intersectionObserverConfig } from './configs';
import { handleError } from './functions';

export const useInfinityLoad = (
  queryKey: string,
  fn: (params: { page: number }) => any,
  observerRef: any,
  filters = {},
  enabled = true,
) => {
  const queryFn = async (page: number) => {
    const data = await fn({
      ...filters,
      page,
    });
    return {
      ...data,
      data: data.rows,
    };
  };

  const result = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam }: any) => queryFn(pageParam),
    getNextPageParam: (lastPage: any) => {
      return lastPage?.page < lastPage?.totalPages ? lastPage.page + 1 : undefined;
    },
    enabled,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = result;
  useEffect(() => {
    const currentObserver = observerRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, intersectionObserverConfig);

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data, observerRef]);

  return result;
};

interface TableDataProp {
  endpoint: () => Promise<any>;
  mapData: (props: any) => TableRow[];
  dependencyArray: any[];
  name: string;
  enabled?: boolean;
}

export const useTableData = ({
  endpoint,
  mapData,
  dependencyArray,
  name,
  enabled = true,
}: TableDataProp) => {
  const [tableData, setTableData] = useState<TableData>({ data: [] });

  const { isFetching } = useQuery([name, ...dependencyArray], () => endpoint(), {
    onError: () => {
      handleError();
    },
    onSuccess: (list) => {
      setTableData({
        data: mapData(list?.rows || []),
        totalPages: list?.totalPages,
      });
    },
    enabled,
    refetchOnWindowFocus: false,
  });

  return { tableData, loading: isFetching };
};
