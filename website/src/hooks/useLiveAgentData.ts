"use client";

import { useAgentData } from "@/hooks/useAgentData";

const LIVE_POLL_MS = 5_000;

/** Fast, uncached polling for the secret /live dashboard. */
export function useLiveAgentData() {
  return useAgentData(LIVE_POLL_MS, true);
}
