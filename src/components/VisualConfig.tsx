import React, { useState, useEffect } from 'react';
import ButtonTab from './tabs/ButtonTab';
import LedTab from './tabs/LedTab';
import SystemTab from './tabs/SystemTab';
import { invoke } from "@tauri-apps/api/core";
import { save as fsSave } from '@tauri-apps/api/dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { BaseDirectory } from '@tauri-apps/api/path';

export default function VisualConfig() {
  const [data, setData] = useState<any>(() => ({
    input: { mapping: { A: 1, B: 2, X: 3, Y: 4 } },
    led: { enabled: true, brightness: 128 },
    system: { inputMode: 'XInput', idleTimeout: 0 },
    oled: { enabled: true, layout: 'default' }
  }));
  const [status, setStatus] = useState<string|null>(null);
  const [ip, setIp] = useState('192.168.7.1');

  useEffect(() => {
    (async () => {
      try {
        const json = await invoke<string>('fetch_gp2040_config', { ip });
        if (json) {
          setData(JSON.parse(json));
          setStatus('Loaded config from device.');
        }
      } catch (e) {}
    })();
  }, []);

  function updateField(path: string, value: any) {
    const keys = path.split('.');
    setData((old: any) => {
      const copy = JSON.parse(JSON.stringify(old));
      let ref: any = copy;
      for (let i=0;i<keys.length-1;i++) {
        if (!ref[keys[i]]) ref[keys[i]] = {};
        ref = ref[keys[i]];
      }
      ref[keys[keys.length-1]] = value;
      return copy;
    });
  }

  async function saveToDevice() {
    setStatus('Saving to device...');
    try {
      await invoke<string>('save_gp2040_config', { ip, configJson: JSON.stringify(data) });
      setStatus('Saved to device.');
    } catch (e:any) {
      setStatus('Error: '+String(e));
    }
  }

  async function backupConfig() {
    const path = await fsSave({ defaultPath: 'cazfightstick-config.json' });
    if (path && typeof path === 'string') {
      await writeTextFile(path, JSON.stringify(data, null, 2), { dir: BaseDirectory.Home, append: false });
      setStatus('Backup saved: ' + path);
    }
  }

  async function restoreConfig() {
    const res: any = await (await import('@tauri-apps/api/dialog')).open({ filters: [{ name: 'JSON', extensions: ['json'] }] });
    if (typeof res === 'string') {
      const raw = await readTextFile(res);
      setData(JSON.parse(raw));
      setStatus('Restored config from file.');
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex gap-2 items-center mb-3">
            <input value={ip} onChange={(e)=>setIp(e.target.value)} className="p-2 rounded bg-gray-700 border border-gray-600" />
            <button onClick={saveToDevice} className="px-3 py-1 bg-green-600 rounded">Save to Device</button>
            <button onClick={backupConfig} className="px-3 py-1 bg-yellow-600 rounded">Backup</button>
            <button onClick={restoreConfig} className="px-3 py-1 bg-gray-600 rounded">Restore</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ButtonTab data={data} onChange={updateField} />
            </div>
            <div>
              <LedTab data={data} onChange={updateField} />
              <div className="mt-4"><SystemTab data={data} onChange={updateField} /></div>
            </div>
          </div>
        </div>

        <div className="w-56">
          <h3 className="font-semibold mb-2">OLED Preview</h3>
          <div className="bg-black border border-gray-700 p-3 rounded" style={{height: 200}}>
            <svg viewBox="0 0 240 128" width="100%" height="100%" className="bg-black">
              <rect width="240" height="128" fill="#000" />
              {Object.entries(data.input?.mapping || {}).map(([k,v],i)=> {
                const x = 30 + (i%4)*50;
                const y = 30 + Math.floor(i/4)*40;
                return <g key={k}>
                  <circle cx={x} cy={y} r={12} fill="#222" stroke="#555" />
                  <text x={x} y={y+4} fontSize="10" textAnchor="middle" fill="#fff">{k}</text>
                  <text x={x} y={y+18} fontSize="8" textAnchor="middle" fill="#9CA3AF">P{v}</text>
                </g>;
              })}
            </svg>
          </div>
          <p className="text-sm text-gray-400 mt-2">OLED updates in real-time when you change mappings.</p>
          {status && <p className="mt-2 text-sm">{status}</p>}
        </div>
      </div>
    </div>
  );
}
