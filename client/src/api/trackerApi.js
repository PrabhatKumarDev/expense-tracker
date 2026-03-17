import apiClient from "./apiClient";

export const getTrackers = async () => {
  const response = await apiClient.get("/trackers");
  return response.data;
};

export const createTracker = async (formData) => {
  const response = await apiClient.post("/trackers", formData);
  return response.data;
};

export const updateTracker = async (id, formData) => {
  const response = await apiClient.put(`/trackers/${id}`, formData);
  return response.data;
};

export const deleteTracker = async (id) => {
  const response = await apiClient.delete(`/trackers/${id}`);
  return response.data;
};