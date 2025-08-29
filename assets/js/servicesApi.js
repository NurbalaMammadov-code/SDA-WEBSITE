// /assets/js/servicesApi.js
import { request } from './apiClient.js';

export const listServices         = (params={}) => request('/api/v1/services', { params });
export const getService           = (id)        => request(`/api/v1/services/${id}`);
export const listServiceBenefits  = (params={}) => request('/api/v1/service-benefits', { params }); // title, description, order
