export interface Step {
  id: string;
  name: string;
  status?: StepStatus;
  /** Blocks entering the step regardless of the statuses before it. */
  disabled?: boolean;
}

export enum StepStatus {
  VALID = 'valid',
  ERROR = 'error',
}
