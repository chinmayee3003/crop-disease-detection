import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60 seconds for image processing
});

export const analyzeImage = async (file, cropHint = 'auto', partType = 'leaf') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('crop_hint', cropHint);
  formData.append('part_type', partType);

  const response = await api.post('/detection/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const analyzeSample = async (sampleFilename, cropHint = 'auto', partType = 'leaf') => {
  const response = await api.post('/detection/analyze-sample', {
    sample_filename: sampleFilename,
    crop_hint: cropHint,
    part_type: partType,
  });
  return response.data;
};

export const getDetectionHistory = async (params = {}) => {
  const response = await api.get('/detection/history', { params });
  return response.data;
};

export const getDetectionById = async (id) => {
  const response = await api.get(`/detection/${id}`);
  return response.data;
};

export const deleteDetection = async (id) => {
  const response = await api.delete(`/detection/${id}`);
  return response.data;
};

export const getDiseases = async (params = {}) => {
  const response = await api.get('/diseases', { params });
  return response.data;
};

export const getDiseaseById = async (id) => {
  const response = await api.get(`/diseases/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getSamples = async () => {
  const response = await api.get('/samples');
  return response.data;
};

export default api;
