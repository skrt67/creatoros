import { useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions {
  interval: number;
  enabled?: boolean;
  immediate?: boolean;
}

export function usePolling(
  callback: () => void | Promise<void>,
  options: UsePollingOptions
) {
  const { interval, enabled = true, immediate = true } = options;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      try {
        await callbackRef.current();
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
  }, [interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      if (immediate) {
        // Execute immediately
        callbackRef.current();
      }
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [enabled, immediate, startPolling, stopPolling]);

  return { startPolling, stopPolling };
}
