import { TableData, TableRow } from '@aplinkosministerija/design-system';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { UserContext, UserContextType } from '../components/UserProvider';
import api from './api';
import { intersectionObserverConfig } from './configs';
import { handleError } from './functions';

const cookies = new Cookies();

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

export const useGetCurrentProfile = () => {
  const { user } = useContext<UserContextType>(UserContext);
  const profileId = cookies.get('profileId');
  const currentProfile = user?.profiles?.find((profile) => profile.id == profileId);
  return currentProfile;
};

export const useOptions = ({
  schema,
  uischema,
}: {
  schema: JsonSchema;
  uischema: UISchemaElement;
}) => {
  const fetchOptionsFrom = uischema?.options?.fetchOptionsFrom;

  const queryConfig = {
    onError: handleError,
    enabled: !!fetchOptionsFrom,
    refetchOnWindowFocus: false,
  };

  const { data = [] } = useQuery(
    [fetchOptionsFrom],
    () => api.get({ resource: fetchOptionsFrom }),
    queryConfig,
  );

  return fetchOptionsFrom ? data : schema?.enum || [];
};

