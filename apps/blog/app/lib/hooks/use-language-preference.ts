import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "app/lib/query-keys";

const STORAGE_KEY = "showRussian";

/**
 * Gets the initial language preference from localStorage
 */
function getInitialPreference(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "true";
}

/**
 * Saves the language preference to localStorage
 */
function savePreference(showRussian: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(showRussian));
}

/**
 * Hook for managing language preference with React Query and localStorage
 */
export function useLanguagePreference() {
  const queryClient = useQueryClient();

  const { data: showRussian = false } = useQuery({
    queryKey: queryKeys.languagePreference,
    queryFn: () => getInitialPreference(),
    staleTime: Infinity, // Never refetch automatically
    gcTime: Infinity, // Keep in cache forever
  });

  const toggleLanguage = () => {
    const newValue = !showRussian;
    savePreference(newValue);
    queryClient.setQueryData(queryKeys.languagePreference, newValue);
  };

  return {
    showRussian,
    toggleLanguage,
  };
}
