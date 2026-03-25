import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useGetAdminStats, useGetDivisions, useGetDocuments, useGetArtists, useGetAlbums, useGetTracks, useUpdateDivision } from '@/hooks/use-music-hooks';
import { useDesktopStore } from '@/store/use-desktop-store';
import { Skeleton } from '@/components/ui/skeleton';

type AdminTab = 'dashboard' | 'divisions' | 'content' | 'music' | 'documents' | 'users' | 'analytics' | 'desktop' | 'settings';

interface NavSection {
  label: string;
  items: { id: AdminTab; icon: React.ReactNode; label: string }[];
}

const navSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', icon: <Icons.LayoutDashboard size={16} />, label: 'Dashboard' },
      { id: 'analytics', icon: <Icons.TrendingUp size={16} />, label: 'Analytics' },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'divisions', icon: <Icons.Building2 size={16} />, label: 'Divisions Manager' },
      { id: 'content', icon: <Icons.PenSquare size={16} />, label: 'Content Manager' },
      { id: 'music', icon: <Icons.Music size={16} />, label: 'Music Library' },
      { id: 'documents', icon: <Icons.FileText size={16} />, label: 'Documents' },
    ],
  },
  {
    label: 'Access',
    items: [
      { id: 'users', icon: <Icons.Users size={16} />, label: 'Users & Roles' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'desktop', icon: <Icons.Monitor size={16} />, label: 'Desktop Layout' },
      { id: 'settings', icon: <Icons.Settings size={16} />, label: 'System Settings' },
    ],
  },
];

