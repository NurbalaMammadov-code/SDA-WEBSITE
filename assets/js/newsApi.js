
import { request } from '/assets/js/apiClient.js';

// Liste (News / Blog)
export const listNewsPosts = (params = {}) =>
  request('/news', { params });



export const getNewsPost = (slugOrId, params = {}) => {
  const s = String(slugOrId ?? '');
  const isId = /^\d+$/.test(s);
  const path = isId
    ? `/news/id/${encodeURIComponent(s)}`
    : `/news/${encodeURIComponent(s)}`;
  return request(path, { params });
};


export const listRelatedPosts = (params = {}) =>
  request('/news/related', { params }); 
