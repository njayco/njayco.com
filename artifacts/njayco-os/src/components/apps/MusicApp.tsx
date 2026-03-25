import { useState } from 'react';
import { useGetArtists, useGetAlbums } from '@/hooks/use-music-hooks';
import * as Icons from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function MusicApp() {
  const { data: artists, isLoading: artistsLoading } = useGetArtists();
  const { data: albums, isLoading: albumsLoading } = useGetAlbums();
  
  const [activeTab, setActiveTab] = useState('store');
  
  return (
    <div className="flex flex-col h-full bg-[#e3e6ec] text-slate-800 font-sans">
      {/* Top Header/Player */}
      <div className="h-16 bg-gradient-to-b from-[#f5f6f8] to-[#d4d8e0] border-b border-[#aeb3bc] flex items-center px-4 justify-between shadow-sm">
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full border border-[#9ea3ab] bg-gradient-to-b from-white to-[#e3e6ec] flex items-center justify-center shadow-sm hover:brightness-105 active:scale-95">
            <Icons.SkipBack className="w-4 h-4 text-slate-600" fill="currentColor" />
          </button>
          <button className="w-10 h-10 rounded-full border border-[#9ea3ab] bg-gradient-to-b from-white to-[#e3e6ec] flex items-center justify-center shadow-sm hover:brightness-105 active:scale-95">
            <Icons.Play className="w-5 h-5 text-slate-600 ml-1" fill="currentColor" />
          </button>
          <button className="w-8 h-8 rounded-full border border-[#9ea3ab] bg-gradient-to-b from-white to-[#e3e6ec] flex items-center justify-center shadow-sm hover:brightness-105 active:scale-95">
            <Icons.SkipForward className="w-4 h-4 text-slate-600" fill="currentColor" />
          </button>
        </div>
        
        <div className="w-1/3 max-w-md h-10 bg-white border border-[#9ea3ab] rounded shadow-inner flex flex-col items-center justify-center px-4">
          <div className="text-xs font-bold text-slate-700">UV Music Group</div>
          <div className="w-full bg-slate-200 h-1 mt-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-0"></div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Icons.Search className="w-4 h-4 text-slate-500" />
          <input 
            placeholder="Search Store" 
            className="border border-[#9ea3ab] rounded-full px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-400 w-48 shadow-inner"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-48 bg-[#dde1e7] border-r border-[#aeb3bc] overflow-y-auto">
          <div className="p-4 flex flex-col gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 mb-1 px-2 uppercase tracking-wider">Library</div>
              <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#c8ccd4] rounded text-sm text-slate-700 font-medium"><Icons.Music className="w-4 h-4 text-blue-500" /> Music</button>
              <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#c8ccd4] rounded text-sm text-slate-700 font-medium"><Icons.Video className="w-4 h-4 text-blue-500" /> Videos</button>
            </div>
            
            <div>
              <div className="text-xs font-bold text-slate-500 mb-1 px-2 uppercase tracking-wider">Store</div>
              <button onClick={() => setActiveTab('store')} className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm font-medium ${activeTab === 'store' ? 'bg-[#3b82f6] text-white shadow-sm' : 'hover:bg-[#c8ccd4] text-slate-700'}`}>
                <Icons.Store className="w-4 h-4" /> iTunes Store
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#c8ccd4] rounded text-sm text-slate-700 font-medium"><Icons.Radio className="w-4 h-4 text-blue-500" /> Radio</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Icons.Sparkles className="text-primary" />
            Featured Artists & Releases
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albumsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : albums && albums.length > 0 ? (
              albums.map(album => (
                <div key={album.id} className="group cursor-pointer">
                  <div className="aspect-square bg-slate-100 rounded-md shadow-md overflow-hidden relative mb-2">
                    {album.coverUrl ? (
                      <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-800 to-slate-600">
                        <Icons.Music className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center hover:scale-110 transition-transform">
                        <Icons.Play className="w-5 h-5 text-white ml-1" fill="white" />
                      </button>
                    </div>
                  </div>
                  <div className="font-bold text-sm truncate">{album.title}</div>
                  <div className="text-xs text-slate-500 truncate">{album.artistName}</div>
                  <div className="mt-1"><span className="px-2 py-0.5 border border-slate-300 rounded text-xs font-medium hover:bg-slate-100">${album.price.toFixed(2)}</span></div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center text-slate-400">
                <Icons.Disc3 className="w-16 h-16 mb-4 opacity-50" />
                <p>The music library is currently empty.</p>
                <p className="text-sm">Seed the database to see artists and albums here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
