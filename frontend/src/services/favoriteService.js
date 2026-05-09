import api from "./api";

export const getMyFavorites = async () => {
  const { data } = await api.get("/favorites/my");
  return data;
};

export const addFavorite = async (propertyId) => {
  const { data } = await api.post(`/favorites/${propertyId}`);
  return data;
};

export const removeFavorite = async (propertyId) => {
  const { data } = await api.delete(`/favorites/${propertyId}`);
  return data;
};

// Legacy localStorage helpers kept as fallback for non-auth pages
export const isFavorite = (favorites, propertyId) =>
  favorites.some((f) => f.propertyID === propertyId);
