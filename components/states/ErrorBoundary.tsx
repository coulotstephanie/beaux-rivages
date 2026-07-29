"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, Button } from "@/components/ui";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallbackTitle?: string;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Alert
        variant="danger"
        title={this.props.fallbackTitle ?? "Cette section n’est pas disponible"}
      >
        <p>Vous pouvez réessayer sans perdre le reste de la page.</p>
        <Button variant="secondary" onClick={() => this.setState({ error: null })}>
          Réessayer
        </Button>
      </Alert>
    );
  }
}
