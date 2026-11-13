"use client";

import { useEffect, useState } from "react";
import { fetcher } from "./_shared";

/**
 * useAsyncResource — fetches a resource using the version pattern.
 *
 * - `reqVersion` is bumped via the React "adjust state when props change"
 *   pattern (setState during render is allowed when guarded by a comparison).
 * - `loadedVersion` is updated inside the fetch callback (async), not
 *   synchronously inside the effect body, so we don't violate
 *   `react-hooks/set-state-in-effect`.
 * - `loading` is derived: `reqVersion !== loadedVersion`.
 */
export function useAsyncResource<T>(url: string | null, deps: any[] = []) {
  const [reqVersion, setReqVersion] = useState(0);
  const [loadedVersion, setLoadedVersion] = useState(-1);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Trigger a refetch whenever url or any of the provided deps change.
  // Using the React "adjust state when props change" pattern instead of
  // calling setState synchronously inside an effect.
  const depsKey = JSON.stringify([url, ...deps]);
  const [trackedDepsKey, setTrackedDepsKey] = useState<string | null>(null);
  if (trackedDepsKey !== depsKey) {
    setTrackedDepsKey(depsKey);
    setReqVersion((v) => v + 1);
  }

  // Fetch whenever reqVersion changes. setState calls happen only inside
  // async callbacks (then/catch/finally), not synchronously in the body.
  useEffect(() => {
    if (url == null) return;
    let cancelled = false;
    fetcher<T>(url)
      .then((res) => {
        if (cancelled) return;
        setData(res as any);
        setError(null);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(err?.message || "Gagal memuat data");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadedVersion(reqVersion);
      });
    return () => {
      cancelled = true;
    };
  }, [reqVersion, url]);

  const loading = reqVersion !== loadedVersion;

  return {
    data,
    error,
    loading,
    refetch: () => setReqVersion((v) => v + 1),
    setData,
  };
}
