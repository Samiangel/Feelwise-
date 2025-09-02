import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface EmotionAnalysis {
  id: string;
  emotion: string;
  confidence: number;
  intensity: string;
  quote: string;
  musicRecommendation: string;
  timestamp: string;
  inputText: string;
  inputType: 'text' | 'voice';
}

interface AppState {
  currentAnalysis: EmotionAnalysis | null;
  history: EmotionAnalysis[];
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_ANALYSIS'; payload: EmotionAnalysis }
  | { type: 'ADD_TO_HISTORY'; payload: EmotionAnalysis }
  | { type: 'SET_HISTORY'; payload: EmotionAnalysis[] }
  | { type: 'CLEAR_CURRENT_ANALYSIS' };

const initialState: AppState = {
  currentAnalysis: null,
  history: [],
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload, error: null };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'CLEAR_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: null };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
  analyzeEmotion: (text: string, type: 'text' | 'voice', language?: string) => Promise<void>;
  loadHistory: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const analyzeEmotion = async (text: string, type: 'text' | 'voice', language?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, type, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to analyze emotion');
      }

      const result = await response.json();
      const analysis: EmotionAnalysis = {
        ...result,
        inputText: text,
        inputType: type,
      };

      dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: analysis });
      dispatch({ type: 'ADD_TO_HISTORY', payload: analysis });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const history = await response.json();
        dispatch({ type: 'SET_HISTORY', payload: history });
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const value = {
    ...state,
    dispatch,
    analyzeEmotion,
    loadHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
