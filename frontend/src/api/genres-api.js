import axios from "./axios-instance";

export async function fetchGenres(){
    const response = await axios.get('/genres')
    return response.data
}