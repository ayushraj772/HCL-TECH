import client from './client';

export const searchHospitals = (params) => client.get('/hospitals', { params }).then(r => r.data);
export const getHospital = (id) => client.get(`/hospitals/${id}`).then(r => r.data);
export const getHospitalVaccines = (id) => client.get(`/hospitals/${id}/vaccines`).then(r => r.data);
export const getHospitalAvailability = (id, params) =>
  client.get(`/hospitals/${id}/availability`, { params }).then(r => r.data);

export const createHospital = (data) => client.post('/hospitals', data).then(r => r.data);
export const updateHospital = (id, data) => client.put(`/hospitals/${id}`, data).then(r => r.data);
