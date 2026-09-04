import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('CRITICAL [ErrorBoundary] Caught UI Runtime Exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF7E8] flex items-center justify-center p-4 selection:bg-[#F47B20] selection:text-white">
          <div className="max-w-md w-full bg-[#183A2A] text-[#FFF7E8] p-8 rounded-3xl border-2 border-[#7D967E]/40 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-[#F47B20]/20 border border-[#F47B20]/40 rounded-2xl flex items-center justify-center mx-auto text-[#F47B20]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-display tracking-tight text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-[#FFF7E8]/80 leading-relaxed">
                The page encountered a temporary display issue. Don't worry, your cart and session data are safe.
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="bg-[#10271C] p-3 rounded-xl border border-red-500/30 text-left overflow-auto max-h-32 text-[10px] font-mono text-rose-300">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F47B20]/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#204935] hover:bg-[#285740] text-[#FFF7E8] border border-[#7D967E]/40 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#F47B20]" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
