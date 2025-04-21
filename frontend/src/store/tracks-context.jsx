import { createContext, useEffect, useState } from "react";
import { fetchTracks } from "../api/tracks-api";

export const TracksContext = createContext({
  tracks: [],
  loading: true,
  addTrack: () => {},
  handleDeleteTrack: () => {},
  updateTrack: () => {}
});

export function TracksProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const data = await fetchTracks();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching tracks:", error.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

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
    addTrack,
    handleDeleteTrack,
    updateTrack
  };

  return <TracksContext value={ContextValue}>{children}</TracksContext>;
}
