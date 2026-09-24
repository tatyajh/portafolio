export const THREAD_EVENT = 'portfolio-thread-earned';
const KEY = 'portfolio-threads-v1';
export const THREAD_LABELS = {
  'first-cut': { es: 'Primer corte', en: 'First cut' },
  'first-repair': { es: 'Remiendo', en: 'Patched up' },
  'explorer': { es: 'Tres capítulos', en: 'Three chapters' },
};
export type ThreadAchievement = keyof typeof THREAD_LABELS;
let memory = '';
function getThreadSnapshot() {
  try { memory = window.sessionStorage.getItem(KEY) ?? memory; } catch { /* Storage is optional. */ }
  return memory;
}
export function awardThread(id: ThreadAchievement) {
  const earned = getThreadSnapshot().split(',').filter(Boolean);
  if (earned.includes(id)) return;
  memory = [...earned, id].join(',');
  try { window.sessionStorage.setItem(KEY, memory); } catch { /* Keep working in memory. */ }
  window.dispatchEvent(new CustomEvent(THREAD_EVENT, { detail: id }));
}
