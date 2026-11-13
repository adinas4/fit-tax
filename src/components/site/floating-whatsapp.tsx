"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useWaLink } from "@/hooks/use-settings";

const STORAGE_KEY = "fit-tax-wa-pos";
const BTN = 56; // button size in px (h-14 w-14)
const MARGIN = 12; // min distance from viewport edge
const DRAG_THRESHOLD = 6; // px of movement before it counts as a drag
const HINT_DELAY = 4000; // ms before the helper bubble auto-opens

type Pos = { x: number; y: number };

function clampToViewport(x: number, y: number): Pos {
  if (typeof window === "undefined") return { x, y };
  const maxX = window.innerWidth - BTN - MARGIN;
  const maxY = window.innerHeight - BTN - MARGIN;
  return {
    x: Math.max(MARGIN, Math.min(x, Math.max(MARGIN, maxX))),
    y: Math.max(MARGIN, Math.min(y, Math.max(MARGIN, maxY))),
  };
}

function defaultPosition(): Pos {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return clampToViewport(
    window.innerWidth - BTN - 20,
    window.innerHeight - BTN - 20
  );
}

/**
 * Floating WhatsApp button that the user can drag anywhere on the screen so it
 * never obstructs content. A quick tap opens the chat; a press-and-move
 * relocates the button (position is persisted to localStorage).
 *
 * Drag uses window-level pointer listeners (added on pointerdown, removed via
 * an AbortController on pointerup) so the drag keeps working even if the
 * pointer leaves the button — more reliable than pointer capture alone.
 */
export function FloatingWhatsApp() {
  const wa = useWaLink();
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintSide, setHintSide] = useState<"left" | "right">("left");

  const posRef = useRef<Pos | null>(null);
  const justDraggedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const updatePos = useCallback((next: Pos) => {
    posRef.current = next;
    setPos(next);
    setHintSide(next.x > window.innerWidth / 2 ? "left" : "right");
  }, []);

  const onWinPointerMove = useCallback(
    (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!d.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        d.moved = true;
        setDragging(true);
      }
      if (d.moved) {
        updatePos(
          clampToViewport(e.clientX - d.offsetX, e.clientY - d.offsetY)
        );
      }
    },
    [updatePos]
  );

  const onWinPointerUp = useCallback(() => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    // Abort removes both window listeners at once — no self-reference needed.
    abortRef.current?.abort();
    abortRef.current = null;
    if (d.moved) {
      justDraggedRef.current = true;
      setDragging(false);
      setHintOpen(false);
      const p = posRef.current;
      if (p) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  // Reveal the button once the user starts scrolling.
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Restore saved position (or default to bottom-right). Deferred to a
  // rAF callback so we don't call setState synchronously inside the effect
  // body (these APIs are only available in the browser anyway).
  useEffect(() => {
    let initial: Pos | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p && typeof p.x === "number" && typeof p.y === "number") {
          initial = clampToViewport(p.x, p.y);
        }
      }
    } catch {
      /* ignore */
    }
    if (!initial) initial = defaultPosition();

    const id = requestAnimationFrame(() => {
      posRef.current = initial;
      setPos(initial);
      setHintSide(initial!.x > window.innerWidth / 2 ? "left" : "right");
    });
    const t = setTimeout(() => setHintOpen(true), HINT_DELAY);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, []);

  // Keep the button inside the viewport on resize.
  useEffect(() => {
    const onResize = () => {
      setPos((p) => {
        if (!p) return p;
        const next = clampToViewport(p.x, p.y);
        posRef.current = next;
        return next;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Clean up any active drag listeners on unmount.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    // Only react to primary button / touch / pen.
    if (e.button !== undefined && e.button !== 0) return;
    const p = posRef.current;
    if (!p) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - p.x,
      offsetY: e.clientY - p.y,
    };
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    window.addEventListener("pointermove", onWinPointerMove, {
      signal: ac.signal,
    });
    window.addEventListener("pointerup", onWinPointerUp, {
      signal: ac.signal,
    });
  };

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (justDraggedRef.current) {
      e.preventDefault();
      justDraggedRef.current = false;
    }
  };

  if (!show || !pos) return null;

  return (
    <div
      className="fixed z-40 select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: BTN,
        height: BTN,
        touchAction: "none",
      }}
    >
      {hintOpen && !dragging && (
        <div
          className={`absolute top-1/2 w-max max-w-[210px] -translate-y-1/2 ${
            hintSide === "left" ? "right-full mr-2" : "left-full ml-2"
          }`}
        >
          <div className="relative rounded-2xl bg-white p-3 text-xs leading-relaxed text-navy shadow-xl ring-1 ring-slate-200">
            <button
              type="button"
              onClick={() => setHintOpen(false)}
              aria-label="Tutup pesan"
              className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
            >
              <X className="h-3 w-3" />
            </button>
            Butuh bantuan perpajakan? Klik untuk chat, atau geser ikon ini agar
            tidak menghalangi.
          </div>
        </div>
      )}
      <a
        href={wa()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp — klik untuk chat, geser untuk memindahkan"
        onPointerDown={onPointerDown}
        onClick={onClick}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl shadow-green-500/30 transition-transform hover:scale-105 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <span className="pointer-events-none absolute inline-flex h-14 w-14 animate-ping rounded-full bg-green-500/40 group-hover:hidden" />
        <MessageCircle className="pointer-events-none relative h-7 w-7" />
      </a>
    </div>
  );
}
