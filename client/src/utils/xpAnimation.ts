// XP Animation System - BiteBurst
// Based on the detailed animation specification

// Level curve configuration: XP needed to complete level L = 100 + L * 25
export function xpToNext(level: number): number {
  return 100 + level * 25;
}

// Calculate level and progress from total XP
export function levelFromTotal(totalXP: number): { level: number; into: number; need: number } {
  let lvl = 0;
  let remaining = totalXP;
  
  while (remaining >= xpToNext(lvl)) {
    remaining -= xpToNext(lvl);
    lvl++;
  }
  
  return { 
    level: lvl, 
    into: remaining, 
    need: xpToNext(lvl) 
  };
}

// Calculate percentage progress within current level
export function percentInLevel(totalXP: number): { level: number; pct: number } {
  const { level, into, need } = levelFromTotal(totalXP);
  return { 
    level, 
    pct: Math.max(0, Math.min(1, need ? into / need : 1)) 
  };
}

// Smooth easing function for animations
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Check if user prefers reduced motion
export const prefersReduced = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

// RAF-based animation helper
export function rafAnimate(
  durationMs: number, 
  step: (t: number) => void
): Promise<void> {
  const dur = Math.max(0, durationMs);
  
  if (dur === 0 || prefersReduced) {
    step(1);
    return Promise.resolve();
  }
  
  return new Promise((resolve) => {
    const t0 = performance.now();
    
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      step(easeOutCubic(t));
      
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(frame);
  });
}

// Main XP animation function
export interface AnimateXPOptions {
  fromTotalXP: number;
  awardXP: number;
  onLevelUp?: (levelNumber: number) => void;
  onDone?: (result: { newTotalXP: number; newLevel: number }) => void;
  xpValueRef?: React.RefObject<HTMLElement>;
  xpBarRef?: React.RefObject<HTMLElement>;
  levelFromRef?: React.RefObject<HTMLElement>;
  levelToRef?: React.RefObject<HTMLElement>;
}

export async function animateXP(options: AnimateXPOptions): Promise<void> {
  const {
    fromTotalXP,
    awardXP,
    onLevelUp = () => {},
    onDone = () => {},
    xpValueRef,
    xpBarRef,
    levelFromRef,
    levelToRef
  } = options;

  const start = Math.max(0, fromTotalXP | 0);
  const gain = Math.max(0, awardXP | 0);
  const end = start + gain;

  // 1) Count-up "+XP" text (0 -> gain)
  if (xpValueRef?.current) {
    await rafAnimate(600, (t) => {
      const v = Math.round(gain * t);
      if (xpValueRef.current) {
        xpValueRef.current.textContent = `+${v} XP`;
      }
    });
  }

  // 2) Animate bar across possible multiple levels
  let cursor = start;
  
  while (cursor < end) {
    const { level, into, need } = levelFromTotal(cursor);
    const toHere = Math.min(end, cursor + (need - into)); // how much to complete this level

    // Set labels (UI is 1-indexed: level 0 -> "Lv 1")
    if (levelFromRef?.current) {
      levelFromRef.current.textContent = `Lv ${level + 1}`;
    }
    if (levelToRef?.current) {
      levelToRef.current.textContent = `Lv ${level + 2}`;
    }

    // Initial pct at start of segment
    const fromPct = percentInLevel(cursor).pct;
    const toPct = percentInLevel(toHere).pct;

    await rafAnimate(800, (t) => {
      const p = fromPct + (toPct - fromPct) * t;
      if (xpBarRef?.current) {
        xpBarRef.current.style.width = `${p * 100}%`;
      }
    });

    cursor = toHere;

    // Level-up celebration if we exactly hit the boundary and still have XP left
    if (cursor < end) {
      onLevelUp(level + 2); // new visible level (1-indexed)
      
      // Small pop animation class on bar
      if (xpBarRef?.current) {
        xpBarRef.current.classList.add('bb-pop');
        setTimeout(() => {
          xpBarRef?.current?.classList.remove('bb-pop');
        }, 300);
      }
    }
  }

  const finalLevel = levelFromTotal(end).level + 1; // 1-indexed
  onDone({ newTotalXP: end, newLevel: finalLevel });
}

// Format level for display
export function formatLevel(n: number, style: 'short' | 'long' = 'short'): string {
  return style === 'long' ? `Level ${n}` : `Lv ${n}`;
}