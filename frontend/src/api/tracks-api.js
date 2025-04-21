import axios from '../api/axios-instance'

export async function createTrack(trackData){
    const response = await axios.post('/tracks', trackData);
    return response.data;
}

export async function fetchTracks(){
    const response = await axios.get('/tracks');
    return response.data
}

export async function deleteTrack(id) {
    await axios.delete(`/tracks/${id}`, {
      data: { id },
    });
}

export async function uploadTrackAudio(id, audioFile){
    const formData = new FormData();
    formData.append('file', audioFile)

    const response = await axios.post(`/tracks/${id}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
}