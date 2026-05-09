import api from "./api";

// ── Visit Requests ─────────────────────────────────────────────────────────
export const createVisitRequest = async (visitData) => {
  const { data } = await api.post("/visits", visitData);
  return data;
};

export const getMyVisits = async () => {
  const { data } = await api.get("/visits/my");
  return data;
};

export const getLandlordVisits = async (propertyIds) => {
  if (!propertyIds || propertyIds.length === 0) return [];
  const queryString = propertyIds.map((id) => `propertyIds=${id}`).join("&");
  const { data } = await api.get(`/visits/landlord?${queryString}`);
  return data;
};

export const acceptVisit = async (id) => {
  const { data } = await api.put(`/visits/${id}/accept`);
  return data;
};

export const rejectVisit = async (id) => {
  const { data } = await api.put(`/visits/${id}/reject`);
  return data;
};

// ── Rental Applications ────────────────────────────────────────────────────
export const createApplication = async (applicationData) => {
  const { data } = await api.post("/applications", applicationData);
  return data;
};

export const getMyApplications = async () => {
  const { data } = await api.get("/applications/my");
  return data;
};

export const getLandlordApplications = async () => {
  const { data } = await api.get("/applications/landlord");
  return data;
};

export const getApplicationById = async (id) => {
  const { data } = await api.get(`/applications/${id}`);
  return data;
};

export const acceptApplication = async (id) => {
  const { data } = await api.put(`/applications/${id}/accept`);
  return data;
};

export const rejectApplication = async (id) => {
  const { data } = await api.put(`/applications/${id}/reject`);
  return data;
};

// ── Application Documents ──────────────────────────────────────────────────
export const addDocument = async (applicationId, documentData) => {
  const { data } = await api.post(`/applications/${applicationId}/documents`, documentData);
  return data;
};

export const getDocuments = async (applicationId) => {
  const { data } = await api.get(`/applications/${applicationId}/documents`);
  return data;
};

export const deleteDocument = async (applicationId, documentId) => {
  const { data } = await api.delete(`/applications/${applicationId}/documents/${documentId}`);
  return data;
};

// ── Rentals ────────────────────────────────────────────────────────────────
export const getMyRentals = async () => {
  const { data } = await api.get("/rentals/my");
  return data;
};

export const getLandlordRentals = async (propertyIds) => {
  const { data } = await api.get("/rentals/landlord", {
    params: { propertyIds },
    paramsSerializer: (params) =>
      params.propertyIds.map((id) => `propertyIds=${id}`).join("&"),
  });
  return data;
};

export const getRentalById = async (id) => {
  const { data } = await api.get(`/rentals/${id}`);
  return data;
};
