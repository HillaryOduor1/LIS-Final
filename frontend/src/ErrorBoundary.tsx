import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for debugging (or send to analytics)
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  // Determine a friendly message based on the error
  getFriendlyMessage(): { title: string; message: string; isRecoverable: boolean } {
    const { error } = this.state;
    if (!error) {
      return {
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try again.',
        isRecoverable: true,
      };
    }

    const msg = error.message.toLowerCase();

    // Dynamic import / chunk loading failure
    if (msg.includes('loading dynamically imported module') || msg.includes('failed to fetch dynamically imported module')) {
      return {
        title: 'Page failed to load',
        message: 'We couldn\'t load this part of the application. This might be due to a network issue or a temporary glitch.',
        isRecoverable: true,
      };
    }

    // reCAPTCHA errors
    if (msg.includes('recaptcha') || msg.includes('captcha')) {
      return {
        title: 'reCAPTCHA service unavailable',
        message: 'Could not connect to the reCAPTCHA service. Please check your internet connection and reload the page to get a new challenge.',
        isRecoverable: true,
      };
    }

    // Network errors (fetch, offline)
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('offline')) {
      return {
        title: 'Network error',
        message: 'Please check your internet connection and try again.',
        isRecoverable: true,
      };
    }

    // Generic fallback
    return {
      title: 'Something went wrong',
      message: `We encountered an error: ${error.message}. Please try again or contact support if the problem persists.`,
      isRecoverable: true,
    };
  }

  handleRetry = () => {
    // Reload the page to reset the entire application state
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { title, message, isRecoverable } = this.getFriendlyMessage();

    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark text-[var(--text)] p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-border">
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-3 text-[var(--text)]">{title}</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">{message}</p>
          {isRecoverable && (
            <button
              onClick={this.handleRetry}
              className="btn-primary w-full md:w-auto px-8 py-3 rounded-lg text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Reload page
            </button>
          )}
          {/* Optional: show error details in development (for debugging) */}
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-6 text-left text-sm text-muted-foreground border-t border-border pt-4">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="mt-2 p-3 bg-surface rounded-lg overflow-auto whitespace-pre-wrap text-xs">
                {this.state.error.stack || this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
/* import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: 'red' }}>Something went wrong: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}*/