import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useDesktopStore, type WindowType } from '@/store/use-desktop-store';
import { useGetDivisions, useGetDocuments } from '@/hooks/use-music-hooks';

type LucideIcons = typeof Icons;
function getIcon(name: string): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  const toPascalCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const key = toPascalCase(name) as keyof LucideIcons;
  const icon = Icons[key];
  if (icon && typeof icon === 'function') return icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  return Icons.Folder;
}

const VALID_WINDOW_TYPES = new Set<WindowType>(['browser', 'notepad', 'music', 'explorer', 'admin', 'custom', 'company']);
function toWindowType(raw: string | null | undefined): WindowType {
  if (raw && VALID_WINDOW_TYPES.has(raw as WindowType)) return raw as WindowType;
  return 'browser';
}

type Section = 'desktop' | 'my-computer' | 'divisions' | 'documents' | 'music' | 'media' | 'press-kit' | 'investor' | 'services';

interface TreeNode {
  id: Section;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  parent?: Section;
  indent?: number;
}

const tree: TreeNode[] = [
  { id: 'desktop', label: 'Desktop', icon: Icons.Monitor, indent: 0 },
  { id: 'my-computer', label: 'My NJAYCO (C:)', icon: Icons.HardDrive, indent: 1 },
  { id: 'divisions', label: 'Divisions', icon: Icons.Building2, parent: 'my-computer', indent: 2 },
  { id: 'documents', label: 'Documents', icon: Icons.FileText, parent: 'my-computer', indent: 2 },
  { id: 'music', label: 'Music Library', icon: Icons.Music, parent: 'my-computer', indent: 2 },
  { id: 'media', label: 'Media', icon: Icons.Image, parent: 'my-computer', indent: 2 },
  { id: 'press-kit', label: 'Press Kit', icon: Icons.Newspaper, parent: 'documents', indent: 3 },
  { id: 'investor', label: 'Investor', icon: Icons.TrendingUp, parent: 'documents', indent: 3 },
  { id: 'services', label: 'Services', icon: Icons.Briefcase, parent: 'my-computer', indent: 2 },
];

const sectionAddress: Record<Section, string> = {
  'desktop': 'Desktop',
  'my-computer': 'C:\\NJAYCO',
  'divisions': 'C:\\NJAYCO\\Divisions',
  'documents': 'C:\\NJAYCO\\Documents',
  'music': 'C:\\NJAYCO\\Music',
  'media': 'C:\\NJAYCO\\Media',
  'press-kit': 'C:\\NJAYCO\\Documents\\Press Kit',
  'investor': 'C:\\NJAYCO\\Documents\\Investor',
  'services': 'C:\\NJAYCO\\Services',
};

