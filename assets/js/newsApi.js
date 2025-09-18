
import { request } from '/assets/js/apiClient.js';


 export const listNewsPosts = (params = {}) =>
  request('/api/v1/news', { params }); 

export const getNewsById = (id) =>
  request(`/api/v1/news/${id}`);

export const listNewsSections = (id, params = {}) =>
  request(`/api/v1/news/${id}/sections`, { params });

 export const getNewsPost = (slugOrId, params = {}) => {
   const s = String(slugOrId ?? '');
   if (/^\d+$/.test(s)) {
     return request(`/api/v1/news/${encodeURIComponent(s)}`, { params });
   }
   return Promise.reject(new Error('Slug desteklenmiyor; id parametresi verilmeli.'));
 };

 export const listRelatedPosts = async () => [];