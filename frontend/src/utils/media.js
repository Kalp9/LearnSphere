export const mediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const serverBase = apiBase.replace(/\/api\/?$/, "");
  return `${serverBase}${path.startsWith("/") ? path : `/${path}`}`;
};
