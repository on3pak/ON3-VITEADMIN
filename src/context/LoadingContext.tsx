import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoadingContextType {
  loading: boolean;
  setLoading: (v: boolean) => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const withLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await promise;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, withLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoading must be used within a LoadingProvider');
  return context;
};
