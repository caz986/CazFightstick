import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { download } from '@tauri-apps/api/http';

export default function FirmwareDownloadTab() {
  const [release, setRelease] = useState<any>(null);
  const [status, setStatus] = useState('');

  async function loadLatest() {
    setStatus('Loading...');
    try {
      const json = await invoke<any>('fetch_latest_firmware');
      setRelease(json);
      setStatus('Loaded release: ' + json.tag_name);
    } catch (e:any) {
      setStatus('Error: '+String(e));
    }
  }

  useEffect(()=> { loadLatest(); }, []);

  async function downloadAsset(url:string, name:string) {
    setStatus('Downloading ' + name);
    try {
      const tmp = await download(url, { fileName: name });
      setStatus('Downloaded to: ' + tmp.path);
    } catch (e:any) {
      setStatus('Download failed: '+String(e));
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold mb-2">Latest Firmware</h3>
      <p className="text-sm text-gray-300 mb-3">This fetches the latest release from GP2040-CE GitHub releases.</p>
      <div>
        <button onClick={loadLatest} className="px-3 py-1 bg-indigo-600 rounded mb-3">Refresh</button>
        {release && (
          <div>
            <p>Version: <strong>{release.tag_name}</strong></p>
            <p className="text-sm">Assets:</p>
            <ul className="list-disc list-inside">
              {release.assets.map((a:any)=> (
                <li key={a.name} className="mb-1">
                  <button onClick={()=>downloadAsset(a.browser_download_url, a.name)} className="text-blue-400 underline">{a.name}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-3 text-sm">{status}</p>
      </div>
    </div>
  );
}
