
import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useLoadingState = (initialState: Partial<LoadingState> = {}) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    success: false,
    ...initialState
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: null, success: false }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false, success: false }));
  }, []);

  const setSuccess = useCallback((success: boolean) => {
    setState(prev => ({ ...prev, success, isLoading: false, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, success: false });
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: any) => void;
      successMessage?: string;
    }
  ): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await asyncFunction();
      setSuccess(true);
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
      options?.onError?.(error);
      return null;
    }
  }, [setLoading, setError, setSuccess]);

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    reset,
    executeAsync
  };
};
