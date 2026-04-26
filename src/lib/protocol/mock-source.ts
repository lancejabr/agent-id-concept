import type { ProtocolStep, ProtocolSource } from './types';

export const MOCK_PROTOCOL_STEPS: ProtocolStep[] = [
  {
    id: 0,
    title: 'System Initialization',
    sender: 'DEPLOYER',
    receiver: 'AGENT',
    description: 'Deployer initializes AI Agent instance, provisioning it with access to underlying Developer models.',
    payload: {
      action: 'INITIALIZE_AGENT',
      agent_id: 'agent_v2_alpha',
      configured_providers: ['llm_developer_primary', 'llm_developer_fallback'],
    },
    accomplishment: ''
  },
  {
    id: 1,
    title: 'Initial Request',
    sender: 'DEPLOYER',
    receiver: 'AGENT',
    description: 'Deployer sends a natural language request to the active Agent to cancel a meeting.',
    payload: {
      request_string: 'Cancel my meeting tomorrow with my manager',
      deployer_id: 'deployer_101',
      request_id: 'req_001'
    },
    accomplishment: 'The Deployer ID and a unique Request ID are bound to the intent, establishing who asked for the action and initiating the session.'
  },
  {
    id: 2,
    title: 'Model Planning & Attestation',
    sender: 'AGENT',
    receiver: 'PROVIDER',
    description: 'Agent forwards the natural language request to the LLM Developer to parse the intent, select tools, and request a signed Model ID.',
    payload: {
      prompt: 'Parse request: "Cancel my meeting tomorrow with my manager"',
      agent_identity: 'agent_v2_alpha',
      request_attestation: true
    },
    accomplishment: 'Establishes cryptographic proof of the agent and model used.'
  },
  {
    id: 3,
    title: 'Plan & Signed ID Return',
    sender: 'PROVIDER',
    receiver: 'AGENT',
    description: 'LLM Developer returns the parsed MCP plan along with a cryptographically signed Model ID binding the Developer to the output.',
    payload: {
      action_plan: {
        tool: 'calendar_provider',
        method: 'delete_event',
        arguments: { date: 'tomorrow', query: 'manager' }
      },
      model_id: 'model_xyz',
      developer_id: 'dev_99',
      developer_signature: 'sig_p4k9... (signed_by_developer)'
    },
    accomplishment: 'The cryptographically signed Model ID is attached to the request, binding the LLM Developer to the resulting plan.'
  },
  {
    id: 4,
    title: 'CIBA Initiation & Attestation',
    sender: 'AGENT',
    receiver: 'SERVICE',
    description: 'Agent generates a session keypair and initiates an OAuth 2.0 CIBA request with the Provider\'s cryptographic attestation.',
    payload: {
      action: 'CIBA_AUTH_REQUEST',
      requested_scopes: ['calendar.read', 'calendar.event.delete'],
      agent_id: 'agent_v2_alpha',
      model_id: 'model_xyz',
      agent_public_key: 'pub_k9x2...',
      attestation_proof: 'sig_p4k9... (signed_by_provider)'
    },
    accomplishment: 'The Agent attaches its own cryptographic public key and an attestation proof, securing its identity before initiating the connection to the Service.'
  },
  {
    id: 5,
    title: 'Out-of-Band Auth Request',
    sender: 'SERVICE',
    receiver: 'DEPLOYER',
    description: 'Service validates the attestation and contacts the Deployer directly via an out-of-band channel (e.g., push notification) requesting delegated authorization.',
    payload: {
      action: 'CIBA_AUTH_PROMPT',
      requested_scopes: ['calendar.read', 'calendar.modify'],
      verified_agent: true,
      verified_model: 'model_xyz'
    },
    accomplishment: 'Establishes a secure, out-of-band human-in-the-loop consent flow.'
  },
  {
    id: 6,
    title: 'Authentication & Policy Config',
    sender: 'DEPLOYER',
    receiver: 'SERVICE',
    description: 'Deployer authenticates, confirms scopes, and specifies remediation guardrails using a standardized machine-readable policy language.',
    payload: {
      status: 'AUTHORIZED',
      approved_scopes: ['calendar.read', 'calendar.modify'],
      policies: {
        engine: 'OPA/Rego',
        rules: ['Disallowed_Actions = [Add_Attendee]']
      }
    },
    accomplishment: 'Binds explicit human consent with machine-readable, enforceable runtime policies.'
  },
  {
    id: 7,
    title: 'DPoP Token Issuance',
    sender: 'SERVICE',
    receiver: 'AGENT',
    description: 'Service completes the CIBA flow by issuing a DPoP access token, cryptographically bound to the Agent\'s public key.',
    payload: {
      access_token: 'dpop_at_98f2...',
      token_type: 'DPoP',
      expires_in: 3600,
      granted_scopes: ['calendar.read', 'calendar.event.delete']
    },
    accomplishment: 'The Service issues a Proof-of-Possession token bound specifically to the Agent\'s keys, preventing token theft, and attaches the Deployer\'s policy rules.'
  },
  {
    id: 8,
    title: 'Action Execution',
    sender: 'AGENT',
    receiver: 'SERVICE',
    description: 'Agent uses the DPoP token to perform the action, signing the API request to prove possession of the private key.',
    payload: {
      action: 'DELETE_EVENT',
      filter: { query: 'manager', timeframe: 'tomorrow' },
      dpop_signature: 'sig_a7f9...',
      access_token: 'dpop_at_98f2...'
    },
    accomplishment: 'Cryptographically proven agent successfully executes authorized actions.'
  },
  {
    id: 9,
    title: 'Secure Audit Logging',
    sender: 'SERVICE',
    receiver: 'AUDIT_LOG',
    description: 'Service records the agent\'s use of the token and the request context into the immutable audit trail.',
    payload: {
      event: 'ACCESS_LOG',
      subject: 'agent_v2_alpha',
      action: 'DELETE_EVENT',
      resource: 'calendar_event_992',
      request_id: 'req_001',
      authorization_ref: 'ciba_auth_xyz'
    },
    accomplishment: 'Ensures accountability by linking every action to the specific human authorization and request ID.'
  },
  {
    id: '10a',
    title: 'Outcome A: Success',
    sender: 'AGENT',
    receiver: 'DEPLOYER',
    description: 'Upon successful completion of the task, the agent notifies the Deployer of the result.',
    payload: {
      status: 'SUCCESS',
      task: 'Meeting Cancellation',
      message: 'Meeting with manager tomorrow has been removed from calendar.'
    },
    accomplishment: 'Closes the loop for the deployer, confirming the autonomous agent fulfilled the intent.'
  },
  {
    id: '10b',
    title: 'Outcome B: Breach & Remediation',
    sender: 'SERVICE',
    receiver: 'DEPLOYER',
    description: 'In a breach scenario (e.g., agent attempts to exceed scope), the service enforces the policy and notifies the Deployer of remediation.',
    payload: {
      status: 'POLICY_VIOLATION',
      detected_action: 'ADD_ATTENDEE',
      remediation: 'ACCESS_REVOKED',
      details: 'Agent attempted to add unauthorized attendee to meeting.'
    },
    accomplishment: 'Active enforcement: the Service protects the user by revoking access the moment a policy boundary is crossed.'
  }
];

export class MockProtocolSource implements ProtocolSource {
  async getSteps(): Promise<ProtocolStep[]> {
    return MOCK_PROTOCOL_STEPS;
  }
}
