import api from "./api";

export const getMyNotifications = async () => {
  const { data } = await api.get("/notifications/my");
  return data;
};

export const markAsRead = async (notificationId) => {
  const { data } = await api.put(`/notifications/${notificationId}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await api.put("/notifications/read-all");
  return data;
};

export const deleteNotification = async (notificationId) => {
  const { data } = await api.delete(`/notifications/${notificationId}`);
  return data;
};

export const getUnreadCount = (notifications) =>
  (notifications || []).filter((n) => !n.isRead).length;
