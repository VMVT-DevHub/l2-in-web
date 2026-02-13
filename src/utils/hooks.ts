import { TableRow } from '@aplinkosministerija/design-system';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { UserContext, UserContextType } from '../components/UserProvider';
import api from './api';
import { intersectionObserverConfig } from './configs';
import { getFilteredOptions, handleError } from './functions';

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

export const useTableData = ({ endpoint, mapData, dependencyArray, name }: TableDataProp) => {
  const { isFetching, data } = useQuery([name, ...dependencyArray], () => endpoint(), {
    onError: () => {
      handleError();
    },
  });

  return {
    tableData: {
      data: mapData(data?.rows || []),
      totalPages: data?.totalPages || 1,
    },
    loading: isFetching,
  };
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

export const useKeyAction = (action: (option?: any) => void, disabled = false) => {
  return useCallback(
    (option?: any) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !disabled) {
        e.stopPropagation();
        action(option);
      }
    },
    [action, disabled],
  );
};

export const useSelectData = ({
  options,
  disabled,
  onChange,
  getOptionLabel,
  refreshOptions,
  dependantId,
  value,
}) => {
  const [input, setInputValue] = useState<any>(null);
  const [showSelect, setShowSelect] = useState(false);
  const [suggestions, setSuggestions] = useState(options);
  const [loading, setLoading] = useState(false);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
      setInputValue('');
    }
  };

  const handleSetOptions = async () => {
    if (!refreshOptions) return;
    setLoading(true);
    await refreshOptions(dependantId);
    setLoading(false);
  };

  useEffect(() => {
    if (!showSelect || options?.length) return;
    handleSetOptions();
  }, [showSelect]);

  useEffect(() => {
    if (typeof dependantId === 'undefined') return;
    handleSetOptions();
  }, [dependantId]);

  useEffect(() => {
    const canClearValue =
      !disabled && dependantId && !options?.some((option) => option?.id === value?.id);

    if (canClearValue) {
      onChange(null);
    }

    setSuggestions(options);
  }, [options]);

  const handleClick = (option: any) => {
    setShowSelect(false);
    setInputValue('');

    if (value && getOptionLabel(value) === getOptionLabel(option)) return;

    onChange(option);
  };

  const handleOnChange = (input) => {
    if (!options) return;

    if (input) {
      setShowSelect(true);
    }
    setInputValue(input);
    setSuggestions(getFilteredOptions(options, input, getOptionLabel));
  };

  const handleToggleSelect = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !disabled && setShowSelect(!showSelect);
  };

  return {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange,
    loading,
  };
};
