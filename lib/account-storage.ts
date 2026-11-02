import type { Account } from "@/types/account";

const STORAGE_KEY = "tradeflow_account";
const ACCOUNT_UPDATED_EVENT = "tradeflow:account-updated";

export const DEFAULT_ACCOUNT: Account = {
  initialBalance: 2000,
  currency: "USD",
};

// دریافت اطلاعات حساب
export function getAccount(): Account {
  if (typeof window === "undefined") {
    return DEFAULT_ACCOUNT;
  }

  try {
    const storedAccount = localStorage.getItem(STORAGE_KEY);

    if (!storedAccount) return DEFAULT_ACCOUNT;

    const parsedAccount = JSON.parse(storedAccount);

    return {
      initialBalance: Number(
        parsedAccount.initialBalance ?? DEFAULT_ACCOUNT.initialBalance,
      ),
      currency: "USD",
    };
  } catch (error) {
    console.error("Error loading account:", error);
    return DEFAULT_ACCOUNT;
  }
}

// ذخیره اطلاعات حساب
export function saveAccount(account: Account): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));

    window.dispatchEvent(new Event(ACCOUNT_UPDATED_EVENT));
  } catch (error) {
    console.error("Error saving account:", error);
  }
}

// اشتراک در تغییرات حساب
export function subscribeAccount(callback: () => void) {
  window.addEventListener(ACCOUNT_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(ACCOUNT_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// Snapshot مرورگر
export function getAccountSnapshot(): string {
  if (typeof window === "undefined") {
    return JSON.stringify(DEFAULT_ACCOUNT);
  }

  try {
    return localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(DEFAULT_ACCOUNT);
  } catch (error) {
    console.error("Error creating account snapshot:", error);
    return JSON.stringify(DEFAULT_ACCOUNT);
  }
}

// Snapshot رندر سمت سرور
export function getAccountServerSnapshot(): string {
  return JSON.stringify(DEFAULT_ACCOUNT);
}

// تبدیل Snapshot به Account
export function parseAccountSnapshot(snapshot: string): Account {
  try {
    const parsedAccount = JSON.parse(snapshot);

    return {
      initialBalance: Number(
        parsedAccount.initialBalance ?? DEFAULT_ACCOUNT.initialBalance,
      ),
      currency: "USD",
    };
  } catch {
    return DEFAULT_ACCOUNT;
  }
}
