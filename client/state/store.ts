// Simple frontend-only store using localStorage

const USER_KEY = "fra_user";
const CLAIMS_KEY = "fra_claims";

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function getClaims() {
  try {
    const raw = JSON.parse(localStorage.getItem(CLAIMS_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveClaims(claims) {
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
}

export function addClaim(claim) {
  const list = getClaims();
  const withId = { id: crypto.randomUUID(), createdAt: Date.now(), status: "Pending", ...claim };
  list.unshift(withId);
  saveClaims(list);
  return withId;
}

export function updateClaimStatus(id, status) {
  const list = getClaims();
  const updated = list.map((c) => (c.id === id ? { ...c, status } : c));
  saveClaims(updated);
  return updated.find((c) => c.id === id) || null;
}

export function deleteClaim(id) {
  const list = getClaims();
  const next = list.filter((c) => c.id !== id);
  saveClaims(next);
  return next;
}
