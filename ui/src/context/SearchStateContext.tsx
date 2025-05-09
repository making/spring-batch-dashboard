import { createContext, useState, useContext, ReactNode } from 'react';
import { JobInstancesParams, JobExecutionsParams } from '../types/batch';

interface SearchState {
  jobInstances: JobInstancesParams;
  jobExecutions: JobExecutionsParams;
}

interface SearchStateContextType {
  searchState: SearchState;
  setJobInstancesState: (params: JobInstancesParams) => void;
  setJobExecutionsState: (params: JobExecutionsParams) => void;
  clearJobInstancesState: () => void;
  clearJobExecutionsState: () => void;
}

const defaultState: SearchState = {
  jobInstances: {
    page: 0,
    size: 20,
    sort: "jobInstanceId,desc",
  },
  jobExecutions: {
    page: 0,
    size: 20, 
    sort: "startTime,desc",
  }
};

const SearchStateContext = createContext<SearchStateContextType | undefined>(undefined);

export function SearchStateProvider({ children }: { children: ReactNode }) {
  const [searchState, setSearchState] = useState<SearchState>(defaultState);

  const setJobInstancesState = (params: JobInstancesParams) => {
    setSearchState(prev => ({ ...prev, jobInstances: params }));
  };

  const setJobExecutionsState = (params: JobExecutionsParams) => {
    setSearchState(prev => ({ ...prev, jobExecutions: params }));
  };

  const clearJobInstancesState = () => {
    setSearchState(prev => ({ 
      ...prev, 
      jobInstances: defaultState.jobInstances 
    }));
  };

  const clearJobExecutionsState = () => {
    setSearchState(prev => ({
      ...prev,
      jobExecutions: defaultState.jobExecutions
    }));
  };

  return (
    <SearchStateContext.Provider value={{ 
      searchState, 
      setJobInstancesState, 
      setJobExecutionsState,
      clearJobInstancesState,
      clearJobExecutionsState
    }}>
      {children}
    </SearchStateContext.Provider>
  );
}

export function useSearchState() {
  const context = useContext(SearchStateContext);
  if (context === undefined) {
    throw new Error('useSearchState must be used within a SearchStateProvider');
  }
  return context;
}
