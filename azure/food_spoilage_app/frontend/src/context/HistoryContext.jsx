import { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();
const BASE = 'http://127.0.0.1:5000';

export function HistoryProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [loadingHistory, setLoading] = useState(true);

  // ─────────────────────────────
  // ✅ FETCH HISTORY
  // ─────────────────────────────
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE}/history`);
      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();

      // ✅ Normalize IDs (IMPORTANT)
      const cleanData = data.map(r => ({
        ...r,
        id: Number(r.id)
      }));

      console.log("✅ Clean history:", cleanData);

      setRecords(cleanData);

    } catch (err) {
      console.error("❌ History load error:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ─────────────────────────────
  // ✅ ADD RECORD
  // ─────────────────────────────
  const addRecord = (record) => {
    const clean = {
      ...record,
      id: Number(record.id)
    };

    setRecords(prev => [clean, ...prev]);
    return clean;
  };

  // ─────────────────────────────
  // ✅ DELETE RECORD (FIXED CORE LOGIC)
  // ─────────────────────────────
  const deleteRecord = async (id) => {
    const numericId = Number(id);

    console.log("🗑️ Deleting ID:", numericId);

    // ✅ Optimistic UI update (instant remove)
    const previous = [...records];
    setRecords(prev => prev.filter(r => Number(r.id) !== numericId));

    try {
      const res = await fetch(`${BASE}/delete/${numericId}`, {
        method: 'DELETE'
      });

      const data = await res.json().catch(() => ({}));

      // ❗ IMPORTANT CHANGE
      // Even if backend says "Not found", we consider success
      // because DB might already be in correct state
      if (!res.ok && data.error !== "Not found") {
        throw new Error(data.error || "Delete failed");
      }

      console.log("✅ Delete confirmed by backend");

      return { success: true };

    } catch (err) {
      console.error("❌ Delete error:", err);

      // 🔁 Rollback UI if real failure
      setRecords(previous);

      return { success: false, error: err.message };
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        records,
        addRecord,
        deleteRecord,
        loadingHistory,
        refreshHistory: fetchHistory
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);