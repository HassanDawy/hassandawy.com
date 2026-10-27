"use client";

import { useSyncExternalStore } from "react";

// The URL that was not found. The 404 page is prerendered once for every path,
// so the server renders nothing here and the browser fills it in.
const subscribe = () => () => {};

export function MissingPath() {
  const path = useSyncExternalStore(subscribe, () => window.location.pathname, () => null);
  return <span className="break-all">{path ?? ""}</span>;
}
