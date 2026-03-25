import { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import type { WindowData } from '@/store/use-desktop-store';

export function BrowserApp({ data }: { data?: WindowData }) {
  const defaultUrl = data?.url ?? 'https://njayco.com';
  const [url, setUrl] = useState(defaultUrl);
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (target: string) => {
    let finalUrl = target.trim();
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setLoadError(false);
    setIsLoading(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(inputUrl);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc && doc.body.innerText === '') {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const displayHost = (() => {
    try { return new URL(url).hostname; } catch { return url; }
  })();

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Toolbar */}
      <div className="bg-slate-200 border-b border-slate-300 p-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button className="p-1 hover:bg-slate-300 rounded text-slate-600" title="Back"><Icons.ArrowLeft className="w-5 h-5" /></button>
            <button className="p-1 hover:bg-slate-300 rounded text-slate-600" title="Forward"><Icons.ArrowRight className="w-5 h-5" /></button>
            <button className="p-1 hover:bg-slate-300 rounded text-slate-600" title="Refresh" onClick={() => { setLoadError(false); setIsLoading(true); setUrl(u => u + ' '); setTimeout(() => setUrl(u => u.trim()), 50); }}>
              <Icons.RotateCw className="w-5 h-5" />
            </button>
            <button className="p-1 hover:bg-slate-300 rounded text-slate-600" title="Home" onClick={() => navigate(defaultUrl)}>
              <Icons.Home className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-medium">Address</span>
          <div className="flex-1 flex items-center bg-white border border-slate-300 rounded px-2 shadow-inner">
            <Icons.Globe className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
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
      <div className="flex-1 relative overflow-hidden bg-white">
        {isLoading && !loadError && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10 pointer-events-none">
            <div className="flex flex-col items-center gap-3">
              <Icons.Globe className="w-8 h-8 text-blue-400 animate-pulse" />
              <span className="text-sm text-slate-500">Connecting to {displayHost}…</span>
            </div>
          </div>
        )}

        {loadError ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
              <Icons.AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Cannot display this page</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                <strong>{displayHost}</strong> refused to connect inside NJAYCO OS. This is common for sites that restrict embedding.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Icons.ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
              <button
                onClick={() => navigate(defaultUrl)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                <Icons.Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-none bg-white"
            title="Browser Content"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>
    </div>
  );
}
