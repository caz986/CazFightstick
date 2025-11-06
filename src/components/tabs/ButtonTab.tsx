import React from 'react';

const buttonNames = ['A','B','X','Y','L1','R1','L2','R2','Start','Select','Up','Down','Left','Right'];

export default function ButtonTab({ data, onChange }: any) {
  const mapping = data.input?.mapping || {};
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Button Mapping</h3>
      <div className="grid grid-cols-2 gap-2">
        {buttonNames.map((b, idx) => (
          <div key={b} className="flex items-center gap-2">
            <div className="w-20">{b}</div>
            <input className="p-1 rounded bg-gray-700 border border-gray-600 w-24" type="number" value={mapping[b] ?? ''} onChange={(e)=> onChange(`input.mapping.${b}`, e.target.value?parseInt(e.target.value):null)} />
          </div>
        ))}
      </div>
    </div>
  );
}
