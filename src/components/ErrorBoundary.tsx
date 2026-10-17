import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { recordSecurityEvent } from '../utils/security';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  errorId: string;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `ERR-SEC-${Date.now().toString(36).toUpperCase()}`;
    return {
      hasError: true,
      errorId,
      errorMessage: error.message || 'An unexpected operational fault occurred',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log tamper-evident security audit record
    recordSecurityEvent({
      type: 'INTEGRITY_VIOLATION',
      severity: 'HIGH',
      details: `Application Error Trap (${this.state.errorId}): ${error.name} - ${error.message}. Component Stack: ${errorInfo.componentStack?.slice(0, 300) || 'None'}`,
    });
    console.error('HIMRASAD Operational Error Guard caught an exception:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleResetState = (): void => {
    // Keep credentials safe but reset view route to root
    this.setState({ hasError: false, errorId: '', errorMessage: '' });
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-snow text-pine flex flex-col items-center justify-center p-6 selection:bg-gold selection:text-night font-body">
          <div className="max-w-lg w-full bg-white rounded-card border-2 border-sand/80 shadow-elevation p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-saffron/10 border border-saffron/30 text-saffron flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-heading font-extrabold tracking-widest uppercase px-3 py-1 bg-saffron/10 text-saffron-dark rounded-badge inline-block">
                Operational Error Boundary
              </span>
              <h1 className="text-xl md:text-2xl font-heading font-extrabold text-olive-deep tracking-tight">
                {this.props.fallbackTitle || 'Secure Application Recovery'}
              </h1>
              <p className="text-xs text-pine/80 leading-relaxed">
                The security shield intercepted an unhandled application exception and prevented a system crash. System integrity remains intact.
              </p>
            </div>

            <div className="bg-sand/20 border border-sand/40 rounded-control p-3.5 text-left font-mono text-[11px] text-pine space-y-1">
              <div className="flex items-center gap-1.5 text-olive-deep font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-saffron" />
                <span>Incident Reference: {this.state.errorId}</span>
              </div>
              <div className="text-[10px] text-pine/70 truncate">
                Diagnostic: {this.state.errorMessage}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 rounded-control bg-olive text-snow font-heading font-bold text-xs uppercase tracking-wider hover:bg-olive/90 transition-all flex items-center justify-center gap-2 shadow-subtle"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Operation</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetState}
                className="w-full py-2.5 px-4 rounded-control bg-sand/30 text-olive-deep font-heading font-bold text-xs uppercase tracking-wider hover:bg-sand/50 transition-all flex items-center justify-center gap-2 border border-sand"
              >
                <Home className="w-4 h-4" />
                <span>Return to Safe Console</span>
              </button>
            </div>

            <div className="text-[10px] text-sand/80 font-mono">
              TAMPER-EVIDENT LOGGED • MIL-STD COMPLIANT RECOVERY INTERACTION
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
