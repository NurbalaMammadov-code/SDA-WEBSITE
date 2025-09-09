// /assets/js/contactApi.js
import { request } from '/assets/js/apiClient.js';

export const getContactSettings = (params = {}) =>
  request('/api/v1/contact/settings', { params });

// JSON body ile gönderim (OpenAPI şemasına uygun)
export const submitContact = ({
  name,
  email,
  phone = null,
  subject = null,
  message,
  consent = null,
  recaptcha_token = null,
  honeypot = null,
}) =>
  request('/api/v1/contact/messages', {
    method: 'POST',
    body: {
      name,
      email,
      phone,
      subject,
      message,
      consent,
      recaptcha_token,
      honeypot,
    },
  });



export const submitContactFormData = (payload) => {
  const fd = new FormData();
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  return request('/api/v1/contact/messages', { method: 'POST', body: fd });
};

