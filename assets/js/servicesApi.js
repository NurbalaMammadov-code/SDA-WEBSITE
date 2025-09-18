
import { request } from '/assets/js/apiClient.js';

const meta = (name, fallback = null) =>
  document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? fallback;


const IS_PROD = /sdaconsulting\.az$/i.test(location.hostname);


const FEATURES_PATH = meta('api-path-service-features', null);  
const BENEFITS_PATH = meta('api-path-service-benefits', null);   








export const listServices = (params = {}) => {
  if (!IS_PROD) return Promise.resolve([]);           
  return request('/api/v1/services', { params });
};


export const getService = (idOrSlug, params = {}) =>
  request(`/api/v1/services/${encodeURIComponent(idOrSlug)}`, { params });


export const listServiceFeatures = (params = {}) => {
  if (!FEATURES_PATH) return Promise.resolve([]); 
  const { service_id, ...rest } = params || {};
  const useIdPath = FEATURES_PATH.includes(':id');
  const path = useIdPath
    ? FEATURES_PATH.replace(':id', encodeURIComponent(service_id ?? ''))
    : FEATURES_PATH;
  const query = useIdPath ? rest : params;
  return request(path, { params: query }).catch(() => []); 
};

export const listServiceBenefits = (params = {}) => {
  if (!BENEFITS_PATH) return Promise.resolve([]); 
  const { service_id, ...rest } = params || {};
  const useIdPath = BENEFITS_PATH.includes(':id');
  const path = useIdPath
    ? BENEFITS_PATH.replace(':id', encodeURIComponent(service_id ?? ''))
    : BENEFITS_PATH;
  const query = useIdPath ? rest : params;
  return request(path, { params: query }).catch(() => []); 
};
 

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