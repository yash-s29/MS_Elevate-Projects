import { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

const load = () => { try { return JSON.parse(localStorage.getItem('spoilage_history') || '[]'); } catch { return []; } };
const save = d => { try { localStorage.setItem('spoilage_history', JSON.stringify(d)); } catch {} };

export function HistoryProvider({ children }) {
  const [records, setRecords] = useState(load);
  const addRecord = record => {
    const now = new Date();
    const ts = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    const nr = { ...record, id: Date.now(), timestamp: ts };
    const updated = [nr, ...records];
    setRecords(updated); save(updated);
    return nr;
  };
  const deleteRecord = id => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated); save(updated);
  };
  return <HistoryContext.Provider value={{ records, addRecord, deleteRecord }}>{children}</HistoryContext.Provider>;
}
export const useHistory = () => useContext(HistoryContext);
