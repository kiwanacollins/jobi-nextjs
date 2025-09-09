'use client';

import React from 'react';

interface HydrationErrorBoundaryProps {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class HydrationErrorBoundary extends React.Component<HydrationErrorBoundaryProps, State> {
  constructor(props: HydrationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      // Suppress common hydration warnings from browser extensions
      if (
        error.message.includes('hydration') ||
        error.message.includes('crxlauncher') ||
        error.message.includes('Extra attributes from the server')
      ) {
        return;
      }
      console.error('Hydration error:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for production
      return this.props.children;
    }

    return this.props.children;
  }
}

export default HydrationErrorBoundary;