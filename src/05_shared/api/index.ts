import { QueryClient } from "@tanstack/react-query";

const baseUrl = "http://localhost:5000";
// const baseUrl = "http://localhost:5001";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});
export const baseFetch = async (url: string, init?: RequestInit) => {
  try {
    const response = await fetch(baseUrl + "/" + url, init);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("An error occurred while fetching data:", error);
      throw new Error(`Fetch error: ${error.message}`);
    } else {
      throw error;
    }
  }
};
