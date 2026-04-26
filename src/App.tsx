import { ProtocolFlow } from './components/ProtocolFlow';
import { ProtocolProvider } from './lib/protocol/ProtocolContext';

function App() {
  return (
    <ProtocolProvider>
      <main className="min-h-screen bg-background text-foreground py-12">
        <ProtocolFlow />
      </main>
    </ProtocolProvider>
  );
}

export default App;
