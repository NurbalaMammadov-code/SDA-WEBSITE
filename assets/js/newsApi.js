// /assets/js/newsApi.js
import { request } from './apiClient.js';

export const listNews = (params={}) => request('/api/v1/news', { params });        // ?skip ?limit ?tags
export const getNews  = (id)            => request(`/api/v1/news/${id}`);
