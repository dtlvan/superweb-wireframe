"use client";

export interface User {
  phone: string;
  name: string;
}

const DAILY_LIMIT = 20;
const WARNING_THRESHOLD = 5;

let user: User | null = null;
let messageCount = 0;
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeAuth(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getAuthState() {
  return { user, messageCount };
}

export function isLoggedIn() {
  return user !== null;
}

export function getUser() {
  return user;
}

export function login(phone: string) {
  user = { phone, name: phone };
  messageCount = 0; // Reset limit on login
  notify();
}

export function logout() {
  user = null;
  messageCount = 0;
  notify();
}

export function getMessagesRemaining() {
  if (user) return Infinity; // Logged-in users have no limit
  return Math.max(0, DAILY_LIMIT - messageCount);
}

export function getMessageCount() {
  return messageCount;
}

export function shouldShowWarning() {
  if (user) return false;
  const remaining = getMessagesRemaining();
  return remaining > 0 && remaining <= WARNING_THRESHOLD;
}

export function isLimitReached() {
  if (user) return false;
  return getMessagesRemaining() <= 0;
}

/** Call this when a guest sends a message. Returns true if allowed. */
export function recordGuestMessage(): boolean {
  if (user) return true; // Logged-in users always allowed
  if (messageCount >= DAILY_LIMIT) return false;
  messageCount++;
  notify();
  return true;
}
