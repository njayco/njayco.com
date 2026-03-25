import { useState } from 'react';
import { useDesktopStore } from '@/store/use-desktop-store';

export function NotepadApp({ data }: { data?: { content?: string } }) {
  const user = useDesktopStore(s => s.user);
  const isReadOnly = user === 'guest';
  const [content, setContent] = useState(data?.content || 'New Document\n\n...');

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Menubar */}
      <div className="bg-slate-50 border-b border-slate-200 px-2 flex text-sm text-slate-700 select-none">
        <div className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">File</div>
        <div className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Edit</div>
        <div className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Format</div>
        <div className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">View</div>
        <div className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Help</div>
      </div>

      {isReadOnly && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1 text-xs text-amber-700 flex items-center gap-1 select-none">
          <span className="font-semibold">Read-only</span> — log in as Admin or User to edit this document.
        </div>
      )}
      
      {/* Editor */}
      <textarea 
        className="flex-1 w-full resize-none outline-none p-2 font-mono text-sm leading-relaxed"
        value={content}
        onChange={(e) => !isReadOnly && setContent(e.target.value)}
        readOnly={isReadOnly}
        spellCheck={false}
      />
    </div>
  );
}
