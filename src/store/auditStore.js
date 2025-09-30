import { create } from 'zustand';

const useAuditStore = create((set, get) => ({
  // State
  url: '',
  isLoading: false,
  results: {
    pageSpeed: null,
    metaTags: null,
    headings: null,
    images: null,
    mobileFriendly: null,
    keywordDensity: null,
  },
  error: null,

  // Actions
  setUrl: (url) => set({ url }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setResult: (module, result) => 
    set(state => ({
      results: {
        ...state.results,
        [module]: result
      }
    })),
  
  clearResults: () => set({
    results: {
      pageSpeed: null,
      metaTags: null,
      headings: null,
      images: null,
      mobileFriendly: null,
      keywordDensity: null,
    },
    error: null
  }),

  // Get all results for PDF export
  getAllResults: () => get().results,
}));

export default useAuditStore;