# AI Agent ID Testbed

A proof-of-concept cinematic visualization for the **AI Agent ID Protocol**.

This interactive React application visualizes the step-by-step cryptographic and authorization handshakes required to securely operate an autonomous AI Agent on behalf of a human user. It demonstrates complex identity features—like OAuth CIBA, Zero-Knowledge Proofs, DPoP, and machine-readable policies—in a clear, linear flow.

## 🚀 Features

*   **Cinematic Stage:** Visualizes a network of 5 key actors (Deployer, AI Agent, LLM Developer, Service, and Audit Trail) with smooth, animated data flows.
*   **Protocol Progression:** Steps through a realistic 10-phase sequence, from the initial natural language request, through Model Attestation, OAuth CIBA consent, to Final Execution and Audit Logging.
*   **Live Payload Inspection:** Each step renders the raw structured data (the "payload") passing between the actors, automatically flattened into dense, readable tables.
*   **Dynamic Agent ID State:** A persistent widget that mathematically builds the composite "Agent ID" in real-time as the cryptographic and policy pieces are assembled step-by-step.
*   **Branching Outcomes:** Visualizes the difference between a successful authorized action and a proactive remediation triggered by a policy breach.

## 🧠 The Protocol Flow

The testbed visualizes the following critical steps of the proposed Agent ID lifecycle:

1.  **System Initialization:** The Deployer provisions the Agent with access to underlying LLMs.
2.  **Initial Request:** The Deployer gives the Agent a natural language task.
3.  **Model Planning & Attestation:** The Agent consults the LLM Developer, receiving a cryptographic signature binding the model to the output.
4.  **CIBA Initiation:** The Agent initiates an OAuth 2.0 CIBA request with the Service, presenting its attestation proof.
5.  **Out-of-Band Auth Request:** The Service contacts the Deployer directly to request human-in-the-loop consent.
6.  **Authentication & Policy Config:** The Deployer approves the request and injects strict, machine-readable (OPA/Rego) behavioral guardrails.
7.  **DPoP Token Issuance:** The Service issues a Proof-of-Possession token to the Agent, preventing token theft.
8.  **Action Execution:** The Agent uses the bound token to execute the action.
9.  **Secure Audit Logging:** The Service logs the execution context immutably to the Audit Trail.
10. **Outcome Branching:** The system demonstrates either a successful loop closure or an active policy enforcement and access revocation.

## 🛠 Tech Stack

*   **Framework:** React 18 / Vite
*   **Styling:** Tailwind CSS v4
*   **Icons:** Lucide React
*   **UI Components:** Shadcn UI (modified)
*   **Animations:** CSS Transitions & SVG SMIL

## 💻 Development

To run this project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```