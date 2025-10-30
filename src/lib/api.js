import { prarangApi, analyticsApi, apiGet, apiPost } from './apiClient';

// Simple unified API object. Default client can be switched by setting DEFAULT_CLIENT.
const DEFAULT_CLIENT = prarangApi;

function pickClient(name) {
  if (!name) return DEFAULT_CLIENT;
  if (name === 'prarang') return prarangApi;
  if (name === 'analytics') return analyticsApi;
  return DEFAULT_CLIENT;
}

async function get(path,opts = {}) {
  const client = pickClient(opts.client);
  // allow passing params through opts.params and other axios config
  // apiGet signature: apiGet(client, path, body, config)
  // For GET requests, ensure params are passed in the axios config so they become query string params.
  return apiGet(client, path, null, { params: opts.params, headers: opts.headers, timeout: opts.timeout });
}

async function post(path, body = {}, opts = {}) {
  const client = pickClient(opts.client);
  return apiPost(client, path, body, { headers: opts.headers, timeout: opts.timeout });
}

export const api = { get, post };

export default api;
