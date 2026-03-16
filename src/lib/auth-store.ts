"use client";

export interface User {
  phone: string;
  name: string;
}

const DAILY_LIMIT = 5; // TODO: change back to 20 for production
const WARNING_THRESHOLD = 3;

export interface AuthState {
  user: User | null;
  messageCount: number;
}

let snapshot: AuthState = { user: null, messageCount: 0 };
let listeners: (() => void)[] = [];

function notify() {
  // Create a new snapshot reference so useSyncExternalStore detects the change
  snapshot = { user: snapshot.user, messageCount: snapshot.messageCount };
  listeners.forEach((l) => l());
}

export function subscribeAuth(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getAuthState(): AuthState {
  return snapshot;
}

export function isLoggedIn() {
  return snapshot.user !== null;
}

export function getUser() {
  return snapshot.user;
}

export function login(phone: string) {
  snapshot = { user: { phone, name: phone }, messageCount: 0 };
  listeners.forEach((l) => l());
}

export function logout() {
  snapshot = { user: null, messageCount: 0 };
  listeners.forEach((l) => l());
}

export function getMessagesRemaining() {
  if (snapshot.user) return Infinity;
  return Math.max(0, DAILY_LIMIT - snapshot.messageCount);
}

export function getMessageCount() {
  return snapshot.messageCount;
}

export function shouldShowWarning() {
  if (snapshot.user) return false;
  const remaining = getMessagesRemaining();
  return remaining > 0 && remaining <= WARNING_THRESHOLD;
}

export function isLimitReached() {
  if (snapshot.user) return false;
  return getMessagesRemaining() <= 0;
}

/** Call this when a guest sends a message. Returns true if allowed. */
export function recordGuestMessage(): boolean {
  if (snapshot.user) return true;
  if (snapshot.messageCount >= DAILY_LIMIT) return false;
  snapshot = { ...snapshot, messageCount: snapshot.messageCount + 1 };
  listeners.forEach((l) => l());
  return true;
}
