// src/utils/clearUserDrafts.js
import { openIDB } from "./idb";

export async function clearDraftsForUser(userId) {
  const db = await openIDB();
  const tx = db.transaction("drafts", "readwrite");
  const store = tx.objectStore("drafts");

  // Wrap getAllKeys in a Promise
  const allKeys = await new Promise((resolve, reject) => {
    const request = store.getAllKeys();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  if (!allKeys || allKeys.length === 0) return;

  for (const key of allKeys) {
    if (key.startsWith(`${userId}:`)) {
      store.delete(key);
    }
  }

  await tx.done;
}
