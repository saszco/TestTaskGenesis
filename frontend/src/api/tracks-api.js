import axios from "../api/axios-instance";

export async function createTrack(trackData) {
  const response = await axios.post("/tracks", trackData);
  return response.data;
}

export async function fetchTracks({ page = 1, limit = null, sortBy = null, order = null, genre = [], artist = null } = {}){
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (sortBy && order) {
    params.append('sort', sortBy);
    params.append('order', order);
  }
  if (genre.length > 0){
    params.append('genre', genre);
  }
  if(artist){
    params.append('artist', artist);
  }

  const response = await axios.get(`/tracks?${params.toString()}`);
  return response.data;
}

export async function deleteTrack(id) {
  await axios.delete(`/tracks/${id}`, {
    data: { id }, //look at this then later
  });
}

export async function uploadTrackAudio(id, audioFile) {
  const formData = new FormData();
  formData.append("file", audioFile);

  const response = await axios.post(`/tracks/${id}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateTrackData(id, trackData) {
  const response = await axios.put(`/tracks/${id}`, trackData);
  return response.data;
}

export async function deleteTrackAudio(id) {
  await axios.delete(`/tracks/${id}/file`);
}
