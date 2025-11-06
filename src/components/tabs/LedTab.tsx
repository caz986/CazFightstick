import React from 'react';

export default function LedTab({ data, onChange }: any) {
  const led = data.led || {};
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">LED Settings</h3>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={led.enabled||false} onChange={(e)=>onChange('led.enabled', e.target.checked)} /> Enable LEDs</label>
        <div className="flex items-center gap-2">
          <label>Brightness</label>
          <input type="range" min={0} max={255} value={led.brightness||128} onChange={(e)=>onChange('led.brightness', parseInt(e.target.value))} />
          <span className="w-8 text-right">{led.brightness||128}</span>
        </div>
      </div>
    </div>
  );
}
