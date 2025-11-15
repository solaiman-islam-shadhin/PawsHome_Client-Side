import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Pet API
export const petAPI = {
  getAllPets: (params) => api.get('/pets', { params }),
  getPetById: (id) => api.get(`/pets/${id}`),
  createPet: (data) => api.post('/pets', data),
  updatePet: (id, data) => api.put(`/pets/${id}`, data),
  deletePet: (id) => api.delete(`/pets/${id}`),
  adoptPet: (id, data) => api.post(`/pets/${id}/adopt`, data),
  markAsAdopted: (id) => api.patch(`/pets/${id}/adopted`),
  getMyPets: (params) => api.get('/pets/user/my-pets', { params }),
  getAllPetsAdmin: () => api.get('/pets/admin/all'),
};

// Donation API
export const donationAPI = {
  getAllCampaigns: (params) => api.get('/donations', { params }),
  getCampaignById: (id) => api.get(`/donations/${id}`),
  createCampaign: (data) => api.post('/donations', data),
  updateCampaign: (id, data) => api.put(`/donations/${id}`, data),
  deleteCampaign: (id) => api.delete(`/donations/${id}`),
  pauseCampaign: (id) => api.patch(`/donations/${id}/pause`),
  donate: ({ campaignId, ...data }) => api.post(`/donations/${campaignId}/donate`, data),
  refundDonation: (id) => api.delete(`/donations/${id}/refund`),
  getMyCampaigns: () => api.get('/donations/user/my-campaigns'),
  getMyDonations: () => api.get('/donations/user/my-donations'),
  getAllCampaignsAdmin: () => api.get('/donations/admin/all'),
  getRecommendations: (id) => api.get(`/donations/${id}/recommended`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  makeAdmin: (id) => api.patch(`/users/${id}/make-admin`),
  banUser: (id) => api.patch(`/users/${id}/ban`),
};

// Adoption API
export const adoptionAPI = {
  createAdoptionRequest: (data) => api.post('/adoptions', data),
  getMyRequests: () => api.get('/adoptions/my-requests'),
  getRequestsForMyPets: () => api.get('/adoptions/for-my-pets'),
  acceptRequest: (id) => api.patch(`/adoptions/${id}/accept`),
  rejectRequest: (id) => api.patch(`/adoptions/${id}/reject`),
};

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Image upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData
  );
  
  return response.data.data.url;
};