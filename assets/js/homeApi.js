import { request } from '/assets/js/apiClient.js';

// Homepage kompozit məlumatları (hero, about teaser, seçilmiş listlər və s.)
export const getHomepage = (params = {}) =>
  request('/api/v1/homepage', { params });
