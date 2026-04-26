import { Component, type ErrorInfo, type ReactNode } from 'react'

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
  message: string
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  public constructor(props: AppErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      message: '',
    }
  }

  public static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    const message = error instanceof Error ? error.message : 'Unknown runtime error'
    return {
      hasError: true,
      message,
    }
  }

  public componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('9Prompt ErrorBoundary caught an error', error, info)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="flex h-screen w-[760px] items-center justify-center bg-gradient-to-br from-white via-[#F1D2DE] to-[#F5C8BD] p-5 text-slate-900">
          <div className="w-full max-w-xl rounded-3xl border border-[#F5C8BD] bg-white/95 p-4 shadow-[0_12px_30px_rgba(245,200,189,0.35)]">
            <h1 className="text-base font-semibold text-[#b75f5c]">9Prompt crashed while rendering</h1>
            <p className="mt-2 text-sm text-slate-700">
              Open popup Inspect - Console and send the first red error line.
            </p>
            <pre className="mt-3 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
              {this.state.message}
            </pre>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
