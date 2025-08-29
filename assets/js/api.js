import { BASE_URL } from "./config.js";

function buildURL(path, params) {
  const url = new URL(BASE_URL + path); // path: "/api/v1/...."
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) v.forEach(item => url.searchParams.append(k, item));
      else url.searchParams.set(k, v);
    });
  }
  return url.toString();
}

async function coreFetch(path, { method="GET", params, body, headers } = {}) {
  const url = buildURL(path, params);
  const opts = { method, headers: new Headers(headers || {}) };

  const isForm = (typeof FormData !== "undefined") && (body instanceof FormData);
  if (body !== undefined) {
    opts.body = isForm ? body : JSON.stringify(body);
    if (!isForm && !opts.headers.has("Content-Type")) {
      opts.headers.set("Content-Type", "application/json");
    }
  }

  const res = await fetch(url, opts);
  if (res.status === 204) return null;

  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || res.statusText;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (path, params) => coreFetch(path, { method: "GET", params }),
  post: (path, body)   => coreFetch(path, { method: "POST", body }),
  put:  (path, body)   => coreFetch(path, { method: "PUT",  body }),
  patch:(path, body)   => coreFetch(path, { method: "PATCH",body }),
  delete:(path)        => coreFetch(path, { method: "DELETE" }),
};
