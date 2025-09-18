
import { request } from '/assets/js/apiClient.js';


 const meta = (n,d=null)=>document.querySelector(`meta[name="${n}"]`)?.content?.trim()||d;
 const NEWS_LIST_PATH = meta('api-path-news', '/api/v1/posts');
 export const listNewsPosts = (params = {}) => request(NEWS_LIST_PATH, { params });



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

