import api from "./api";

export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const getPendingLandlords = async () => {
  const { data } = await api.get("/users/pending-landlords");
  return data;
};

export const approveLandlord = async (id) => {
  const { data } = await api.put(`/users/${id}/approve-landlord`);
  return data;
};

export const rejectLandlord = async (id) => {
  const { data } = await api.put(`/users/${id}/reject-landlord`);
  return data;
};

export const activateUser = async (id) => {
  const { data } = await api.put(`/users/${id}/activate`);
  return data;
};

export const deactivateUser = async (id) => {
  const { data } = await api.put(`/users/${id}/deactivate`);
  return data;
};

export const toggleUserStatus = async (id, isActive) => {
  if (isActive) return deactivateUser(id);
  return activateUser(id);
};

export const getPendingProperties = async () => {
  const { data } = await api.get("/properties/pending");
  return data;
};

export const approveProperty = async (id) => {
  const { data } = await api.put(`/properties/${id}/approve`);
  return data;
};

export const rejectProperty = async (id) => {
  const { data } = await api.put(`/properties/${id}/reject`);
  return data;
};
