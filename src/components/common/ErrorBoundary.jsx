import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Component Error Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#164E8C] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-[#0B1F4E] border border-[#C9A84C]/40 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
            
            <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl mx-auto flex items-center justify-center border border-rose-500/30">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#FFD84A] uppercase tracking-wider">
                St. Philomena's Application Recovery
              </span>
              <h2 className="text-2xl font-serif font-extrabold text-white">
                Something went wrong rendering this view
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                A non-critical rendering error was caught. The underlying data and CMS backend remain safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 bg-black/40 rounded-xl border border-slate-700 text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-36">
                <code>{this.state.error.toString()}</code>
              </div>
            )}

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={this.handleReset}
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <a
                href="/"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center space-x-1.5 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Homepage</span>
              </a>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
