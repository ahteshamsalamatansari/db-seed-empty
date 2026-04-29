"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtimeScores } from '../hooks/useRealtimeScores';
import { DEFAULT_DESIGNATIONS } from '../lib/constants';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Leaderboard from '../components/Leaderboard';
import EmployeeDrawer from '../components/EmployeeDrawer';
import BatchUpdateOverlay from '../components/BatchUpdateOverlay';
import AddMemberModal from '../components/AddMemberModal';
import SharePanel from '../components/SharePanel';
import SyncBar from '../components/SyncBar';
import Toast from '../components/Toast';
import TierGate from '../components/TierGate';

export default function Dashboard() {
  const { members, scores, syncStatus, lastUpdate, fetchInitialData } = useRealtimeScores();
  
  // App State
  const [currentEmp, setCurrentEmp] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  // Modals & Panels
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', icon: '' });
  
  // Edit State
  const [editingEntry, setEditingEntry] = useState(null);

  // URL Modes
  const [isViewMode, setIsViewMode] = useState(false);
  const [tierMode, setTierMode] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hash = window.location.hash;
    if (hash === '#view') {
      setIsViewMode(true);
      document.body.classList.add('view-mode');
    } else if (hash.startsWith('#tier-')) {
      const t = hash.replace('#tier-', '');
      setTierMode(t);
      setActiveFilter(t);
      setIsViewMode(true); // Tier mode is also view-only for editing controls
      document.body.classList.add('view-mode');
    }

    const handleHashChange = () => window.location.reload();
    window.addEventListener('hashchange', handleHashChange);
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsBatchOpen(false);
        setIsAddMemberOpen(false);
        setIsShareOpen(false);
        if (currentEmp) setCurrentEmp(null);
      }
      if (e.key === 'm' && e.ctrlKey) {
        e.preventDefault();
        if (!isViewMode && !tierMode) setIsAddMemberOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentEmp, isViewMode, tierMode]);

  const showToast = (message, type, icon) => {
    setToast({ message, type, icon });
  };

  // -----------------------------------------
  // Mutations
  // -----------------------------------------
  const handleSaveScore = async (memberId, date, score, reason) => {
    try {
      if (editingEntry) {
        await supabase.from('score_entries').update({ score, reason }).eq('id', editingEntry.id);
        showToast('Entry updated', 'success', '✏');
      } else {
        const { error } = await supabase.from('score_entries').upsert({
          member_id: memberId, date, score, reason
        }, { onConflict: 'member_id,date' });
        if (error) throw error;
        showToast('Score saved', 'success', '✓');
      }
      setEditingEntry(null);
    } catch (err) {
      showToast(err.message || 'Failed to save score', 'error', '✕');
    }
  };

  const handleDeleteScore = async (entryId) => {
    if (!confirm('Delete this entry permanently?')) return;
    try {
      await supabase.from('score_entries').delete().eq('id', entryId);
      showToast('Entry deleted', 'info', '🗑');
    } catch (err) {
      showToast('Failed to delete', 'error', '✕');
    }
  };

  const handleBatchSubmit = async (entries) => {
    try {
      const { error } = await supabase.from('score_entries').upsert(entries, { onConflict: 'member_id,date' });
      if (error) throw error;
      showToast(`Saved ${entries.length} scores`, 'success', '⚡');
      setIsBatchOpen(false);
    } catch (err) {
      showToast('Batch update failed', 'error', '✕');
    }
  };

  const handleAddMember = async (name, designation) => {
    try {
      const { error } = await supabase.from('members').insert({ name, designation });
      if (error) throw error;
      showToast(`${name} added`, 'success', '＋');
      setIsAddMemberOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to add member', 'error', '✕');
    }
  };

  const handleRemoveMember = async (member) => {
    if (!confirm(`Remove ${member.name} and all their history permanently?`)) return;
    try {
      await supabase.from('members').delete().eq('id', member.id);
      showToast(`${member.name} removed`, 'info', '🗑');
      if (currentEmp?.id === member.id) setCurrentEmp(null);
    } catch (err) {
      showToast('Failed to remove member', 'error', '✕');
    }
  };

  // -----------------------------------------
  // KPI Calculations for Header
  // -----------------------------------------
  const todayKey = new Date().toISOString().slice(0, 10);
  let visibleMembers = members;
  if (tierMode) {
    visibleMembers = members.filter(m => (m.designation || DEFAULT_DESIGNATIONS[m.name] || 'L3') === tierMode);
  }
  
  let teamTotal = 0, todayCount = 0;
  visibleMembers.forEach(m => {
    const memberScores = scores.filter(s => s.member_id === m.id);
    teamTotal += memberScores.reduce((sum, s) => sum + parseFloat(s.score), 0);
    if (memberScores.some(s => s.date === todayKey)) todayCount++;
  });
  const teamAvg = visibleMembers.length ? teamTotal / visibleMembers.length : 0;

  // Build designations map (combining db with fallback)
  const designations = {};
  members.forEach(m => {
    designations[m.name] = m.designation || DEFAULT_DESIGNATIONS[m.name] || 'L3';
  });

  if (!mounted) return null;

  return (
    <>
      <Header 
        todayCount={todayCount} 
        totalMembers={visibleMembers.length}
        teamTotal={teamTotal}
        teamAvg={teamAvg}
        openSharePanel={() => setIsShareOpen(true)}
        isViewMode={isViewMode}
        openBatch={() => setIsBatchOpen(true)}
        openAddMember={() => setIsAddMemberOpen(true)}
      />

      <div className="layout">
        <Sidebar 
          members={visibleMembers}
          scores={scores}
          currentEmp={currentEmp}
          onSelectEmp={setCurrentEmp}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isViewMode={isViewMode}
          onRemoveMember={handleRemoveMember}
          designations={designations}
        />

        <main className="main">
          {!currentEmp ? (
            tierMode && !identity ? (
              <div className="welcome-state">
                <div className="welcome-icon">🔒</div>
                <div className="welcome-title">{tierMode} Identity Required</div>
                <div className="welcome-sub">Please select your profile to view the leaderboard</div>
              </div>
            ) : (
              <Leaderboard 
                members={members}
                scores={scores}
                designations={designations}
                onSelectEmp={setCurrentEmp}
                isViewMode={isViewMode}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            )
          ) : (
            <EmployeeDrawer 
              emp={currentEmp}
              scores={scores}
              designations={designations}
              onClose={() => setCurrentEmp(null)}
              isViewMode={isViewMode}
              onSaveScore={handleSaveScore}
              onDeleteScore={handleDeleteScore}
              onEditScore={setEditingEntry}
              editingEntry={editingEntry}
              setEditingEntry={setEditingEntry}
            />
          )}
        </main>
      </div>

      <SyncBar syncStatus={syncStatus} lastUpdate={lastUpdate} />
      
      <Toast 
        message={toast.message} 
        type={toast.type} 
        icon={toast.icon} 
        onClose={() => setToast({ message: '', type: 'info', icon: '' })} 
      />

      <BatchUpdateOverlay 
        isOpen={isBatchOpen} 
        onClose={() => setIsBatchOpen(false)}
        members={members}
        scores={scores}
        onBatchSubmit={handleBatchSubmit}
      />

      <AddMemberModal 
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
        existingNames={members.map(m => m.name)}
      />

      <SharePanel 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {tierMode && !identity && (
        <TierGate 
          tierFilter={tierMode}
          members={visibleMembers}
          scores={scores}
          onSelectIdentity={(m) => {
            setIdentity(m);
            // In tier mode, selecting identity unlocks leaderboard but keeps view mode
          }}
        />
      )}
    </>
  );
}
