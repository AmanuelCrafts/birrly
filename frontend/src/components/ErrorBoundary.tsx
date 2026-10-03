import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-ink-950 px-6">
          <div className="text-4xl">💥</div>
          <h1 className="text-lg font-black text-white">Something went wrong</h1>
          <p className="text-center text-sm font-semibold text-white/50">
            {this.state.error?.message ?? "Unknown error"}
          </p>
          <pre className="max-w-full overflow-auto rounded-xl bg-white/5 p-4 text-xs text-white/40">
            {this.state.error?.stack ?? "No stack trace"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-400 cursor-pointer"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
