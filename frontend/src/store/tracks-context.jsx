import { createContext, useEffect, useState } from "react";
import { fetchTracks } from "../api/tracks-api";

export const TracksContext = createContext({
  tracks: [],
  loading: true,
  currentPage: 1,
  sortBy: null,
  order: null,
  setCurrentPage: () => {},
  setSortBy: () => {},
  setOrder: () => {},
  addTrack: () => {},
  handleDeleteTrack: () => {},
  updateTrack: () => {}
});

export function TracksProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState();
  const [order, setOrder] = useState();

  const loadTracks = async () => {
    setLoading(true);
    try {
      const data = await fetchTracks({page: currentPage, sortBy, order});
      setTracks(data);
    } catch (error) {
      console.error("Error fetching tracks:", error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((sortBy && order) || (!sortBy && !order)) {
      loadTracks();
    }
  }, [currentPage, order, sortBy]);

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
    loading,
    currentPage,
    sortBy,
    order,
    setCurrentPage,
    setSortBy,
    setOrder,
    addTrack,
    handleDeleteTrack,
    updateTrack,
  };

  return <TracksContext value={ContextValue}>{children}</TracksContext>;
}
