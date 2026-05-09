import api from "./api";

export const loginUser = async (loginData) => {
  const { data } = await api.post("/auth/login", loginData);
  return data;
};

export const registerUser = async (userData) => {
  const payload = {
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phoneNumber,
    nationalOrPassportID: userData.nationalOrPassportID,
    role: userData.role,
    profileImage: userData.profileImage || null,
  };

  const { data } = await api.post("/auth/register", payload);
  return data;
};
