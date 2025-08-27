// useDraft.js
import { useEffect, useRef, useState, useCallback } from "react";
import { openIDB, idbGet, idbPut, idbDelete } from "../utils/idb";
import { useSelector } from "react-redux";

export function useDraft({ problemId, language }) {
    const user = useSelector(state => state.auth.user)
    const userId = user?._id
  const key = `${userId}:${problemId}:${language}`;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);
  const dbRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    openIDB().then(async (db) => {
      dbRef.current = db;
      // Load draft if exists
      const saved = await idbGet(db, key);
      if (saved && mounted) {
        setCode(saved.code || "")
    }else{
        setCode("")
    }
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [key]);

  const saveDraft = useCallback(
    (nextCode) => {
      setCode(nextCode);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        if (!dbRef.current) return;
        await idbPut(dbRef.current, {
          key,
          userId,
          problemId,
          language,
          code: nextCode,
          updatedAt: Date.now()
        });
      }, 1000*2); // debounce
    },
    [key, userId, problemId, language]
  );

  const clearDraft = useCallback(async () => {
    if (!dbRef.current) return;
    await idbDelete(dbRef.current, key);
    setCode("");
  }, [key]);

  return { code, saveDraft, clearDraft, loading };
}
