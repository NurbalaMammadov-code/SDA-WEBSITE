import { request } from '/assets/js/apiClient.js';
export const listAbout       = (params={}) => request('/api/v1/about', { params });
export const listPartners    = (params={}) => request('/api/v1/partners', { params });
export const listTeamMembers = (params={}) => request('/api/v1/team-members', { params });
