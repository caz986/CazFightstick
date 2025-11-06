import React from 'react';

export default function SystemTab({ data, onChange }: any) {
  const sys = data.system || {};
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">System Settings</h3>
      <div className="space-y-2">
        <div>
          <label className="block text-sm">Input Mode</label>
          <select className="p-1 rounded bg-gray-700 border border-gray-600" value={sys.inputMode||'XInput'} onChange={(e)=>onChange('system.inputMode', e.target.value)}>
            <option>XInput</option>
            <option>DInput</option>
            <option>Switch</option>
            <option>PS3</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Idle Timeout (s)</label>
          <input type="number" className="p-1 rounded bg-gray-700 border border-gray-600 w-28" value={sys.idleTimeout||0} onChange={(e)=>onChange('system.idleTimeout', parseInt(e.target.value))} />
        </div>
      </div>
    </div>
  );
}
