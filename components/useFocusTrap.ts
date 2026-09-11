import { RefObject, useEffect, useRef } from 'react';

export function useFocusTrap(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const targets = (): HTMLElement[] => {
      const elements = ref.current?.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]') as NodeListOf<HTMLElement> | undefined;
      return elements ? Array.from(elements).filter(el => el.getClientRects().length > 0) : [];
    };
    const frame = requestAnimationFrame(() => targets()[0]?.focus({ preventScroll: true }));
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); }
      if (event.key !== 'Tab') return;
      const items = targets();
      if (!items.length) { event.preventDefault(); return; }
      const current = document.activeElement;
      if (event.shiftKey && (current === items[0] || !ref.current?.contains(current))) {
        event.preventDefault(); items[items.length - 1].focus();
      } else if (!event.shiftKey && (current === items[items.length - 1] || !ref.current?.contains(current))) {
        event.preventDefault(); items[0].focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKey);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open, ref]);
}
