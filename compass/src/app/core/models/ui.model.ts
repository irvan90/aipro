export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type ModalType =
  | 'submit-pmo'
  | 'override-ai'
  | 'backlog-swap'
  | 'emergency-flag'
  | 're-analyze'
  | 'export-pdf'
  | 'product-switcher'
  | 'revert-override'
  | 'drag-confirm'
  | 'drag-final-warning';

export interface ModalConfig {
  type: ModalType;
  data?: any;
}

export type AILoadingStep =
  | 'Reading backlog context...'
  | 'Analyzing Jira history...'
  | 'Calculating RICE dimensions...'
  | 'Classifying MoSCoW...'
  | 'Generating reasoning...'
  | 'Mapping dependency chain...'
  | 'Analyzing roadmap consequences...'
  | 'Calculating KPI effects...'
  | 'Generating recommendations...'
  | 'Structuring PRD sections...'
  | 'Generating acceptance criteria...'
  | 'Analyzing backlog context...'
  | 'Checking dependency readiness...';

export type AILoadingState = 'idle' | 'loading' | 'revealing' | 'complete' | 'error';
