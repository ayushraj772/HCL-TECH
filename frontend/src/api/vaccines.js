import client from './client';

export const listVaccines = (params) => client.get('/vaccines', { params }).then(r => r.data);
export const createVaccine = (data) => client.post('/vaccines', data).then(r => r.data);
export const updateVaccine = (id, data) => client.put(`/vaccines/${id}`, data).then(r => r.data);
export const deleteVaccine = (id) => client.delete(`/vaccines/${id}`).then(r => r.data);
