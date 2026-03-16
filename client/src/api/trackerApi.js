import apiClient from "./apiClient";

export const getTrackers = async () => {
  const response = await apiClient.get("/trackers");
  return response.data;
};

export const createTracker = async (formData) => {
  const response = await apiClient.post("/trackers", formData);
  return response.data;
};