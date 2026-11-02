const CHECKLIST_KEY = "tradeflow_checklist";
const BLOCKS_KEY = "tradeflow_active_blocks";
const NEWS_KEY = "tradeflow_active_news";

const CHECKLIST_UPDATED_EVENT = "tradeflow:checklist-updated";

export type ChecklistState = Record<string, boolean>;

// اطلاع‌رسانی به کامپوننت‌های مشترک پس از تغییر اطلاعات
function notifyChecklistUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHECKLIST_UPDATED_EVENT));
  }
}

// دریافت وضعیت شروط ورود
export function getChecklistState(): ChecklistState {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(CHECKLIST_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading checklist:", error);
    return {};
  }
}

// ذخیره وضعیت شروط ورود
export function saveChecklistState(state: ChecklistState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
    notifyChecklistUpdate();
  } catch (error) {
    console.error("Error saving checklist:", error);
  }
}

// دریافت موانع فعال معامله
export function getActiveBlocks(): ChecklistState {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(BLOCKS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading active blocks:", error);
    return {};
  }
}

// ذخیره موانع فعال معامله
export function saveActiveBlocks(state: ChecklistState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(BLOCKS_KEY, JSON.stringify(state));
    notifyChecklistUpdate();
  } catch (error) {
    console.error("Error saving active blocks:", error);
  }
}

// دریافت وضعیت موانع خبری
export function getActiveNews(): ChecklistState {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(NEWS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading active news:", error);
    return {};
  }
}

// ذخیره وضعیت موانع خبری
export function saveActiveNews(state: ChecklistState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(NEWS_KEY, JSON.stringify(state));
    notifyChecklistUpdate();
  } catch (error) {
    console.error("Error saving active news:", error);
  }
}

// اشتراک در تغییرات چک‌لیست
export function subscribeChecklist(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(CHECKLIST_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CHECKLIST_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// Snapshot وضعیت شروط ورود
export function getChecklistSnapshot(): string {
  return localStorage.getItem(CHECKLIST_KEY) ?? "{}";
}

// Snapshot موانع فعال
export function getActiveBlocksSnapshot(): string {
  return localStorage.getItem(BLOCKS_KEY) ?? "{}";
}

// Snapshot موانع خبری
export function getActiveNewsSnapshot(): string {
  return localStorage.getItem(NEWS_KEY) ?? "{}";
}

// Snapshot سمت سرور
export function getChecklistServerSnapshot(): string {
  return "{}";
}
