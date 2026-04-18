import client from './client';

export const createBooking = (data) => client.post('/bookings', data).then(r => r.data);
export const myBookings = () => client.get('/bookings/me').then(r => r.data);
export const getBooking = (id) => client.get(`/bookings/${id}`).then(r => r.data);
export const updateBooking = (id, data) => client.put(`/bookings/${id}`, data).then(r => r.data);
export const cancelBooking = (id) => client.delete(`/bookings/${id}`).then(r => r.data);
