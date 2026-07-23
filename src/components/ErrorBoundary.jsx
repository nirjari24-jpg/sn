import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full w-full p-8 text-center bg-[#030014] text-white">
          <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 glow-purple relative overflow-hidden">
             <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">System Malfunction</h2>
          <p className="text-gray-400 max-w-md text-sm mb-8 leading-relaxed">
            A critical UI component encountered an error. The SkillNova core systems have contained the fault.
            <br/><br/>
            <span className="text-xs text-red-400/80 font-mono bg-red-950/20 p-2 rounded-md block border border-red-500/10">
              {this.state.error?.message || 'Unknown error'}
            </span>
          </p>
          <Button onClick={this.handleReset} variant="glow" className="flex items-center gap-2 px-6">
            <RefreshCcw size={16} /> Reinitialize System
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
