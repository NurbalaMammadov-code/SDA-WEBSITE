// /assets/js/newsApi.js
import { request } from '/assets/js/apiClient.js';

// Liste (News / Blog)
export const listNewsPosts = (params = {}) =>
  request('/api/v1/posts', { params });
// params ör: { locale?, q?, tag?, limit?, offset?, sort? }  sort: 'published_desc'

// Tekil post: slug varsa slug ile, yoksa id ile getir
export const getNewsPost = (slugOrId, params = {}) => {
  const s = String(slugOrId ?? '');
  const isId = /^\d+$/.test(s);
  const path = isId
    ? `/api/v1/posts/id/${encodeURIComponent(s)}`
    : `/api/v1/posts/${encodeURIComponent(s)}`;
  return request(path, { params });
};

// İmkan varsa (opsiyonel endpoint) ilgili haberleri getirir
export const listRelatedPosts = (params = {}) =>
  request('/api/v1/posts/related', { params }); // ör: { slug, limit }
