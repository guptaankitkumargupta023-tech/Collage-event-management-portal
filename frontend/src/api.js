import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:5000/api" });

export const deleteEvent = async(id) => {
    const response = await
    api.delete(`/events/${id}`);
    return response.data;
};
export default api;
