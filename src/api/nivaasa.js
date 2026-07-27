import axios from 'src/utils/axios';

// ==================== AUTH SERVICE ====================
export const authApi = {
  login: async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await axios.get('/api/auth/me');
    return res.data;
  },
  refresh: async (refreshToken) => {
    const res = await axios.post('/api/auth/refresh', { refreshToken });
    return res.data;
  },
  changePassword: async (oldPassword, newPassword) => {
    const res = await axios.put('/api/auth/change-password', { oldPassword, newPassword });
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await axios.post('/api/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (token, newPassword) => {
    const res = await axios.post('/api/auth/reset-password', { token, newPassword });
    return res.data;
  },
};

// ==================== SUPER ADMIN SERVICES ====================
export const superAdminApi = {
  getDashboard: async () => {
    const res = await axios.get('/api/super-admin/dashboard');
    return res.data;
  },
  createSociety: async (data) => {
    const res = await axios.post('/api/super-admin/societies', data);
    return res.data;
  },
  listSocieties: async (params) => {
    const res = await axios.get('/api/super-admin/societies', { params });
    return res.data;
  },
  getSociety: async (id) => {
    const res = await axios.get(`/api/super-admin/societies/${id}`);
    return res.data;
  },
  updateSociety: async (id, data) => {
    const res = await axios.put(`/api/super-admin/societies/${id}`, data);
    return res.data;
  },
  deleteSociety: async (id) => {
    const res = await axios.delete(`/api/super-admin/societies/${id}`);
    return res.data;
  },
  getPlans: async () => {
    const res = await axios.get('/api/super-admin/subscriptions');
    return res.data;
  },
  createPlan: async (data) => {
    const res = await axios.post('/api/super-admin/subscriptions', data);
    return res.data;
  },
  updatePlan: async (id, data) => {
    const res = await axios.put(`/api/super-admin/subscriptions/${id}`, data);
    return res.data;
  },
  getTickets: async (params) => {
    const res = await axios.get('/api/super-admin/support', { params });
    return res.data;
  },
  replyTicket: async (id, data) => {
    const res = await axios.post(`/api/super-admin/support/${id}/comment`, data);
    return res.data;
  },
  getTeam: async () => {
    const res = await axios.get('/api/super-admin/team');
    return res.data;
  },
  createTeam: async (data) => {
    const res = await axios.post('/api/super-admin/team', data);
    return res.data;
  },
};

