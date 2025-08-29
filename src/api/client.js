const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5179';

const buildHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const raw = localStorage.getItem('pb_api_settings');
    if (raw) {
      const { tokenType, tokenValue, apiKeyHeader, apiKeyValue } = JSON.parse(raw);
      if (tokenType === 'bearer' && tokenValue) headers['Authorization'] = `Bearer ${tokenValue}`;
      if (tokenType === 'apiKey' && apiKeyHeader && apiKeyValue) headers[apiKeyHeader] = apiKeyValue;
    }
  } catch {}
  return headers;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: buildHeaders(),
    ...options
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const error = new Error(`API ${options.method || 'GET'} ${path} failed: ${response.status} ${text}`);
    error.status = response.status;
    throw error;
  }
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

export const getState = async () => {
  return request('/state/1');
};

export const putState = async (state) => {
  return request('/state/1', {
    method: 'PUT',
    body: JSON.stringify(state)
  });
};

