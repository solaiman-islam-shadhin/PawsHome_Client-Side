import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const petAPI = {
  getAllPets: (params) => api.get('/pets', { params }).then(res => res.data),
  getPetById: (id) => api.get(`/pets/${id}`).then(res => res.data),
  createPet: (data) => api.post('/pets', data).then(res => res.data),
  updatePet: (id, data) => api.put(`/pets/${id}`, data).then(res => res.data),
  deletePet: (id) => api.delete(`/pets/${id}`).then(res => res.data),
  markAsAdopted: (id) => api.patch(`/pets/${id}/adopted`).then(res => res.data),
  getMyPets: (params) => api.get('/pets/user/my-pets', { params }).then(res => res.data),
  getAllPetsAdmin: () => api.get('/pets/admin/all').then(res => res.data),
};

export const donationAPI = {
  getAllCampaigns: (params) => api.get('/donations', { params }).then(res => res.data),
  getCampaignById: (id) => api.get(`/donations/${id}`).then(res => res.data),
  createCampaign: (data) => api.post('/donations', data).then(res => res.data),
  updateCampaign: (id, data) => api.put(`/donations/${id}`, data).then(res => res.data),
  deleteCampaign: (id) => api.delete(`/donations/${id}`).then(res => res.data),
  pauseCampaign: (id) => api.patch(`/donations/${id}/pause`).then(res => res.data),
  donate: ({ campaignId, ...data }) => api.post(`/donations/${campaignId}/donate`, data).then(res => res.data),
  refundDonation: ({ campaignId, donor }) => api.patch(`/donations/${campaignId}/refund`, { donor }).then(res => res.data),
  getMyCampaigns: () => api.get('/donations/user/my-campaigns').then(res => res.data),
  getMyDonations: () => api.get('/donations/user/my-donations').then(res => res.data),
  getAllCampaignsAdmin: () => api.get('/donations/admin/all').then(res => res.data),
  getRecommendations: (id) => api.get(`/donations/${id}/recommended`).then(res => res.data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile').then(res => res.data),
  updateProfile: (data) => api.put('/users/profile', data).then(res => res.data),
  getAllUsers: () => api.get('/users').then(res => res.data),
  makeAdmin: (id) => api.patch(`/users/${id}/make-admin`).then(res => res.data),
  banUser: (id) => api.patch(`/users/${id}/ban`).then(res => res.data),
};

export const adoptionAPI = {
  createAdoptionRequest: (data) => api.post('/adoptions', data).then(res => res.data),
  getMyRequests: () => api.get('/adoptions/my-requests').then(res => res.data),
  getRequestsForMyPets: () => api.get('/adoptions/for-my-pets').then(res => res.data),
  acceptRequest: (id) => api.patch(`/adoptions/${id}/accept`).then(res => res.data),
  rejectRequest: (id) => api.patch(`/adoptions/${id}/reject`).then(res => res.data),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data).then(res => res.data),
  getMe: () => api.get('/auth/me').then(res => res.data),
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData
  );
  
  return response.data.data.url;
};
