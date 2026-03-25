import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useDesktopStore } from '@/store/use-desktop-store';
import { useGetDivisions, useGetDocuments } from '@/hooks/use-music-hooks';

export function ExplorerApp() {
  const { openWindow } = useDesktopStore();
  const { data: divisions } = useGetDivisions();
  const { data: documents } = useGetDocuments();
  const [path, setPath] = useState('My NJAYCO');
  const [section, setSection] = useState<'root' | 'divisions' | 'documents' | 'media'>('root');

  const rootFolders = [
    { name: 'Divisions', icon: Icons.Building2, section: 'divisions' as const, desc: 'All NJAYCO company divisions' },
    { name: 'Documents', icon: Icons.FileText, section: 'documents' as const, desc: 'Company docs and records' },
    { name: 'Media Library', icon: Icons.Image, section: 'media' as const, desc: 'Photos, videos, and assets' },
  ];

  const toPascalCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 text-sm">
      {/* Toolbar */}
      <div className="bg-slate-200 border-b border-slate-300 p-2 flex items-center gap-2">
        <button 
          onClick={() => { setSection('root'); setPath('My NJAYCO'); }}
          disabled={section === 'root'}
          className="flex items-center gap-1 px-2 py-1 hover:bg-slate-300 rounded text-slate-700 disabled:opacity-40"
        >
          <Icons.ArrowLeft className="w-4 h-4 text-green-600" /> Back
        </button>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-slate-600 shrink-0">Address</span>
          <div className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 flex items-center shadow-inner">
            <Icons.HardDrive className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <span className="text-sm truncate">C:\NJAYCO\{path}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Tree */}
        <div className="w-56 bg-white border-r border-slate-300 overflow-y-auto hidden md:flex flex-col p-2 gap-1">
          <div 
            onClick={() => { setSection('root'); setPath('My NJAYCO'); }}
            className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded ${section === 'root' ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50'}`}
          >
            <Icons.Monitor className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-sm font-semibold">My NJAYCO</span>
          </div>
          {rootFolders.map(f => (
            <div 
              key={f.name}
              onClick={() => { setSection(f.section); setPath(f.name); }}
              className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded ml-3 ${section === f.section ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50'}`}
            >
              <f.icon className="w-4 h-4 text-yellow-500 shrink-0" />
              <span className="text-sm">{f.name}</span>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          {section === 'root' && (
            <>
              <div className="text-xs font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4 uppercase tracking-wider">System Folders</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {rootFolders.map(f => (
                  <div
                    key={f.name}
                    onDoubleClick={() => { setSection(f.section); setPath(f.name); }}
                    className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors group"
                  >
                    <f.icon className="w-10 h-10 text-yellow-400" />
                    <span className="text-xs text-center font-medium">{f.name}</span>
                    <span className="text-[10px] text-slate-400 text-center leading-tight">{f.desc}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'divisions' && (
            <>
              <div className="text-xs font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4 uppercase tracking-wider">
                {divisions?.length || 0} Divisions
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {divisions?.map(div => {
                  const iconKey = toPascalCase(div.iconType || 'folder');
                  const DivIcon = (Icons as any)[iconKey] || Icons.Folder;
                  return (
                    <div
                      key={div.id}
                      onDoubleClick={() => openWindow({
                        id: `div-${div.id}`,
                        title: div.name,
                        windowType: (div.windowType as any) || 'browser',
                        data: { url: div.websiteUrl, content: div.notepadContent, division: div }
                      })}
                      className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors"
                    >
                      <DivIcon className="w-10 h-10 text-blue-400" />
                      <span className="text-xs text-center font-medium leading-tight">{div.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        div.status === 'live' ? 'bg-green-100 text-green-700' : 
                        div.status === 'development' ? 'bg-blue-100 text-blue-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>{div.status}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {section === 'documents' && (
            <>
              <div className="text-xs font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4 uppercase tracking-wider">
                {documents?.length || 0} Documents
              </div>
              {documents && documents.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {documents.map(doc => (
                    <div
                      key={doc.id}
                      onDoubleClick={() => openWindow({
                        id: `doc-${doc.id}`,
                        title: doc.filename,
                        windowType: 'notepad',
                        data: { content: doc.content }
                      })}
                      className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors"
                    >
                      <Icons.FileText className="w-10 h-10 text-blue-400" />
                      <span className="text-xs text-center font-medium leading-tight">{doc.filename}</span>
                      <span className="text-[10px] text-slate-400">{(doc.fileSize / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400 py-12">
                  <Icons.FolderOpen className="w-16 h-16 mb-4 opacity-50" />
                  <p>No documents found.</p>
                </div>
              )}
            </>
          )}

          {section === 'media' && (
            <>
              <div className="text-xs font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4 uppercase tracking-wider">Media Library</div>
              <div className="flex flex-col items-center text-slate-400 py-12">
                <Icons.Image className="w-16 h-16 mb-4 opacity-50" />
                <p>Media library coming soon.</p>
              </div>
            </>
          )}
        </div>

        {/* Right-side Info Panel */}
        <div className="w-44 bg-slate-50 border-l border-slate-200 hidden lg:flex flex-col p-4 gap-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details</div>
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs text-slate-500">Type</div>
            <div className="text-sm font-medium text-slate-800 capitalize">{section === 'root' ? 'System' : section}</div>
          </div>
          {section === 'divisions' && (
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-sm font-medium text-slate-800">{divisions?.length || 0} divisions</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-slate-200 border-t border-slate-300 flex items-center px-4 text-xs text-slate-600 justify-between">
        <span>
          {section === 'root' && `${rootFolders.length} folders`}
          {section === 'divisions' && `${divisions?.length || 0} objects`}
          {section === 'documents' && `${documents?.length || 0} files`}
          {section === 'media' && 'Media Library'}
        </span>
        <span>NJAYCO (C:) · Connected</span>
      </div>
    </div>
  );
}
