import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useGetAdminStats, useGetDivisions, useUpdateDivision } from '@/hooks/use-music-hooks';

export function AdminApp() {
  const { data: stats } = useGetAdminStats();
  const { data: divisions } = useGetDivisions();
  
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-full bg-slate-100 font-sans">
      {/* Sidebar Nav */}
      <div className="w-56 bg-slate-800 text-slate-300 flex flex-col">
        <div className="p-4 border-b border-slate-700 bg-slate-900">
          <h2 className="text-white font-bold tracking-wider flex items-center gap-2">
            <Icons.ShieldCheck className="w-5 h-5 text-blue-400" />
            NJAYCO ADMIN
          </h2>
        </div>
        <div className="flex flex-col p-2 gap-1 overflow-y-auto">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Icons.LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem active={activeTab === 'divisions'} onClick={() => setActiveTab('divisions')} icon={<Icons.Building2 size={18} />} label="Divisions Manager" />
          <NavItem active={activeTab === 'music'} onClick={() => setActiveTab('music')} icon={<Icons.Music size={18} />} label="Music Library" />
          <NavItem active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<Icons.FileText size={18} />} label="Documents" />
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Icons.Settings size={18} />} label="System Settings" />
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <div className="h-14 bg-white border-b border-slate-200 flex items-center px-6 shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Divisions" value={stats?.totalDivisions || 0} icon={<Icons.Building2 className="text-blue-500" />} />
                <StatCard title="Active Music Tracks" value={stats?.totalTracks || 0} icon={<Icons.Music className="text-green-500" />} />
                <StatCard title="System Documents" value={stats?.totalDocuments || 0} icon={<Icons.FileText className="text-orange-500" />} />
                <StatCard title="System Status" value="Healthy" icon={<Icons.Activity className="text-purple-500" />} />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Icons.AlertCircle className="w-5 h-5 text-amber-500"/> System Alerts</h3>
                <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-sm">
                  Welcome to the Administrator Panel. From here you can manage all content that populates the NJAYCO OS experience. 
                  Currently running in local sandbox mode. API integrations will surface data here.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'divisions' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">Manage Divisions</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Icons.Plus className="w-4 h-4" /> Add Division
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {divisions ? divisions.map(div => (
                      <tr key={div.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                            <Icons.Folder className="w-4 h-4 text-slate-500" />
                          </div>
                          {div.name}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${div.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {div.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 capitalize">{div.category}</td>
                        <td className="p-4">
                          <button className="text-blue-600 hover:underline font-medium">Edit</button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500">No divisions found or API missing.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'}`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
      </div>
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
        {icon}
      </div>
    </div>
  );
}
