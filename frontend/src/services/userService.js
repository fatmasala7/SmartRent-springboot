import api from "./api";

export const getMe = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

export const updateMe = async (profileData) => {
  const { data } = await api.put("/users/me", profileData);
  return data;
};
