import { createContext, useEffect, useState } from "react";
import { fetchTracks } from "../api/tracks-api";
import { fetchGenres } from "../api/genres-api";

export const TracksContext = createContext({
  initialTracks: [],
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
  setSelectedArtistForFilter: () => {},
  addTrack: () => {},
  handleDeleteTrack: () => {},
  updateTrack: () => {}
});

export function TracksProvider({ children }) {
  const [initialTracks, setInitialTracks] = useState([])
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState();
  const [order, setOrder] = useState();
  const [selectedGenresForFilter, setSelectedGenresForFilter] = useState([])
  const [selectedArtistForFilter, setSelectedArtistForFilter] = useState()

  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      try {
        const data = await fetchTracks({page: currentPage, limit: 10, sortBy, order, genre: selectedGenresForFilter, artist: selectedArtistForFilter});
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
  }, [currentPage, order, sortBy, selectedGenresForFilter, selectedArtistForFilter]);

  useEffect(() => {
    const loadInitialTracks = async (totalTracksCount) => {
      try{
        const data = await fetchTracks({page: 1, limit: totalTracksCount})
        setInitialTracks(data);
      }catch(error){
        console.error('Error fetching initial tracks:', error.message)
      }
    }

    if(initialTracks.length === 0 && tracks.meta?.total){
      loadInitialTracks(tracks.meta.total);
    } 
  }, [tracks])

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
    initialTracks,
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
    setSelectedArtistForFilter,
    addTrack,
    handleDeleteTrack,
    updateTrack,
  };

  return <TracksContext value={ContextValue}>{children}</TracksContext>;
}
