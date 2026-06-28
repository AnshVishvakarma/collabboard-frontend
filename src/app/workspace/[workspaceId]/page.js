'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building, Users, MessageSquare, Settings, Hash, Activity, Folder, ArrowRight, AlertCircle, Sparkles , Plus } from 'lucide-react';
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { CreateChannelModal } from '../../../components/workspace/CreateChannelModal';

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showChannelModal, setShowChannelModal] = useState(false);


  const handleChannelCreated = (newChannel) => {
    setChannels([...channels, newChannel]);
  };

  const openModal = () => {
    router.push('/dashboard');
  };

  useEffect(() => {
    // ✅ Check token directly
    const token = localStorage.getItem('accessToken');
    console.log("🔑 Token in workspace page:", token ? "Exists ✅" : "Missing ❌");
    
    if (!token) {
      console.log("❌ No token found, redirecting to login");
      router.push('/login');
      return;
    }

    // ✅ Verify user with token
    verifyUser(token);
  }, []);

  const verifyUser = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("📡 /api/auth/me status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ User verified:", data.user);
        setUser(data.user);
        // ✅ Now fetch workspace
        fetchWorkspace(token);
      } else {
        console.log("❌ Token invalid, redirecting to login");
        localStorage.removeItem('accessToken');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      router.push('/login');
    }
  };

  const fetchWorkspace = async (token) => {
    try {
      console.log("📡 Fetching workspace:", workspaceId);
      
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("📡 Workspace API status:", response.status);
      const data = await response.json();
      console.log("📦 Workspace data:", data);

      if (data.success) {
        setWorkspace(data.workspace);
        setChannels(data.workspace.channels || []);
      } else {
        setError(data.message || 'Failed to load workspace');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('❌ Error fetching workspace:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout onOpenCreateWorkspace={openModal}>
        <div className="flex flex-col items-center justify-center h-[65vh]">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-slate-200 dark:border-slate-800 rounded-full absolute" />
            <div className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">
            Loading your workspace framework...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout onOpenCreateWorkspace={openModal}>
        <div className="flex items-center justify-center h-[65vh] px-4">
          <div className="max-w-sm w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Initialization Failed</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs leading-relaxed">{error}</p>
            <Button className="mt-5 w-full text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white" onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!workspace) {
    return (
      <DashboardLayout onOpenCreateWorkspace={openModal}>
        <div className="flex items-center justify-center h-[65vh] px-4">
          <div className="max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100 dark:border-slate-700">
              <Building className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">Workspace Offline</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs leading-relaxed">
              This space could not be found or your access parameters have shifted.
            </p>
            <Button className="mt-5 w-full text-xs" variant="outline" onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onOpenCreateWorkspace={openModal}>
      <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
        
        {/* Modern clean Minimalist Header Panel */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {workspace.name}
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed pl-12 max-w-2xl">
                {workspace.description || "No current workflow objective description declared."}
              </p>
            </div>
            
            <div className="flex items-center gap-2 pl-12 sm:pl-0 shrink-0">
              <Button 
                variant="outline" 
                className="gap-1.5 h-8 text-xs font-medium rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Invite
              </Button>
              <Button 
                variant="outline" 
                className="gap-1.5 h-8 text-xs font-medium rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                Config
              </Button>
            </div>
          </div>
        </div>

        {/* Clean Performance Data Cards - strictly Indigo, Emerald, Sky Blue */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Nodes', count: channels.length || 0, icon: Hash, style: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50' },
            { label: 'Total Seat Count', count: workspace.membersCount || 0, icon: Users, style: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50' },
            { label: 'Live Signals', count: 0, icon: Activity, style: 'text-violet-600 bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/50' },
            { label: 'System Files', count: 0, icon: Folder, style: 'text-sky-600 bg-sky-50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/50' },
          ].map((stat, i) => (
            <Card key={i} className="p-4 relative overflow-hidden transition-all duration-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {stat.count}
                  </p>
                </div>
                <div className={`p-2 rounded-lg border ${stat.style}`}>
                  <stat.icon className="w-3.5 h-3.5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Workspace Operations Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Channels Block */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Channels Tree</h2>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono border border-slate-200/60 dark:border-slate-700/60">
                  {channels.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => setShowChannelModal(true)}
              >
                <Plus className="w-4 h-4" />
                Add Channel
              </Button>
            </div>
            
            {channels.length === 0 ? (
              <Card className="p-8 text-center border-dashed border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3 border border-slate-200/60 dark:border-slate-700/60">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-xs font-medium mb-0.5 text-slate-700 dark:text-slate-300">No communication metrics active</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-normal">
                  Initialize a custom workspace thread layout to link team interfaces together.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {channels.map((channel) => (
                  <Card 
                    key={channel.id} 
                    hover 
                    className="p-3.5 cursor-pointer group transition-all duration-150 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between gap-3 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                          <Hash className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                            {channel.name}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[180px]">
                            {channel.description || 'Public collaboration stream'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all self-center shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Hero Element - Completely deep Slate & Indigo design */}
          <Card className="p-5 bg-gradient-to-br from-indigo-500/[0.02] to-transparent border border-indigo-500/10 dark:border-indigo-500/20 rounded-xl relative overflow-hidden">
            <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 rounded-lg flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">Next Action Item</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              You are connected inside <span className="font-medium text-slate-900 dark:text-slate-100">{workspace.name}</span>. Start collaborating directly inside the core chat engine vectors right away.
            </p>
            <Button className="mt-4 w-full gap-1.5 text-xs font-medium h-8 rounded-lg shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none">
              Go to #general
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Card>

        </div>
      </div>
      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={showChannelModal}
        onClose={() => setShowChannelModal(false)}
        onSuccess={handleChannelCreated}
        workspaceId={workspaceId}
      />
    </DashboardLayout>
  );
}