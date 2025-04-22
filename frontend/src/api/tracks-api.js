import axios from "../api/axios-instance";

export async function createTrack(trackData) {
  const response = await axios.post("/tracks", trackData);
  return response.data;
}

export async function fetchTracks(page = 1) {
  const response = await axios.get(`/tracks?page=${page}&limit=10`);
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
