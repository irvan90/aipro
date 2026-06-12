export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type ModalType =
  | 'override-ai'
  | 'backlog-swap'
  | 'emergency-flag'
  | 're-analyze'
  | 'export-pdf'
  | 'product-switcher'
  | 'revert-override'
  | 'drag-confirm';

export interface ModalConfig {
  type: ModalType;
  data?: any;
}

export type AILoadingStep = string;

export type AILoadingState = 'idle' | 'loading' | 'revealing' | 'complete' | 'error';
