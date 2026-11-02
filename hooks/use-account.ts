"use client";

import { useSyncExternalStore } from "react";
import type { Account } from "@/types/account";
import {
  getAccountSnapshot,
  getAccountServerSnapshot,
  parseAccountSnapshot,
  saveAccount,
  subscribeAccount,
} from "@/lib/account-storage";

export function useAccount() {
  const accountSnapshot = useSyncExternalStore(
    subscribeAccount,
    getAccountSnapshot,
    getAccountServerSnapshot,
  );

  const account: Account = parseAccountSnapshot(accountSnapshot);

  const updateInitialBalance = (balance: number) => {
    if (!Number.isFinite(balance) || balance < 0) return;

    saveAccount({
      ...account,
      initialBalance: balance,
    });
  };

  return {
    account,
    updateInitialBalance,
  };
}
