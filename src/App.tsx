import React, { useState } from "react";
import FirmwareTab from "./components/tabs/FirmwareTab";
import FirmwareDownloadTab from "./components/tabs/FirmwareDownloadTab";
import VisualConfig from "./components/VisualConfig";

export default function App() {
  const [tab, setTab] = useState<'config'|'flash'|'download'>('config');
  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">CazFightstick — GP2040 Configurator</h1>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('config')} className={`px-4 py-2 rounded ${tab==='config'?'bg-indigo-600':'bg-gray-700'}`}>Configuration</button>
        <button onClick={() => setTab('flash')} className={`px-4 py-2 rounded ${tab==='flash'?'bg-indigo-600':'bg-gray-700'}`}>Flash Firmware</button>
        <button onClick={() => setTab('download')} className={`px-4 py-2 rounded ${tab==='download'?'bg-indigo-600':'bg-gray-700'}`}>Download Latest</button>
      </div>

      {tab === 'config' && <VisualConfig />}
      {tab === 'flash' && <FirmwareTab />}
      {tab === 'download' && <FirmwareDownloadTab />}
    </div>
  );
}
