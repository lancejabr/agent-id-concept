export type Actor = 'DEPLOYER' | 'PROVIDER' | 'SERVICE' | 'AGENT' | 'AUDIT_LOG';

export interface ProtocolStep {
  id: string | number;
  title: string;
  sender: Actor;
  receiver: Actor | 'INTERNAL';
  description: string;
  payload: Record<string, unknown>;
  accomplishment: string;
}

export interface ActorInfo {
  label: string;
  icon: string;
}

export interface ProtocolSource {
  getSteps(): Promise<ProtocolStep[]>;
  onStep?(callback: (step: ProtocolStep) => void): void;
}
