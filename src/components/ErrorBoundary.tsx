import React, { Component, ErrorInfo } from 'react';
import { logger } from '../utils/logger';
import styles from '../styles/ErrorBoundary.module.css';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React error boundary caught an error', {
      error,
      componentStack: errorInfo.componentStack
    });
  }

  handleReload = () => {
    logger.info('User triggered page reload from error boundary');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <h2 className={styles.title}>Something went wrong</h2>
          <p className={styles.message}>
            We apologize for the inconvenience. Please try reloading the page.
          </p>
          {this.state.error && (
            <pre className={styles.errorDetails}>
              {this.state.error.message}
            </pre>
          )}
          <button className={styles.reloadButton} onClick={this.handleReload}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 