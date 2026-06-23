import React from 'react';

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { hasError: boolean };

/**
 * Catches render/load errors in its subtree so a single failed lazy chunk
 * (e.g. a stale deploy + cached index.html, or an offline blip) shows a small
 * recoverable message instead of blanking the entire site.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  // Explicitly typed because the project ships without @types/react, so the
  // base Component's generic props/state aren't otherwise visible to tsc.
  declare props: Props;
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[40vh] bg-[#030305] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-zinc-300 text-sm">Something went wrong loading this section.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full border border-[#00FFBD]/40 text-[#00FFBD] text-xs uppercase tracking-widest hover:bg-[#00FFBD]/10 transition-colors"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
