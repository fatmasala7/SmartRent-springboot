import { createContext, useContext, useState, useCallback } from "react";
import { getMe, updateMe } from "../services/userService";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  const loadProfile = useCallback(() => {
    getMe().then(setProfile).catch(console.error);
  }, []);

  const saveProfile = useCallback((data) => {
    return updateMe(data).then((updated) => {
      setProfile(updated);
      return updated;
    });
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loadProfile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
