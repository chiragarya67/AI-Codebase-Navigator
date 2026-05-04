import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-codebase-navigator-i5f3.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/signup")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ========================
// Auth API calls
// ========================
export const signupAPI = (data) => API.post("/auth/signup", data);
export const loginAPI = (data) => API.post("/auth/login", data);
export const getMeAPI = () => API.get("/auth/me");
// ========================
export const analyzeRepoAPI = (repoUrl) => API.post("/repo/analyze", { repoUrl });
export const getFileContentAPI = (owner, repo, path) =>
  API.post("/repo/file-content", { owner, repo, path });

// ========================
// AI API calls
// ========================
export const explainFileAPI = (fileName, fileContent) =>
  API.post("/ai/explain", { type: "file", fileName, fileContent });

export const explainStructureAPI = (repoName, treeStructure) =>
  API.post("/ai/explain", { type: "structure", repoName, treeStructure });

export const askQuestionAPI = (question, context) =>
  API.post("/ai/question", { question, context });

export default API;
