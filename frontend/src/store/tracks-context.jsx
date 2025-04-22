import { createContext, useEffect, useState } from "react";
import { fetchTracks } from "../api/tracks-api";

export const TracksContext = createContext({
  tracks: [],
  loading: true,
  currentPage: 1,
  setCurrentPage: () => {},
  addTrack: () => {},
  handleDeleteTrack: () => {},
  updateTrack: () => {}
});

export function TracksProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadTracks = async (currentPage) => {
    try {
      const data = await fetchTracks(currentPage);
      setTracks(data);
    } catch (error) {
      console.error("Error fetching tracks:", error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracks(currentPage);
  }, [currentPage]);

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
    setCurrentPage,
    addTrack,
    handleDeleteTrack,
    updateTrack
  };

  return <TracksContext value={ContextValue}>{children}</TracksContext>;
}
