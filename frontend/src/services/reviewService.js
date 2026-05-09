import api from "./api";

export const getPropertyReviews = async (propertyId) => {
  const { data } = await api.get(`/properties/${propertyId}/reviews`);
  return data;
};

export const getMyReviews = async () => {
  const { data } = await api.get("/reviews/my");
  return data;
};

export const createReview = async (reviewData) => {
  const { data } = await api.post("/reviews", reviewData);
  return data;
};

export const deleteReview = async (reviewId) => {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
};

export const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
};
