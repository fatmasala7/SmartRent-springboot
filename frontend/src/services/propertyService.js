import api from "./api";

// ── Public ─────────────────────────────────────────────────────────────────
export const getAllProperties = async () => {
  const { data } = await api.get("/properties");
  return data;
};

export const getPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export const searchProperties = async (params = {}) => {
  const { data } = await api.get("/properties/search", { params });
  return data;
};

// ── Landlord ───────────────────────────────────────────────────────────────
export const getMyProperties = async () => {
  const { data } = await api.get("/properties/my");
  return data;
};

export const createProperty = async (propertyData) => {
  const { data } = await api.post("/properties", propertyData);
  return data;
};

export const updateProperty = async (id, propertyData) => {
  const { data } = await api.put(`/properties/${id}`, propertyData);
  return data;
};

export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
};

export const addPropertyImage = async (propertyId, imageData) => {
  const { data } = await api.post(`/properties/${propertyId}/images`, imageData);
  return data;
};

export const deletePropertyImage = async (propertyId, imageId) => {
  const { data } = await api.delete(`/properties/${propertyId}/images/${imageId}`);
  return data;
};

export const addPropertyAmenity = async (propertyId, amenityId) => {
  const { data } = await api.post(`/properties/${propertyId}/amenities/${amenityId}`);
  return data;
};

export const removePropertyAmenity = async (propertyId, amenityId) => {
  const { data } = await api.delete(`/properties/${propertyId}/amenities/${amenityId}`);
  return data;
};

// ── Amenities ──────────────────────────────────────────────────────────────
export const getAllAmenities = async () => {
  const { data } = await api.get("/amenities");
  return data;
};
