import client from './client';

export const listSlots = (params) => client.get('/slots', { params }).then(r => r.data);
export const upsertSlot = (data) => client.post('/slots', data).then(r => r.data);
export const updateSlot = (id, data) => client.put(`/slots/${id}`, data).then(r => r.data);
