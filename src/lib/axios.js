import axios from 'axios';

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

const instance = axios.create({
  baseURL: apiUrl,
});

instance.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      const status = error.response?.status;
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        const message = error.response?.data?.message || error.message;
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error(message);
        });
      }
    }
    return Promise.reject(error);
  }
);

export default instance;