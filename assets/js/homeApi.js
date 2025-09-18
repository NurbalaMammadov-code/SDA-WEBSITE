import { request } from '/assets/js/apiClient.js';


export const getHomepage = (params = {}) =>
  request('/api/v1/homepage', { params });
 