import apiClient from "./apiClient";

export const getBudget = async (trackerId, month) => {
  const response = await apiClient.get("/budgets", {
    params: { trackerId, month },
  });
  return response.data;
};

export const setBudget = async (formData) => {
  const response = await apiClient.post("/budgets", formData);
  return response.data;
};