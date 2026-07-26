import { useEffect, useState } from 'react';

const INSTALL_DATE_KEY = 'havij_install_date';
const BELL_SEEN_KEY = 'havij_bell_hint_seen';
const HINT_DAYS = 3;

// The very first time any part of the app asks for this, we stamp "now" as
// the install date. Every hint (accordion chevrons, the bell, etc.) reads
// from this same stamp so they all stay in sync and stop together.
const getInstallDate = (): number => {
  const stored = localStorage.getItem(INSTALL_DATE_KEY);
  if (stored) return Number(stored);
  const now = Date.now();
  try {
    localStorage.setItem(INSTALL_DATE_KEY, String(now));
  } catch {
    // ignore (e.g. private browsing / storage disabled)
  }
  return now;
};

const isWithinHintWindow = (): boolean => {
  const installedAt = getInstallDate();
  const daysSince = (Date.now() - installedAt) / (1000 * 60 * 60 * 24);
  return daysSince <= HINT_DAYS;
};

// Used on the collapsed accordion sections across the app: their chevron
// gently nudges for the first few days after install to teach the user to
// tap it, then stays still forever after.
export const useAccordionHint = (): boolean => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(isWithinHintWindow());
  }, []);
  return show;
};

// Used on the notification bell: it nudges for the first few days, but as
// soon as the user opens it once, the hint is marked as seen for good —
// they never need to re-open it on a later visit just to make it stop.
export const useBellHint = (): { showHint: boolean; markSeen: () => void } => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(BELL_SEEN_KEY) === '1';
    setShow(!alreadySeen && isWithinHintWindow());
  }, []);

  const markSeen = () => {
    try {
      localStorage.setItem(BELL_SEEN_KEY, '1');
    } catch {
      // ignore
    }
    setShow(false);
  };

  return { showHint: show, markSeen };
};
