
import { request } from '/assets/js/apiClient.js';

const IS_PROD = /sdaconsulting\.az$/i.test(location.hostname);







export const listServices = (params = {}) => {
  if (!IS_PROD) return Promise.resolve([]);           
  return request('/api/v1/services', { params });
};


export const getService = (idOrSlug, params = {}) =>
  request(`/api/v1/services/${encodeURIComponent(idOrSlug)}`, { params });


export const listServiceFeatures = (params = {}) =>
  request('/api/v1/service-features', { params });


export const listServiceBenefits = (params = {}) =>
  request('/api/v1/service-benefits', { params });
 

export const listProjects = (params = {}) =>
  request('/api/v1/projects', { params });



export const listWorkProcesses = (params = {}) => {
  if (!IS_PROD) return Promise.resolve([]);           
  return request('/api/v1/work-processes', { params })
    .catch((e) => {
     
      if (IS_PROD) console.warn('[servicesApi] listWorkProcesses failed:', e);
      return [];
    });
};