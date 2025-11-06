import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { copyFile } from '@tauri-apps/api/fs';
import { BaseDirectory } from '@tauri-apps/api/path';

export default function FirmwareTab() {
  const [uf2Path, setUf2Path] = useState<string|null>(null);
  const [targetDrive, setTargetDrive] = useState<string|null>(null);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  async function detectDrive(silent=false) {
    try {
      const drive = await invoke<string>('detect_rp2040_drive');
      if (drive) {
        setTargetDrive(drive);
        if (!silent) setStatus('Detected: ' + drive);
      }
    } catch {
      if (!silent) setStatus('No RP2040 drive found');
      setTargetDrive(null);
    }
  }

  useEffect(()=> {
    detectDrive(true);
    const interval = setInterval(()=> detectDrive(true), 3000);
    return ()=> clearInterval(interval);
  }, []);

  async function selectFirmware() {
    const file = await open({ filters:[{name:'UF2', extensions:['uf2']}], multiple:false });
    if (typeof file === 'string') setUf2Path(file);
  }

  async function selectDrive() {
    const folder = await open({ directory:true, multiple:false });
    if (typeof folder === 'string') setTargetDrive(folder);
  }

  async function flash() {
    if (!uf2Path || !targetDrive) {
      setStatus('Select firmware and drive first');
      return;
    }
    setIsFlashing(true);
    setProgress(0);
    setStatus('Flashing...');
    const anim = setInterval(()=> setProgress(p=> p<95? p+5 : p), 120);
    try {
      const filename = uf2Path.split(/[\\/]/).pop()!;
      const dest = `${targetDrive}/${filename}`;
      await copyFile(uf2Path, dest, { baseDir: BaseDirectory.Home });
      clearInterval(anim);
      setProgress(100);
      setStatus('✅ Firmware copied');
    } catch (e:any) {
      clearInterval(anim);
      setStatus('Error: '+String(e));
      setProgress(0);
    } finally {
      setTimeout(()=> { setIsFlashing(false); setProgress(0); }, 1500);
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded">
      <p className="text-sm text-gray-300 mb-4">Enter BOOTSEL mode and connect the board. The app auto-detects RPI-RP2.</p>
      <div className="space-y-3">
        <button onClick={selectFirmware} className="w-full px-4 py-2 bg-gray-700 rounded">{uf2Path? 'Change UF2' : 'Select UF2'}</button>
        <button onClick={()=>detectDrive(false)} className="w-full px-4 py-2 bg-indigo-600 rounded">Manual Re-Scan</button>
        <button onClick={selectDrive} className="w-full px-4 py-2 bg-gray-700 rounded">Manual Select Drive</button>
        <button onClick={flash} disabled={!uf2Path || !targetDrive || isFlashing} className={`w-full px-4 py-2 rounded text-white ${isFlashing? 'bg-yellow-600 animate-pulse' : (uf2Path&&targetDrive? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600')}`}>{isFlashing? 'Flashing...' : 'Flash Firmware'}</button>

        {(isFlashing || progress>0) && (
          <div className="w-full bg-gray-900 h-3 rounded overflow-hidden">
            <div className={`h-full transition-all ${progress>=100? 'bg-green-500' : 'bg-yellow-400 animate-pulse'}`} style={{width: `${progress}%`}} />
          </div>
        )}

        <p className="mt-2 text-sm">{status}</p>
      </div>
    </div>
  );
}
