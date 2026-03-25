import { useState, useRef } from 'react';
import { useGetArtists, useGetAlbums, useGetTracks } from '@/hooks/use-music-hooks';
import type { Track, Album } from '@workspace/api-client-react';
import * as Icons from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type TabId = 'store' | 'library' | 'artists' | 'playlists';

export function MusicApp() {
  const { data: artists, isLoading: artistsLoading } = useGetArtists();
  const { data: albums, isLoading: albumsLoading } = useGetAlbums();
  const { data: tracks } = useGetTracks();

  const [activeTab, setActiveTab] = useState<TabId>('store');
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [nowPlayingAlbum, setNowPlayingAlbum] = useState<Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const trackList = tracks ?? [];

  const playTrack = (track: Track, album?: Album) => {
    setNowPlaying(track);
    setNowPlayingAlbum(album ?? null);
    setIsPlaying(true);
    setProgress(0);
    if (track.audioUrl && audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().catch(() => {});
    }
  };

  const playAlbum = (album: Album) => {
    const albumTracks = trackList.filter(t => t.albumId === album.id);
    if (albumTracks.length > 0) playTrack(albumTracks[0], album);
  };

  const skipNext = () => {
    if (!nowPlaying) return;
    const idx = trackList.findIndex(t => t.id === nowPlaying.id);
    const next = trackList[idx + 1] ?? trackList[0];
    if (next) playTrack(next, nowPlayingAlbum ?? undefined);
  };

  const skipPrev = () => {
    if (!nowPlaying) return;
    if (progress > 5) { setProgress(0); return; }
    const idx = trackList.findIndex(t => t.id === nowPlaying.id);
    const prev = trackList[idx - 1] ?? trackList[trackList.length - 1];
    if (prev) playTrack(prev, nowPlayingAlbum ?? undefined);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const totalDuration = nowPlaying?.duration ?? 0;
  const currentTime = Math.floor((progress / 100) * totalDuration);

  return (
    <div className="flex flex-col h-full bg-[#e3e6ec] text-slate-800 font-sans">
      <audio ref={audioRef} onEnded={skipNext} />

      {/* Top Search Bar */}
      <div className="h-12 bg-gradient-to-b from-[#f5f6f8] to-[#d4d8e0] border-b border-[#aeb3bc] flex items-center px-4 justify-between shadow-sm shrink-0">
        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Icons.Music className="w-4 h-4 text-blue-500" />
          UV Music Group
        </div>
        <div className="flex items-center gap-2">
          <Icons.Search className="w-4 h-4 text-slate-500" />
          <input
            placeholder="Search Store"
            className="border border-[#9ea3ab] rounded-full px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-400 w-40 shadow-inner"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-44 bg-[#dde1e7] border-r border-[#aeb3bc] overflow-y-auto shrink-0">
          <div className="p-3 flex flex-col gap-3">
            <div>
              <div className="text-[10px] font-bold text-slate-500 mb-1 px-2 uppercase tracking-wider">Library</div>
              <SidebarBtn active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<Icons.Music className="w-4 h-4" />} label="Music" />
              <SidebarBtn active={activeTab === 'artists'} onClick={() => setActiveTab('artists')} icon={<Icons.Mic2 className="w-4 h-4" />} label="Artists" />
              <SidebarBtn active={activeTab === 'playlists'} onClick={() => setActiveTab('playlists')} icon={<Icons.ListMusic className="w-4 h-4" />} label="Playlists" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 mb-1 px-2 uppercase tracking-wider">Store</div>
              <SidebarBtn active={activeTab === 'store'} onClick={() => setActiveTab('store')} icon={<Icons.Store className="w-4 h-4" />} label="UV Store" />
            </div>
            {nowPlaying && (
              <div className="mt-2 p-2 bg-white/40 rounded-lg border border-white/60">
                <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Now Playing</div>
                <div className="text-xs font-bold text-slate-800 truncate">{nowPlaying.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{nowPlaying.artistName}</div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-y-auto">
          {activeTab === 'store' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <Icons.Sparkles className="text-blue-500 w-5 h-5" /> Featured Albums
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {albumsLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="aspect-square w-full rounded-md" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : albums && albums.length > 0 ? (
                  albums.map(album => (
                    <div key={album.id} className="group cursor-pointer" onDoubleClick={() => playAlbum(album)}>
                      <div className={`aspect-square rounded-md shadow-md overflow-hidden relative mb-2 ${nowPlayingAlbum?.id === album.id ? 'ring-2 ring-blue-500' : ''}`}>
                        {album.coverUrl ? (
                          <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-800 to-slate-600">
                            <Icons.Music className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => playAlbum(album)} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center hover:scale-110 transition-transform">
                            <Icons.Play className="w-5 h-5 text-white ml-1" fill="white" />
                          </button>
                        </div>
                        {nowPlayingAlbum?.id === album.id && isPlaying && (
                          <div className="absolute top-2 left-2 flex gap-0.5 items-end h-4">
                            {[1,2,3].map(i => (
                              <div key={i} className="w-1 bg-blue-400 rounded-sm animate-pulse" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-sm truncate">{album.title}</div>
                      <div className="text-xs text-slate-500 truncate">{album.artistName} · {album.releaseYear}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="px-2 py-0.5 border border-slate-300 rounded text-xs font-medium hover:bg-slate-100">${album.price.toFixed(2)}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${album.albumType === 'ep' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{album.albumType}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 flex flex-col items-center text-slate-400">
                    <Icons.Disc3 className="w-16 h-16 mb-4 opacity-50" />
                    <p>The music library is currently empty.</p>
                    <p className="text-sm">Seed the database to see albums here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <Icons.Music className="w-5 h-5 text-blue-500" /> All Tracks
              </h2>
              <div className="flex flex-col divide-y divide-slate-100">
                {trackList.length > 0 ? trackList.map((track, idx) => (
                  <div key={track.id} onDoubleClick={() => playTrack(track)}
                    className={`flex items-center gap-4 py-2.5 px-2 hover:bg-blue-50 cursor-pointer rounded transition-colors ${nowPlaying?.id === track.id ? 'bg-blue-50' : ''}`}>
                    <div className="w-5 text-xs text-slate-400 text-right">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${nowPlaying?.id === track.id ? 'text-blue-600' : 'text-slate-800'}`}>{track.title}</div>
                      <div className="text-xs text-slate-500 truncate">{track.artistName} · {track.albumTitle}</div>
                    </div>
                    {track.isExplicit && <span className="text-[10px] px-1 border border-slate-300 text-slate-500 rounded">E</span>}
                    <div className="text-xs text-slate-400">{formatTime(track.duration)}</div>
                    <div className="text-xs font-medium text-slate-600">${track.price.toFixed(2)}</div>
                    <button onClick={() => playTrack(track)} className="p-1 hover:text-blue-600 text-slate-400">
                      <Icons.Play className="w-4 h-4" />
                    </button>
                  </div>
                )) : (
                  <div className="py-12 text-center text-slate-400">No tracks available. Add some via the Admin panel.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'artists' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <Icons.Mic2 className="w-5 h-5 text-pink-500" /> Artists
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {artistsLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />) :
                artists?.map(artist => (
                  <div key={artist.id} className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 cursor-pointer flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Icons.User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{artist.name}</div>
                      <div className="text-xs text-slate-500">{artist.genre}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <Icons.ListMusic className="w-16 h-16 opacity-40" />
              <p>No playlists yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Now-Playing Bar */}
      <div className="h-20 bg-gradient-to-b from-[#f0f2f5] to-[#d8dce4] border-t border-[#aeb3bc] flex items-center px-4 gap-4 shrink-0 shadow-inner">
        {/* Track Info */}
        <div className="w-48 flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
            {nowPlaying && nowPlayingAlbum?.coverUrl ? (
              <img src={nowPlayingAlbum.coverUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Icons.Music className="w-6 h-6 text-white/40" />
            )}
          </div>
          <div className="min-w-0">
            {nowPlaying ? (
              <>
                <div className="text-xs font-bold text-slate-800 truncate">{nowPlaying.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{nowPlaying.artistName}</div>
              </>
            ) : (
              <div className="text-xs text-slate-400 italic">Not playing</div>
            )}
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            <button onClick={skipPrev} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors">
              <Icons.SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="w-10 h-10 rounded-full border border-[#9ea3ab] bg-gradient-to-b from-white to-[#e3e6ec] flex items-center justify-center shadow-md hover:brightness-105 active:scale-95"
            >
              {isPlaying
                ? <Icons.Pause className="w-4 h-4 text-slate-700" />
                : <Icons.Play className="w-4 h-4 text-slate-700 ml-0.5" />}
            </button>
            <button onClick={skipNext} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors">
              <Icons.SkipForward className="w-4 h-4" />
            </button>
          </div>
          {/* Scrub bar */}
          <div className="flex items-center gap-2 w-full max-w-sm">
            <span className="text-[10px] text-slate-500 w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="flex-1 h-1.5 accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 w-8">{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="w-36 flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)} className="text-slate-500 hover:text-slate-700 transition-colors">
            {isMuted || volume === 0
              ? <Icons.VolumeX className="w-4 h-4" />
              : volume < 40 ? <Icons.Volume1 className="w-4 h-4" />
              : <Icons.Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false); }}
            className="flex-1 h-1.5 accent-blue-600 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 w-6">{isMuted ? 0 : volume}</span>
        </div>
      </div>
    </div>
  );
}

function SidebarBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm font-medium transition-colors ${active ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-[#c8ccd4] text-slate-700'}`}>
      <span className={active ? 'text-white' : 'text-blue-500'}>{icon}</span>
      {label}
    </button>
  );
}