export function AdminApp() {
  const { data: stats } = useGetAdminStats();
  const { data: divisions, isLoading: divisionsLoading } = useGetDivisions();
  const { data: documents, isLoading: docsLoading } = useGetDocuments();
  const { data: artists } = useGetArtists();
  const { data: albums } = useGetAlbums();
  const { data: tracks } = useGetTracks();
  const { alwaysShowStartup, setAlwaysShowStartup, setVisited, setUser, windows } = useDesktopStore();
  const updateDivision = useUpdateDivision();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingDiv, setEditingDiv] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');

  const saveStatus = (divId: number) => {
    updateDivision.mutate({ id: divId, status: editStatus as 'live' | 'development' | 'concept' });
    setEditingDiv(null);
  };

  const activeWindows = windows.length;
  const liveDivisions = divisions?.filter(d => d.status === 'live').length ?? 0;
  const totalDivisions = divisions?.length ?? 0;

  return (
    <div className="flex h-full bg-slate-100 font-sans text-sm">
      {/* Sidebar Nav */}
      <div className="w-52 bg-slate-900 text-slate-400 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-700 bg-slate-950">
          <h2 className="text-white font-bold tracking-wider flex items-center gap-2 text-sm">
            <Icons.ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            NJAYCO ADMIN
          </h2>
        </div>
        <div className="flex flex-col py-3 gap-0">
          {navSections.map(section => (
            <div key={section.label}>
              <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">{section.label}</div>
              {section.items.map(item => (
                <NavItem key={item.id} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} icon={item.icon} label={item.label} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <h1 className="text-base font-bold text-slate-800">
            {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label ?? activeTab}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Icons.Circle className="w-2 h-2 text-green-500 fill-green-500" />
            <span>API Online</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Divisions" value={stats?.totalDivisions ?? 0} sub={`${liveDivisions} live`} icon={<Icons.Building2 className="text-blue-500 w-6 h-6" />} color="blue" />
                <StatCard title="Music Tracks" value={stats?.totalTracks ?? 0} sub={`${albums?.length ?? 0} albums`} icon={<Icons.Music className="text-green-500 w-6 h-6" />} color="green" />
                <StatCard title="Documents" value={stats?.totalDocuments ?? 0} sub="across all categories" icon={<Icons.FileText className="text-orange-500 w-6 h-6" />} color="orange" />
                <StatCard title="Open Windows" value={activeWindows} sub="current session" icon={<Icons.AppWindow className="text-purple-500 w-6 h-6" />} color="purple" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                    <Icons.Building2 className="w-4 h-4 text-blue-500" /> Division Overview
                  </h3>
                  <div className="space-y-2">
                    {['music', 'tech', 'education', 'logistics', 'media', 'corporate', 'creative'].map(cat => {
                      const count = divisions?.filter(d => d.category === cat).length ?? 0;
                      const pct = totalDivisions > 0 ? (count / totalDivisions) * 100 : 0;
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 w-20 capitalize">{cat}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-medium w-4 text-right text-slate-700">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                    <Icons.AlertCircle className="w-4 h-4 text-amber-500" /> System Alerts
                  </h3>
                  <div className="space-y-2">
                    <AlertRow level="info" text={`${totalDivisions} total divisions loaded from database.`} />
                    <AlertRow level="success" text={`${liveDivisions} divisions are marked as live.`} />
                    {(totalDivisions - liveDivisions) > 0 && <AlertRow level="warn" text={`${totalDivisions - liveDivisions} division(s) not yet live.`} />}
                    <AlertRow level="info" text="API running in sandbox mode. All content is real-time." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Divisions" value={totalDivisions} sub={`${liveDivisions} active`} icon={<Icons.Building2 className="text-blue-500 w-6 h-6" />} color="blue" />
                <StatCard title="Artists" value={artists?.length ?? 0} sub="registered" icon={<Icons.Mic2 className="text-pink-500 w-6 h-6" />} color="pink" />
                <StatCard title="Albums" value={albums?.length ?? 0} sub={`${tracks?.length ?? 0} tracks`} icon={<Icons.Disc className="text-green-500 w-6 h-6" />} color="green" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">Content Distribution</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">By Division Status</h4>
                    {[
                      { label: 'Live', count: divisions?.filter(d => d.status === 'live').length ?? 0, color: 'bg-green-400' },
                      { label: 'In Development', count: divisions?.filter(d => d.status === 'development').length ?? 0, color: 'bg-blue-400' },
                      { label: 'Concept', count: divisions?.filter(d => d.status === 'concept').length ?? 0, color: 'bg-amber-400' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${row.color}`} />
                        <span className="text-sm text-slate-600 flex-1">{row.label}</span>
                        <span className="font-bold text-slate-800">{row.count}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Documents by Category</h4>
                    {['corporate', 'investor', 'press', 'legal', 'services'].map(cat => {
                      const count = documents?.filter(d => d.category === cat).length ?? 0;
                      return (
                        <div key={cat} className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-slate-600 capitalize flex-1">{cat}</span>
                          <span className="font-bold text-slate-800">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'divisions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">{totalDivisions} divisions total · {liveDivisions} live</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
                  <Icons.Plus className="w-3 h-3" /> Add Division
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-semibold">Name</th>
                        <th className="p-3 font-semibold">Category</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold">Order</th>
                        <th className="p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {divisionsLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i}><td colSpan={5} className="p-3"><Skeleton className="h-5 w-full" /></td></tr>
                        ))
                      ) : divisions?.map(div => (
                        <tr key={div.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-medium text-slate-800">{div.name}</td>
                          <td className="p-3 text-slate-500 capitalize">{div.category}</td>
                          <td className="p-3">
                            {editingDiv === div.id ? (
                              <select
                                value={editStatus}
                                onChange={e => setEditStatus(e.target.value)}
                                className="border border-slate-300 rounded px-2 py-1 text-xs"
                              >
                                <option value="live">live</option>
                                <option value="development">development</option>
                                <option value="concept">concept</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${div.status === 'live' ? 'bg-green-100 text-green-700' : div.status === 'development' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                {div.status}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-500">{div.sortOrder}</td>
                          <td className="p-3 flex items-center gap-2">
                            {editingDiv === div.id ? (
                              <>
                                <button onClick={() => saveStatus(div.id)} className="text-green-600 hover:text-green-800 font-medium">Save</button>
                                <button onClick={() => setEditingDiv(null)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                              </>
                            ) : (
                              <button onClick={() => { setEditingDiv(div.id); setEditStatus(div.status); }} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Icons.PenSquare className="w-5 h-5 text-blue-500" /> Content Manager
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Divisions', count: totalDivisions, icon: <Icons.Building2 className="w-5 h-5" />, color: 'text-blue-600', action: () => setActiveTab('divisions') },
                    { title: 'Documents', count: documents?.length ?? 0, icon: <Icons.FileText className="w-5 h-5" />, color: 'text-orange-600', action: () => setActiveTab('documents') },
                    { title: 'Music Library', count: tracks?.length ?? 0, icon: <Icons.Music className="w-5 h-5" />, color: 'text-green-600', action: () => setActiveTab('music') },
                    { title: 'Artists', count: artists?.length ?? 0, icon: <Icons.Mic2 className="w-5 h-5" />, color: 'text-pink-600', action: () => setActiveTab('music') },
                  ].map(item => (
                    <button key={item.title} onClick={item.action} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-all text-left">
                      <div className={`w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center ${item.color}`}>{item.icon}</div>
                      <div>
                        <div className="font-semibold text-slate-800">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.count} items</div>
                      </div>
                      <Icons.ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <StatCard title="Artists" value={artists?.length ?? 0} icon={<Icons.Mic2 className="text-pink-500 w-5 h-5" />} color="pink" />
                <StatCard title="Albums" value={albums?.length ?? 0} icon={<Icons.Disc className="text-blue-500 w-5 h-5" />} color="blue" />
                <StatCard title="Tracks" value={tracks?.length ?? 0} icon={<Icons.Music className="text-green-500 w-5 h-5" />} color="green" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Albums</h3>
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg">Add Album</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {albums?.length ? albums.map(album => (
                    <div key={album.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50">
                      <Icons.Disc className="w-8 h-8 text-blue-300 shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{album.title}</div>
                        <div className="text-xs text-slate-500">{album.releaseYear} · {album.genre}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-slate-400">No albums in database yet.</div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Tracks</h3>
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg">Add Track</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {tracks?.length ? tracks.map(track => (
                    <div key={track.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50">
                      <Icons.Music className="w-5 h-5 text-green-400 shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{track.title}</div>
                        <div className="text-xs text-slate-500">{track.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}` : 'Unknown'}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${track.isExplicit ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{track.isExplicit ? 'Explicit' : 'Clean'}</span>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-slate-400">No tracks in database yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">{documents?.length ?? 0} documents total</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
                  <Icons.Plus className="w-3 h-3" /> Add Document
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {docsLoading ? (
                  <div className="p-6 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-3 font-semibold text-left">Filename</th>
                        <th className="p-3 font-semibold text-left">Category</th>
                        <th className="p-3 font-semibold text-left">Type</th>
                        <th className="p-3 font-semibold text-left">Public</th>
                        <th className="p-3 font-semibold text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documents?.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">{doc.filename}</td>
                          <td className="p-3 capitalize text-slate-500">{doc.category}</td>
                          <td className="p-3 uppercase text-slate-400 font-mono">{doc.fileType}</td>
                          <td className="p-3">{doc.public ? <span className="text-green-600 font-medium">Yes</span> : <span className="text-red-500">No</span>}</td>
                          <td className="p-3 text-blue-600 hover:underline cursor-pointer font-medium">Edit</td>
                        </tr>
                      )) ?? <tr><td colSpan={5} className="p-8 text-center text-slate-400">No documents.</td></tr>}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Icons.Users className="w-5 h-5 text-blue-500" /> Users & Roles
                </h3>
                <div className="space-y-3">
                  {[
                    { role: 'Administrator', desc: 'Full access to all system settings, content management, and division editors.', icon: <Icons.ShieldCheck className="w-5 h-5 text-blue-600" />, badge: 'Active', badgeColor: 'bg-blue-100 text-blue-700' },
                    { role: 'User', desc: 'Read/write access to desktop apps. Can edit documents and explore the OS.', icon: <Icons.User className="w-5 h-5 text-green-600" />, badge: 'Active', badgeColor: 'bg-green-100 text-green-700' },
                    { role: 'Guest', desc: 'Read-only access. Documents are view-only. No admin capabilities.', icon: <Icons.UserCheck className="w-5 h-5 text-slate-500" />, badge: 'Active', badgeColor: 'bg-slate-100 text-slate-600' },
                  ].map(r => (
                    <div key={r.role} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">{r.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800">{r.role}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.badgeColor}`}>{r.badge}</span>
                        </div>
                        <p className="text-xs text-slate-500">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                <strong>Note:</strong> User account creation and RBAC management are configured server-side via the ADMIN_TOKEN environment variable. Guests are auto-assigned on arrival.
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Icons.Monitor className="w-5 h-5 text-blue-500" /> Desktop Layout Editor
                </h3>
                <p className="text-xs text-slate-500 mb-4">Control which divisions appear as desktop icons, their sort order, and display mode. Changes are saved to the database.</p>
                <div className="space-y-2">
                  {divisions?.map(div => (
                    <div key={div.id} className="flex items-center justify-between py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <Icons.GripVertical className="w-4 h-4 text-slate-300" />
                        <span className="font-medium text-slate-800">{div.name}</span>
                        <span className="text-xs text-slate-400">#{div.sortOrder}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${div.status === 'live' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{div.status}</span>
                        <button className="text-xs text-slate-500 hover:text-blue-600">⇅</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Icons.Monitor className="w-5 h-5 text-blue-500" /> Boot &amp; Login
                </h3>
                <p className="text-xs text-slate-500 mb-5">Control the startup experience shown when visitors open NJAYCO OS.</p>

                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Always show boot &amp; login on startup</p>
                    <p className="text-xs text-slate-500 mt-0.5">When enabled, every visit will play through the full boot sequence and login screen, even for returning visitors.</p>
                  </div>
                  <button
                    onClick={() => setAlwaysShowStartup(!alwaysShowStartup)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${alwaysShowStartup ? 'bg-blue-600' : 'bg-slate-300'}`}
                    role="switch"
                    aria-checked={alwaysShowStartup}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${alwaysShowStartup ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Reset visit state</p>
                    <p className="text-xs text-slate-500 mt-0.5">Clears the stored session so the next page load will show the full boot sequence.</p>
                  </div>
                  <button
                    onClick={() => { setVisited(false); setUser(null); }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Icons.Info className="w-5 h-5 text-slate-400" /> System Info
                </h3>
                <p className="text-xs text-slate-500 mb-4">Details about the current NJAYCO OS environment.</p>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <dt className="text-slate-500">OS Version</dt><dd className="font-medium text-slate-800">NJAYCO OS 1.0</dd>
                  <dt className="text-slate-500">Build</dt><dd className="font-medium text-slate-800">2025.03</dd>
                  <dt className="text-slate-500">API Status</dt><dd className="font-medium text-green-600">Online</dd>
                  <dt className="text-slate-500">Divisions loaded</dt><dd className="font-medium text-slate-800">{stats?.totalDivisions ?? '…'}</dd>
                  <dt className="text-slate-500">Tracks</dt><dd className="font-medium text-slate-800">{stats?.totalTracks ?? '…'}</dd>
                  <dt className="text-slate-500">Documents</dt><dd className="font-medium text-slate-800">{stats?.totalDocuments ?? '…'}</dd>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 text-xs font-medium transition-colors w-full text-left ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'}`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ title, value, sub, icon, color }: { title: string; value: string | number; sub?: string; icon: React.ReactNode; color: string }) {
  const colorMap: Record<string, string> = { blue: 'bg-blue-50', green: 'bg-green-50', orange: 'bg-orange-50', purple: 'bg-purple-50', pink: 'bg-pink-50' };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-xs font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <div className={`w-10 h-10 rounded-full ${colorMap[color] ?? 'bg-slate-50'} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

function AlertRow({ level, text }: { level: 'info' | 'success' | 'warn'; text: string }) {
  const styles = { info: 'text-blue-700 bg-blue-50 border-blue-200', success: 'text-green-700 bg-green-50 border-green-200', warn: 'text-amber-700 bg-amber-50 border-amber-200' };
  const icons = { info: <Icons.Info className="w-3.5 h-3.5 shrink-0" />, success: <Icons.CheckCircle2 className="w-3.5 h-3.5 shrink-0" />, warn: <Icons.AlertTriangle className="w-3.5 h-3.5 shrink-0" /> };
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${styles[level]}`}>
      {icons[level]}{text}
    </div>
  );
}
