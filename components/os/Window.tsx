"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { appComponents } from "@/components/apps";
import { apps } from "@/lib/apps/registry";
import { MIN_SIZE, useWindows, type WindowState } from "@/lib/store/windows";
import { TitleBar } from "./TitleBar";

export function Window({ win, active }: { win: WindowState; active: boolean }) {
  const { focus, close, minimize, toggleMaximize, move, resize } = useWindows.getState();
  const viewport = useWindows((s) => s.viewport);
  const sectionRef = useRef<HTMLElement>(null);

  const app = apps[win.appId];
  const App = appComponents[win.appId];
  const dark = app.theme === "dark";
  const title = typeof win.props.title === "string" ? win.props.title : app.title;
  // Maximized fills the desktop area; x/y/w/h keep the size to restore to.
  const rect = win.maximized ? { x: 0, y: 0, w: viewport.w, h: viewport.h } : win;

  // Move keyboard focus into a window when it opens.
  useEffect(() => {
    sectionRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <Rnd
      position={{ x: rect.x, y: rect.y }}
      size={{ width: rect.w, height: rect.h }}
      bounds="parent"
      minWidth={MIN_SIZE.w}
      minHeight={MIN_SIZE.h}
      dragHandleClassName="window-drag-handle"
      cancel=".window-no-drag"
      disableDragging={win.maximized}
      enableResizing={!win.maximized && !win.minimized}
      onDragStart={() => focus(win.id)}
      onDragStop={(_, d) => move(win.id, d.x, d.y)}
      onResizeStart={() => focus(win.id)}
      onResizeStop={(_, __, el, ___, pos) => {
        resize(win.id, el.offsetWidth, el.offsetHeight);
        move(win.id, pos.x, pos.y);
      }}
      style={{ zIndex: win.z, pointerEvents: win.minimized ? "none" : "auto" }}
    >
      <motion.section
        ref={sectionRef}
        tabIndex={-1}
        aria-label={title}
        inert={win.minimized}
        onPointerDownCapture={() => focus(win.id)}
        onFocusCapture={() => focus(win.id)}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={
          win.minimized
            ? { opacity: 0, scale: 0.3, y: viewport.h - rect.y }
            : { opacity: 1, scale: 1, y: 0 }
        }
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`flex h-full flex-col overflow-hidden outline-none ${
          win.maximized ? "" : "rounded-window"
        } ${active ? "shadow-window" : "shadow-[0_12px_30px_rgba(0,0,0,0.35)]"} ${
          dark ? "bg-terminal text-terminal-text border border-[#2A3140]" : "bg-window text-[#1A1D23]"
        }`}
      >
        <TitleBar
          title={title}
          dark={dark}
          active={active}
          maximized={win.maximized}
          onClose={() => close(win.id)}
          onMinimize={() => minimize(win.id)}
          onToggleMaximize={() => toggleMaximize(win.id)}
        />
        <div className="min-h-0 flex-1 overflow-auto select-text">
          <App windowId={win.id} props={win.props} />
        </div>
      </motion.section>
    </Rnd>
  );
}
