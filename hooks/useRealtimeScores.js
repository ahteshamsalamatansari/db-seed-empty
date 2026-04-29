import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_EMPLOYEES, DEFAULT_DESIGNATIONS } from '../lib/constants';

export function useRealtimeScores() {
  const [members, setMembers] = useState([]);
  const [scores, setScores] = useState([]);
  const [syncStatus, setSyncStatus] = useState({ state: 'syncing', label: 'CONNECTING...' });
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Helper to get fallback members
  const getFallbackMembers = () => {
    return DEFAULT_EMPLOYEES.map((name, index) => ({
      id: `fallback-${index}`,
      name,
      designation: DEFAULT_DESIGNATIONS[name] || 'L3'
    }));
  };

  const fetchInitialData = async () => {
    try {
      setSyncStatus({ state: 'syncing', label: 'SYNCING...' });
      
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*');
        
      const { data: scoresData, error: scoresError } = await supabase
        .from('score_entries')
        .select('*');

      if (membersError) throw membersError;
      if (scoresError) throw scoresError;

      // If database is empty, fallback to default employees so UI is visible
      if (!membersData || membersData.length === 0) {
        setMembers(getFallbackMembers());
        setSyncStatus({ state: 'offline', label: 'LOCAL PREVIEW (DB EMPTY)' });
      } else {
        setMembers(membersData);
        setSyncStatus({ state: 'live', label: 'CONNECTED' });
      }
      
      setScores(scoresData || []);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching data:', err);
      // Fallback on error
      setMembers(getFallbackMembers());
      setSyncStatus({ state: 'offline', label: 'LOCAL PREVIEW (DB ERROR)' });
    }
  };

  useEffect(() => {
    if (!supabase) {
      setSyncStatus({ state: 'offline', label: 'LOCAL ONLY - No Supabase' });
      return;
    }

    fetchInitialData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'score_entries' },
        (payload) => {
          fetchInitialData(); // Re-fetch all to ensure consistency, could optimize later
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        (payload) => {
          fetchInitialData();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Already handled initial sync
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setSyncStatus({ state: 'offline', label: 'DISCONNECTED' });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { members, scores, syncStatus, lastUpdate, fetchInitialData };
}
