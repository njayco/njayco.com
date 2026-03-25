import { useState } from 'react';

export function NotepadApp({ data }: { data?: { content?: string } }) {
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
      
      {/* Editor */}
      <textarea 
        className="flex-1 w-full resize-none outline-none p-2 font-mono text-sm leading-relaxed"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
