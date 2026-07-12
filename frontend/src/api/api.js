import axios from 'axios';

const api = axios.create({
  // Use the same IPv4 loopback host that Uvicorn is started on. On some
  // Windows setups `localhost` resolves to IPv6 (`::1`) first, producing a
  // connection-refused error even while the backend is healthy on 127.0.0.1.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred while contacting the backend.';

    return Promise.reject(new Error(message));
  },
);

export const sendChat = async (message) => {
  const response = await api.post('/chat', { message });
  return response.data;
};

export const saveInteraction = async (payload) => {
  const response = await api.post('/interaction', payload);
  return response.data;
};

export const editInteraction = async (interactionId, payload) => {
  const response = await api.put(`/interaction/${interactionId}`, payload);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export default api;
