import { createContext, useEffect, useState } from "react";
import { fetchGenres } from "../api/genres-api";

export const GenresContext = createContext({
  genres: [],
  loading: true,
});

export function GenresProvider({ children }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setLoading(true);
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  const ContextValue = {
    genres,
    loading,
  };

  return <GenresContext value={ContextValue}>{children}</GenresContext>;
}
