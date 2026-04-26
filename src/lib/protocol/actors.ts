import type { Actor, ActorInfo } from './types';

export const ACTORS: Record<Actor, ActorInfo> = {
  DEPLOYER: { label: 'Deployer', icon: 'User' },
  PROVIDER: { label: 'LLM Developer', icon: 'Code' },
  SERVICE: { label: 'Service', icon: 'Server' },
  AGENT: { label: 'AI Agent', icon: 'Bot' },
  AUDIT_LOG: { label: 'Audit Trail', icon: 'ClipboardList' },
};