export function ExplorerApp() {
  const { openWindow } = useDesktopStore();
  const { data: divisions } = useGetDivisions();
  const { data: allDocuments } = useGetDocuments();
  const [section, setSection] = useState<Section>('desktop');
  const [history, setHistory] = useState<Section[]>(['desktop']);
  const [histIdx, setHistIdx] = useState(0);

  const navigate = (s: Section) => {
    const newHistory = [...history.slice(0, histIdx + 1), s];
    setHistory(newHistory);
    setHistIdx(newHistory.length - 1);
    setSection(s);
  };

  const goBack = () => {
    if (histIdx > 0) {
      setHistIdx(i => i - 1);
      setSection(history[histIdx - 1]);
    }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) {
      setHistIdx(i => i + 1);
      setSection(history[histIdx + 1]);
    }
  };

  const pressKitDocs = allDocuments?.filter(d => d.category === 'press') ?? [];
  const investorDocs = allDocuments?.filter(d => d.category === 'investor') ?? [];
  const documents = section === 'press-kit' ? pressKitDocs : section === 'investor' ? investorDocs : allDocuments ?? [];

  const renderItems = () => {
    if (section === 'desktop') {
      const items = [
        { id: 'my-computer', label: 'My NJAYCO (C:)', icon: Icons.HardDrive, action: () => navigate('my-computer') },
        { id: 'divisions', label: 'Divisions', icon: Icons.Building2, action: () => navigate('divisions') },
        { id: 'documents', label: 'Documents', icon: Icons.FileText, action: () => navigate('documents') },
        { id: 'music', label: 'Music Library', icon: Icons.Music, action: () => navigate('music') },
        { id: 'media', label: 'Media', icon: Icons.Image, action: () => navigate('media') },
        { id: 'services', label: 'Services', icon: Icons.Briefcase, action: () => navigate('services') },
      ];
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} onDoubleClick={item.action} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors">
              <item.icon className="w-10 h-10 text-yellow-400" />
              <span className="text-xs text-center font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      );
    }

    if (section === 'my-computer') {
      const items = [
        { id: 'divisions', label: 'Divisions', icon: Icons.Building2, action: () => navigate('divisions'), desc: `${divisions?.length ?? 0} divisions` },
        { id: 'documents', label: 'Documents', icon: Icons.FileText, action: () => navigate('documents'), desc: `${allDocuments?.length ?? 0} files` },
        { id: 'music', label: 'Music Library', icon: Icons.Music, action: () => navigate('music'), desc: 'UV Music Group' },
        { id: 'media', label: 'Media', icon: Icons.Image, action: () => navigate('media'), desc: 'Assets & images' },
        { id: 'services', label: 'Services', icon: Icons.Briefcase, action: () => navigate('services'), desc: 'NJAYCO offerings' },
      ];
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} onDoubleClick={item.action} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors">
              <item.icon className="w-10 h-10 text-yellow-400" />
              <span className="text-xs text-center font-medium">{item.label}</span>
              <span className="text-[10px] text-slate-400">{item.desc}</span>
            </div>
          ))}
        </div>
      );
    }

    if (section === 'divisions') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {divisions?.map(div => {
            const DivIcon = getIcon(div.iconType || 'folder');
            return (
              <div key={div.id} onDoubleClick={() => openWindow({ id: `div-${div.id}`, title: div.name, windowType: toWindowType(div.windowType), data: { url: div.websiteUrl, content: div.notepadContent, division: div } })} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors">
                <DivIcon className="w-10 h-10 text-blue-400" />
                <span className="text-xs text-center font-medium leading-tight">{div.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${div.status === 'live' ? 'bg-green-100 text-green-700' : div.status === 'development' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{div.status}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (section === 'documents' || section === 'press-kit' || section === 'investor') {
      const subfolders = section === 'documents' ? [
        { id: 'press-kit' as Section, label: 'Press Kit', icon: Icons.Newspaper, count: pressKitDocs.length },
        { id: 'investor' as Section, label: 'Investor', icon: Icons.TrendingUp, count: investorDocs.length },
      ] : [];
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {subfolders.map(f => (
            <div key={f.id} onDoubleClick={() => navigate(f.id)} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors">
              <f.icon className="w-10 h-10 text-yellow-400" />
              <span className="text-xs text-center font-medium">{f.label}</span>
              <span className="text-[10px] text-slate-400">{f.count} files</span>
            </div>
          ))}
          {documents.map(doc => (
            <div key={doc.id} onDoubleClick={() => openWindow({ id: `doc-${doc.id}`, title: doc.filename, windowType: 'notepad', data: { content: doc.content } })} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors">
              <Icons.FileText className="w-10 h-10 text-blue-400" />
              <span className="text-xs text-center font-medium leading-tight">{doc.filename}</span>
              <span className="text-[10px] text-slate-400 capitalize">{doc.fileType} file</span>
            </div>
          ))}
        </div>
      );
    }

    if (section === 'music') {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Icons.Music className="w-16 h-16 text-blue-300" />
          <p className="text-slate-500 text-sm">Open the Music app to browse the UV Music Group library.</p>
          <button onClick={() => openWindow({ id: 'music-uv', title: 'UV Music Group', windowType: 'music' })} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Open Music App
          </button>
        </div>
      );
    }

    if (section === 'services') {
      const services = divisions?.filter(d => d.category === 'tech' || d.category === 'education' || d.category === 'logistics') ?? [];
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {services.map(div => {
            const DivIcon = getIcon(div.iconType || 'briefcase');
            return (
              <div key={div.id} onDoubleClick={() => openWindow({ id: `svc-${div.id}`, title: div.name, windowType: toWindowType(div.windowType), data: { url: div.websiteUrl, content: div.notepadContent, division: div } })} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 cursor-pointer rounded border border-transparent hover:border-blue-200 transition-colors">
                <DivIcon className="w-10 h-10 text-green-500" />
                <span className="text-xs text-center font-medium leading-tight">{div.name}</span>
                <span className="text-[10px] text-slate-400 capitalize">{div.category}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center text-slate-400 py-12">
        <Icons.FolderOpen className="w-16 h-16 mb-4 opacity-50" />
        <p>This folder is empty.</p>
      </div>
    );
  };

  const itemCount = (() => {
    if (section === 'divisions') return `${divisions?.length ?? 0} objects`;
    if (section === 'documents') return `${allDocuments?.length ?? 0} files`;
    if (section === 'press-kit') return `${pressKitDocs.length} files`;
    if (section === 'investor') return `${investorDocs.length} files`;
    return '';
  })();

  const titleForSection = tree.find(t => t.id === section)?.label ?? section;

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 text-sm">
      {/* Toolbar */}
      <div className="bg-slate-200 border-b border-slate-300 p-2 flex items-center gap-2">
        <button onClick={goBack} disabled={histIdx === 0} className="flex items-center gap-1 px-2 py-1 hover:bg-slate-300 rounded text-slate-700 disabled:opacity-40">
          <Icons.ArrowLeft className="w-4 h-4 text-green-600" /> Back
        </button>
        <button onClick={goForward} disabled={histIdx >= history.length - 1} className="flex items-center gap-1 px-2 py-1 hover:bg-slate-300 rounded text-slate-700 disabled:opacity-40">
          Forward <Icons.ArrowRight className="w-4 h-4 text-green-600" />
        </button>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-slate-600 shrink-0">Address</span>
          <div className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 flex items-center shadow-inner">
            <Icons.HardDrive className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <span className="text-sm truncate">{sectionAddress[section]}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Tree */}
        <div className="w-56 bg-white border-r border-slate-300 overflow-y-auto hidden md:flex flex-col p-2 gap-0.5">
          {tree.map(node => (
            <div
              key={node.id}
              onClick={() => navigate(node.id)}
              className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded transition-colors ${section === node.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50'}`}
              style={{ paddingLeft: `${(node.indent ?? 0) * 12 + 8}px` }}
            >
              <node.icon className="w-4 h-4 shrink-0 text-blue-500" />
              <span className="text-xs truncate">{node.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          <div className="text-xs font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4 uppercase tracking-wider">
            {titleForSection}
          </div>
          {renderItems()}
        </div>

        {/* Right-side Info Panel */}
        <div className="w-44 bg-slate-50 border-l border-slate-200 hidden lg:flex flex-col p-4 gap-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details</div>
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-xs text-slate-500">Location</div>
            <div className="text-xs font-medium text-slate-800 break-all">{sectionAddress[section]}</div>
          </div>
          {itemCount && (
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Contents</div>
              <div className="text-sm font-medium text-slate-800">{itemCount}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-slate-200 border-t border-slate-300 flex items-center px-4 text-xs text-slate-600 justify-between">
        <span>{itemCount || `${titleForSection}`}</span>
        <span>NJAYCO (C:) · Connected</span>
      </div>
    </div>
  );
}
