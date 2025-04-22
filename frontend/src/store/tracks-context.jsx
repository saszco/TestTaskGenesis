import { createContext, useEffect, useState } from "react";
import { fetchTracks } from "../api/tracks-api";
import { fetchGenres } from "../api/genres-api";

export const TracksContext = createContext({
  tracks: [],
  genres: [],
  loading: true,
  currentPage: 1,
  sortBy: null,
  order: null,
  setCurrentPage: () => {},
  setSortBy: () => {},
  setOrder: () => {},
  setSelectedGenresForFilter: () => {},
  addTrack: () => {},
  handleDeleteTrack: () => {},
  updateTrack: () => {}
});

export function TracksProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState();
  const [order, setOrder] = useState();
  const [selectedGenresForFilter, setSelectedGenresForFilter] = useState([])

  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      try {
        const data = await fetchTracks({page: currentPage, sortBy, order, genre: selectedGenresForFilter});
        setTracks(data);
      } catch (error) {
        console.error("Error fetching tracks:", error.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if ((sortBy && order) || (!sortBy && !order)) {
      loadTracks();
    }
  }, [currentPage, order, sortBy, selectedGenresForFilter]);

  useEffect(() => {
    const loadGenres = async () => {
      setLoading(true);
      try {
        const data = await fetchGenres();
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenresForFilter])

  const addTrack = (newTrack) => {
    setTracks((prevTracks) => ({
      ...prevTracks,
      data: [newTrack, ...(prevTracks?.data || [])],
    }));
  };

  const handleDeleteTrack = (trackId) => {
    setTracks((prevTracks) => ({
      ...prevTracks,
      data: prevTracks?.data.filter((track) => track.id !== trackId),
    }));
  };

  const updateTrack = (id, newData) => {
    setTracks((prevTracks => ({
      ...prevTracks,
      data: prevTracks?.data.map((track) => 
        track.id === id ? { ...track, ...newData} : track)
    })))
  }

  const ContextValue = {
    tracks,
    genres, 
    loading,
    currentPage,
    sortBy,
    order,
    setCurrentPage,
    setSortBy,
    setOrder,
    setSelectedGenresForFilter,
    addTrack,
    handleDeleteTrack,
    updateTrack,
  };

  return <TracksContext value={ContextValue}>{children}</TracksContext>;
}
