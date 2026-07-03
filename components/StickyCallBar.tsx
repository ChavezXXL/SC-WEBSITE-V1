
import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { trackPhoneClick } from '../services/analytics';

/**
 * Slim tap-to-call bar pinned to the bottom of the viewport on mobile only
 * (hidden at md and up). Dismissible for the rest of the session.
 * The footer carries matching bottom padding on mobile so the bar never
 * covers content at the end of the page.
 */
export const StickyCallBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[90] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch bg-[#06080a]/95 backdrop-blur-md border-t border-[#00FFBD]/30">
        <a
          href="tel:+18183894234"
          onClick={() => trackPhoneClick()}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-[#00FFBD] font-bold text-[13px] uppercase tracking-[0.12em]"
        >
          <Phone className="w-4 h-4" strokeWidth={2.25} />
          Call Santiago — (818) 389-4234
        </a>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Hide call bar"
          className="px-4 text-zinc-500 hover:text-white border-l border-white/10 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};
