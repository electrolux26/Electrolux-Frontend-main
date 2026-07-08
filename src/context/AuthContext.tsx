/**
 * Authentication Context backed by MSAL (@azure/msal-browser + @azure/msal-react)
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import type { AccountInfo } from '@azure/msal-browser';
import { loginRequest, logoutRequest } from '../authConfig';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  displayName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (demoUser?: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const accountToUser = (account: AccountInfo | null): AuthUser | null => {
  if (!account) return null;
  return {
    id: account.localAccountId || account.homeAccountId,
    email: account.username,
    name: account.name || account.username,
    displayName: account.name || account.username,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { instance } = useMsal();
  const msalAuthenticated = useIsAuthenticated();
  const [demoAuthenticated, setDemoAuthenticated] = useState(false);
  const isAuthenticated = msalAuthenticated || demoAuthenticated;
  const [user, setUser] = useState<AuthUser | null>(() => {
    const accounts = instance.getAllAccounts();
    return accountToUser(accounts[0] || null);
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const accounts = instance.getAllAccounts();
    setUser(accountToUser(accounts[0] || null));
  }, [instance, msalAuthenticated]);

  const login = useCallback(async (demoUser?: AuthUser) => {
    setIsLoading(true);
    try {
      if (demoUser) {
        setUser(demoUser);
        setDemoAuthenticated(true);
        return;
      }

      const result = await instance.loginPopup({
        ...loginRequest,
        prompt: 'select_account',
      });
      setUser(accountToUser(result.account || instance.getAllAccounts()[0] || null));
    } catch (error) {
      console.error('MSAL login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [instance]);

  const logout = useCallback(async () => {
    try {
      if (demoAuthenticated) {
        setDemoAuthenticated(false);
        setUser(null);
        return;
      }

      await instance.logoutPopup(logoutRequest);
      setUser(null);
    } catch (error) {
      console.error('MSAL logout failed', error);
      throw error;
    }
  }, [instance, demoAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
