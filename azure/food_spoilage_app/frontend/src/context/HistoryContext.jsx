import { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

function load() {
  try { return JSON.parse(localStorage.getItem('spoilage_history') || '[]'); }
  catch { return []; }
}
function save(data) {
  try { localStorage.setItem('spoilage_history', JSON.stringify(data)); } catch {}
}

export function HistoryProvider({ children }) {
  const [records, setRecords] = useState(load);

  const addRecord = (record) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const newRecord = { ...record, id: Date.now(), timestamp };
    const updated = [newRecord, ...records];
    setRecords(updated);
    save(updated);
    return newRecord;
  };

  const deleteRecord = (id) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    save(updated);
  };

  return (
    <HistoryContext.Provider value={{ records, addRecord, deleteRecord }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);
