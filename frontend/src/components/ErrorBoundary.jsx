import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full glass p-8 text-center rounded-2xl border border-white/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-500 mb-6">
              <ExclamationTriangleIcon className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-bold text-text mb-2">Something went wrong</h1>
            <p className="text-text-muted mb-8 text-sm">
              An unexpected error occurred. Don't worry, your data is safe. 
              We've been notified and are looking into it.
            </p>
            
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-medium shadow-lg shadow-primary/20"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
