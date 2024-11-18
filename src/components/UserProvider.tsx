import { useIsOnline, useStorage } from '@aplinkosministerija/design-system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
import { User } from '../types';
import api from '../utils/api';
import { slugs } from '../utils/routes';

const cookies = new Cookies();

export type UserContextType = {
  user: User | null;
  error: Error | null;
  isLoading: boolean;
  loggedIn: boolean;
  eGateLogin: any;
  login: any;
  logout: any;
};

interface UpdateTokenProps {
  token?: string;
  error?: string;
  message?: string;
  refreshToken?: string;
}

const defaultValue: UserContextType = {
  user: null,
  error: null,
  isLoading: true,
  loggedIn: false,
  eGateLogin: () => {},
  login: () => {},
  logout: () => {},
};

export const UserContext: any = createContext<UserContextType>(defaultValue);
const handleUpdateTokens = (data: UpdateTokenProps) => {
  const { token, refreshToken, error } = data;
  if (token) {
    cookies.set('token', `${token}`, {
      path: '/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
    });
  }

  if (refreshToken) {
    cookies.set('refreshToken', `${refreshToken}`, {
      path: '/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 30),
    });
  }

  if (error) {
    return { error };
  }
};

export const UserProvider = ({ children }: any) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isOnline = useIsOnline();

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery(['user'], () => api.getUserInfo(), {
    onError: ({ response }: any) => {
      if (response?.status === 401) {
        cookies.remove('token', { path: '/' });
        cookies.remove('refreshToken', { path: '/' });
      }
    },
    enabled: isOnline,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const eGateLogin = useMutation(api.eGatesSign, {
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    retry: false,
  });

  const error = userError;
  const loggedIn = !!user?.id && !userError;

  const handleLogout = async () => {
    navigate(slugs.login);
    await queryClient.invalidateQueries();
  };

  const { mutateAsync: logout } = useMutation(() => api.logout(), {
    onError: handleLogout,
    onSuccess: handleLogout,
  });

  const isLoading = [userLoading].some((loading) => loading);

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        isLoading,
        loggedIn,
        eGateLogin,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
