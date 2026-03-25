import { useState } from 'react';
import * as Icons from 'lucide-react';

export function BrowserApp({ data }: { data?: { url?: string } }) {
  const defaultUrl = data?.url || 'https://njayco.com';
  const [url, setUrl] = useState(defaultUrl);
  const [inputUrl, setInputUrl] = useState(defaultUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Toolbar */}
      <div className="bg-slate-200 border-b border-slate-300 p-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button className="p-1 hover:bg-slate-300 rounded text-slate-600"><Icons.ArrowLeft className="w-5 h-5" /></button>
            <button className="p-1 hover:bg-slate-300 rounded text-slate-600"><Icons.ArrowRight className="w-5 h-5" /></button>
            <button className="p-1 hover:bg-slate-300 rounded text-slate-600" onClick={() => setUrl(url)}><Icons.RotateCw className="w-5 h-5" /></button>
            <button className="p-1 hover:bg-slate-300 rounded text-slate-600" onClick={() => { setUrl(defaultUrl); setInputUrl(defaultUrl); }}><Icons.Home className="w-5 h-5" /></button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-medium">Address</span>
          <div className="flex-1 flex items-center bg-white border border-slate-300 rounded px-2 shadow-inner">
            <Icons.Globe className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full py-1 text-sm outline-none"
            />
          </div>
          <button type="submit" className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-sm font-medium rounded border border-slate-400 shadow-sm">
            Go
          </button>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white relative">
        <div className="absolute inset-x-0 top-0 bg-yellow-50 border-b border-yellow-200 p-2 text-xs text-yellow-800 text-center flex justify-center items-center gap-2">
          <Icons.Info className="w-4 h-4" />
          If the website refuses to connect in this frame, <a href={url} target="_blank" rel="noreferrer" className="underline font-bold text-blue-600">click here to open it in a new tab</a>.
        </div>
        <iframe 
          src={url} 
          className="w-full h-full pt-8 border-none bg-white"
          title="Browser Content"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}
