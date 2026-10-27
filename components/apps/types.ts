import type { WindowProps } from "@/lib/store/windows";

/** What every app component receives from its window. */
export interface AppProps {
  windowId: string;
  props: WindowProps;
}
