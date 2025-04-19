import { createContext, useEffect, useState } from "react";
import { fetchTracks } from "../api/tracks-api";

export const TracksContext = createContext({
  tracks: [],
  loading: true,
  addTrack: () => {}
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
        data: [newTrack, ...(prevTracks?.data || [])]
    }))
  }

  const ContextValue = {
    tracks,
    loading,
    addTrack
  }

  return <TracksContext value={ContextValue}>{children}</TracksContext>
}
