import React, { useEffect, useState } from 'react';

const ApiSettings = () => {
  const [baseUrl, setBaseUrl] = useState(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5179');
  const [tokenType, setTokenType] = useState('none');
  const [tokenValue, setTokenValue] = useState('');
  const [apiKeyHeader, setApiKeyHeader] = useState('X-API-Key');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pb_api_settings');
      if (raw) {
        const saved = JSON.parse(raw);
        setTokenType(saved.tokenType || 'none');
        setTokenValue(saved.tokenValue || '');
        setApiKeyHeader(saved.apiKeyHeader || 'X-API-Key');
        setApiKeyValue(saved.apiKeyValue || '');
      }
    } catch {}
  }, []);

  const save = () => {
    try {
      localStorage.setItem('pb_api_settings', JSON.stringify({ tokenType, tokenValue, apiKeyHeader, apiKeyValue }));
      setStatus('Saved');
      setTimeout(() => setStatus(''), 1500);
    } catch {
      setStatus('Failed to save');
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">API Base URL</label>
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
          <p className="text-xs text-gray-400 mt-1">Current env: {process.env.REACT_APP_API_BASE_URL || 'not set'}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Auth Type</label>
          <select value={tokenType} onChange={(e) => setTokenType(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="none">None</option>
            <option value="bearer">Bearer Token</option>
            <option value="apiKey">API Key Header</option>
          </select>
        </div>
        {tokenType === 'bearer' && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bearer Token</label>
            <input value={tokenValue} onChange={(e) => setTokenValue(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
        )}
        {tokenType === 'apiKey' && (
          <>
            <div>
              <label className="block text-xs text-gray-500 mb-1">API Key Header</label>
              <input value={apiKeyHeader} onChange={(e) => setApiKeyHeader(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">API Key Value</label>
              <input value={apiKeyValue} onChange={(e) => setApiKeyValue(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={save} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Save</button>
        {status && <span className="text-xs text-gray-500">{status}</span>}
      </div>
      <p className="text-xs text-gray-400">Note: Base URL is build-time via .env; change and rebuild to take effect.</p>
    </div>
  );
};

export default ApiSettings;