// ==================== SOCIETY ADMIN SERVICES ====================
export const societyAdminApi = {
  getDashboard: async () => {
    const res = await axios.get('/api/society-admin/dashboard');
    return res.data;
  },
  setupWizard: async (data) => {
    const res = await axios.post('/api/society-admin/setup', data);
    return res.data;
  },
  updateProfile: async (formData) => {
    const res = await axios.put('/api/society-admin/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getProfile: async () => {
    const res = await axios.get('/api/society-admin/profile');
    return res.data;
  },
  getTowers: async () => {
    const res = await axios.get('/api/society-admin/towers');
    return res.data;
  },
  createTower: async (data) => {
    const res = await axios.post('/api/society-admin/towers', data);
    return res.data;
  },
  updateTower: async (id, data) => {
    const res = await axios.put(`/api/society-admin/towers/${id}`, data);
    return res.data;
  },
  deleteTower: async (id) => {
    const res = await axios.delete(`/api/society-admin/towers/${id}`);
    return res.data;
  },
  getFloors: async (towerId) => {
    const res = await axios.get(`/api/society-admin/towers/${towerId}/floors`);
    return res.data;
  },
  getFlats: async (params) => {
    const res = await axios.get('/api/society-admin/flats', { params });
    return res.data;
  },
  createFlat: async (data) => {
    const res = await axios.post('/api/society-admin/flats', data);
    return res.data;
  },
  bulkGenerateFlats: async (data) => {
    const res = await axios.post('/api/society-admin/flats/bulk', data);
    return res.data;
  },
  updateFlat: async (id, data) => {
    const res = await axios.put(`/api/society-admin/flats/${id}`, data);
    return res.data;
  },
  deleteFlat: async (id) => {
    const res = await axios.delete(`/api/society-admin/flats/${id}`);
    return res.data;
  },
  getResidents: async () => {
    const res = await axios.get('/api/society-admin/residents');
    return res.data;
  },
  onboardResident: async (data) => {
    const res = await axios.post('/api/society-admin/residents', data);
    return res.data;
  },
  updateResident: async (id, data) => {
    const res = await axios.put(`/api/society-admin/residents/${id}`, data);
    return res.data;
  },
  deleteResident: async (id) => {
    const res = await axios.delete(`/api/society-admin/residents/${id}`);
    return res.data;
  },
  getFamilyMembers: async (flatId) => {
    const res = await axios.get(`/api/society-admin/flats/${flatId}/family`);
    return res.data;
  },
  addFamilyMember: async (data) => {
    const res = await axios.post('/api/society-admin/family', data);
    return res.data;
  },
  getVehicles: async () => {
    const res = await axios.get('/api/society-admin/vehicles');
    return res.data;
  },
  registerVehicle: async (data) => {
    const res = await axios.post('/api/society-admin/vehicles', data);
    return res.data;
  },
  updateVehicle: async (id, data) => {
    const res = await axios.put(`/api/society-admin/vehicles/${id}`, data);
    return res.data;
  },
  deleteVehicle: async (id) => {
    const res = await axios.delete(`/api/society-admin/vehicles/${id}`);
    return res.data;
  },
  generateBills: async (data) => {
    const res = await axios.post('/api/society-admin/bills/generate', data);
    return res.data;
  },
  getBills: async (params) => {
    const res = await axios.get('/api/society-admin/bills', { params });
    return res.data;
  },
  updateMaintenanceBill: async (id, data) => {
    const res = await axios.put(`/api/society-admin/bills/${id}`, data);
    return res.data;
  },
  deleteMaintenanceBill: async (id) => {
    const res = await axios.delete(`/api/society-admin/bills/${id}`);
    return res.data;
  },
  updateMaintenanceBatch: async (batchId, data) => {
    const res = await axios.put(`/api/society-admin/bills/batches/${batchId}`, data);
    return res.data;
  },
  deleteMaintenanceBatch: async (batchId) => {
    const res = await axios.delete(`/api/society-admin/bills/batches/${batchId}`);
    return res.data;
  },
  updateBillStatus: async (id, status) => {
    const res = await axios.put(`/api/society-admin/bills/${id}/status`, { status });
    return res.data;
  },
  recordPayment: async (billId, data) => {
    const res = await axios.post(`/api/society-admin/bills/${billId}/offline-payment`, data);
    return res.data;
  },
  getIncome: async () => {
    const res = await axios.get('/api/society-admin/income');
    return res.data;
  },
  createIncome: async (data) => {
    const res = await axios.post('/api/society-admin/income', data);
    return res.data;
  },
  getExpenses: async () => {
    const res = await axios.get('/api/society-admin/expense');
    return res.data;
  },
  createExpense: async (formData) => {
    const res = await axios.post('/api/society-admin/expense', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getStaff: async () => {
    const res = await axios.get('/api/society-admin/staff');
    return res.data;
  },
  createStaff: async (formData) => {
    const res = await axios.post('/api/society-admin/staff', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getNotices: async () => {
    const res = await axios.get('/api/society-admin/notices');
    return res.data;
  },
  createNotice: async (data) => {
    const res = await axios.post('/api/society-admin/notices', data);
    return res.data;
  },
  getDocuments: async () => {
    const res = await axios.get('/api/society-admin/documents');
    return res.data;
  },
  uploadDocument: async (formData) => {
    const res = await axios.post('/api/society-admin/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getComplaints: async () => {
    const res = await axios.get('/api/society-admin/complaints');
    return res.data;
  },
  updateComplaint: async (id, data) => {
    const res = await axios.put(`/api/society-admin/complaints/${id}`, data);
    return res.data;
  },
  getAuditLogs: async () => {
    const res = await axios.get('/api/society-admin/audit-logs');
    return res.data;
  },
};

// ==================== RESIDENT SERVICES ====================
export const residentApi = {
  getDashboard: async () => {
    const res = await axios.get('/api/resident/dashboard');
    return res.data;
  },
  getFlatDetails: async () => {
    const res = await axios.get('/api/resident/flat-details');
    return res.data;
  },
  addFamilyMember: async (data) => {
    const res = await axios.post('/api/resident/family', data);
    return res.data;
  },
  requestVehicle: async (data) => {
    const res = await axios.post('/api/resident/vehicles', data);
    return res.data;
  },
  getBills: async () => {
    const res = await axios.get('/api/resident/bills');
    return res.data;
  },
  getBill: async (id) => {
    const res = await axios.get(`/api/resident/bills/${id}`);
    return res.data;
  },
  createComplaint: async (formData) => {
    const res = await axios.post('/api/resident/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getComplaints: async () => {
    const res = await axios.get('/api/resident/complaints');
    return res.data;
  },
  addComplaintComment: async (id, message) => {
    const res = await axios.post(`/api/resident/complaints/${id}/comment`, { message });
    return res.data;
  },
  reopenComplaint: async (id) => {
    const res = await axios.put(`/api/resident/complaints/${id}/reopen`);
    return res.data;
  },
  createPost: async (formData) => {
    const res = await axios.post('/api/resident/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getFeed: async () => {
    const res = await axios.get('/api/resident/posts');
    return res.data;
  },
  likePost: async (id) => {
    const res = await axios.post(`/api/resident/posts/${id}/like`);
    return res.data;
  },
  votePoll: async (id, optionId) => {
    const res = await axios.post(`/api/resident/posts/${id}/vote`, { optionId });
    return res.data;
  },
  commentPost: async (id, text) => {
    const res = await axios.post(`/api/resident/posts/${id}/comment`, { text });
    return res.data;
  },
  deletePost: async (id) => {
    const res = await axios.delete(`/api/resident/posts/${id}`);
    return res.data;
  },
  updateProfile: async (formData) => {
    const res = await axios.put('/api/resident/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getTimeline: async () => {
    const res = await axios.get('/api/resident/timeline');
    return res.data;
  },
  getEmergencyContacts: async () => {
    const res = await axios.get('/api/resident/emergency-contacts');
    return res.data;
  },
};

// ==================== COMMON SERVICES ====================
export const commonApi = {
  search: async (query) => {
    const res = await axios.get(`/api/common/search?query=${encodeURIComponent(query)}`);
    return res.data;
  },
  getNotifications: async () => {
    const res = await axios.get('/api/common/notifications');
    return res.data;
  },
  markRead: async (id) => {
    const res = await axios.put(`/api/common/notifications/${id}/read`);
    return res.data;
  },
  markReadAll: async () => {
    const res = await axios.put('/api/common/notifications/read-all');
    return res.data;
  },
  uploadFile: async (formData) => {
    const res = await axios.post('/api/common/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
