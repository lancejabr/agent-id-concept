import { useMemo, useEffect, useState, useCallback } from 'react';
import { User, Server, ShieldAlert, Activity, Bot, ClipboardList, Code, Fingerprint, CheckCircle2, Circle } from 'lucide-react';
import { ACTORS } from '../lib/protocol/actors';
import type { Actor, ProtocolStep } from '../lib/protocol/types';
import { cn } from '../lib/utils';
import { MockProtocolSource } from '../lib/protocol/mock-source';

const ActorIcon = ({ type, active }: { type: Actor; active?: boolean; }) => {
  const props = { className: cn("w-10 h-10 transition-all duration-700", active ? "text-primary scale-110" : "text-muted-foreground/60") };
  switch (type) {
    case 'DEPLOYER': return <User {...props} />;
    case 'PROVIDER': return <Code {...props} />;
    case 'SERVICE': return <Server {...props} />;
    case 'AGENT': return <Bot {...props} />;
    case 'AUDIT_LOG': return <ClipboardList {...props} />;
    default: return null;
  }
};

export const ProtocolFlow = () => {
  const [steps, setSteps] = useState<ProtocolStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const loadSteps = async () => {
      const source = new MockProtocolSource();
      const mockSteps = await source.getSteps();
      setSteps(mockSteps);
      setCurrentStepIdx(0);
    };
    loadSteps();
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIdx(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStepIdx(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((idx: number) => {
    if (idx >= 0 && idx < steps.length) {
      setCurrentStepIdx(idx);
    }
  }, [steps.length]);

  const currentStep = steps[currentStepIdx] || null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep]);

  const actorCoords: Record<Actor, { x: number, y: number; }> = useMemo(() => ({
    AGENT: { x: 50, y: 15 },
    PROVIDER: { x: 12, y: 15 },
    DEPLOYER: { x: 50, y: 85 },
    SERVICE: { x: 88, y: 45 },
    AUDIT_LOG: { x: 88, y: 88 },
  } as Record<Actor, { x: number, y: number; }>), []);

  const arrowData = useMemo(() => {
    if (!currentStep || currentStep.receiver === 'INTERNAL') return null;
    const start = actorCoords[currentStep.sender];
    const end = actorCoords[currentStep.receiver as Actor];
    return { start, end };
  }, [currentStep, actorCoords]);

  const idComponents = useMemo(() => [
    { label: 'Deployer ID', value: 'deployer_101', active: currentStepIdx >= 1 },
    { label: 'Request ID', value: 'req_001', active: currentStepIdx >= 1 },
    { label: 'Model ID', value: 'model_xyz', active: currentStepIdx >= 3 },
    { label: 'Dev Signature', value: 'sig_p4k9...', active: currentStepIdx >= 3 },
    { label: 'Agent ID', value: 'agent_v2_alpha', active: currentStepIdx >= 4 },
    { label: 'Attestation', value: 'sig_p4k9...', active: currentStepIdx >= 4 },
    { label: 'Policy Rules', value: 'OPA Bounds', active: currentStepIdx >= 6 },
    { label: 'DPoP Token', value: 'dpop_at_98f2...', active: currentStepIdx >= 7 },
  ], [currentStepIdx]);

  return (
    <div className="flex flex-col h-full max-w-[1500px] mx-auto p-6 gap-6">
      {/* Header: Consolidated Single-Line */}
      <div className="flex items-center justify-between px-6 mb-2">
        <div className="flex items-baseline gap-4">
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent italic leading-none">
            AI AGENT ID TESTBED
          </h1>
          <div className="flex items-center gap-2 border-l pl-4 border-border h-4">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Proof of Concept Visualization</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
        </div>
      </div>

      <div className="flex-1 bg-card border rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[1050px] ring-1 ring-white/5">
        {!currentStep ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
            <div className="flex flex-col items-center gap-4">
              <Activity className="w-12 h-12 text-primary/20" />
              <p className="font-black tracking-widest uppercase text-xs">
                Loading protocol...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* MAIN STAGE */}
            <div className="flex-1 relative p-8 bg-gradient-to-b from-muted/5 to-transparent border-b overflow-hidden min-h-[680px]">
              {/* Trust Mesh Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]">
                {Object.values(actorCoords).map((c1, i) =>
                  Object.values(actorCoords).slice(i + 1).map((c2, j) => (
                    <line key={`${i}-${j}`} x1={`${c1.x}%`} y1={`${c1.y}%`} x2={`${c2.x}%`} y2={`${c2.y}%`} className="stroke-foreground stroke-[2px]" />
                  ))
                )}
              </svg>

              {/* ACTIVE COMMUNICATION STREAM */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {arrowData && (
                  <g className="animate-in fade-in duration-700">
                    <line
                      x1={`${arrowData.start.x}%`} y1={`${arrowData.start.y}%`}
                      x2={`${arrowData.end.x}%`} y2={`${arrowData.end.y}%`}
                      className="stroke-primary stroke-[3px]"
                      strokeDasharray="15 10"
                    >
                      <animate attributeName="stroke-dashoffset" from="300" to="0" dur="8s" repeatCount="indefinite" />
                    </line>

                    <foreignObject
                      x={`${(arrowData.start.x + arrowData.end.x) / 2 - 15}%`}
                      y={`${(arrowData.start.y + arrowData.end.y) / 2 + 0}%`}
                      width="30%"
                      height="400"
                      className="overflow-visible"
                    >
                      <div className="flex justify-center -translate-y-1/2">
                        <div className="bg-background/95 backdrop-blur-xl border-2 border-primary/40 rounded-2xl shadow-[0_20px_80px_rgba(var(--primary),0.25)] animate-in slide-in-from-bottom-4 duration-500 w-fit max-w-[400px] pointer-events-auto overflow-hidden mx-auto">
                          <div className="bg-muted/20 max-h-[300px] overflow-y-auto custom-scrollbar w-fit">
                            <table className="border-collapse w-fit max-w-full">
                              <tbody>
                                {Object.entries(currentStep.payload).flatMap(([key, val]) => {
                                  // Simple flattener for nested objects in the table
                                  if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                                    return Object.entries(val).map(([subKey, subVal], i) => (
                                      <tr key={`${key}.${subKey}`} className={cn(
                                        "border-b border-primary/10 last:border-0 hover:bg-primary/5 transition-colors",
                                        i % 2 === 0 ? "bg-black/[0.02] dark:bg-white/[0.02]" : "bg-transparent"
                                      )}>
                                        <td className="px-2 py-0.5 text-[11px] font-bold text-muted-foreground border-r border-primary/10 font-mono whitespace-nowrap text-right w-fit">
                                          {key}.{subKey}
                                        </td>
                                        <td className="px-2 py-0.5 text-[11px] font-mono text-primary break-words leading-tight w-fit max-w-[240px]">
                                          {typeof subVal === 'object' ? JSON.stringify(subVal) : String(subVal)}
                                        </td>
                                      </tr>
                                    ));
                                  }
                                  return (
                                    <tr key={key} className="border-b border-primary/10 last:border-0 hover:bg-primary/5 transition-colors odd:bg-black/[0.02] even:bg-transparent dark:odd:bg-white/[0.02]">
                                      <td className="px-2 py-0.5 text-[11px] font-bold text-muted-foreground border-r border-primary/10 font-mono whitespace-nowrap text-right w-fit">
                                        {key}
                                      </td>
                                      <td className="px-2 py-0.5 text-[11px] font-mono text-primary break-words leading-tight w-fit max-w-[240px]">
                                        {Array.isArray(val) ? `[${val.join(', ')}]` : String(val)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                )}
              </svg>

              {/* THE ACTORS */}
              {Object.entries(actorCoords).map(([actor, coord]) => {
                const isActive = currentStep.id === 0 || currentStep.sender === actor || currentStep.receiver === actor;
                return (
                  <div
                    key={actor}
                    className="absolute transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3.5 z-20"
                    style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                  >
                    <div className="relative group flex flex-col items-center">
                      <div className={cn(
                        "relative p-4 rounded-2xl bg-card border-2 transition-all duration-700 z-10",
                        isActive
                          ? "border-primary shadow-lg scale-110 ring-4 ring-primary/5"
                          : "border-muted/50 scale-95"
                      )}>
                        <ActorIcon type={actor as Actor} active={isActive} />
                      </div>

                      <div className={cn(
                        "absolute -bottom-7 whitespace-nowrap px-2.5 py-0.5 rounded-full border shadow-md bg-background transition-all duration-700 z-0",
                        isActive ? "border-primary scale-100" : "border-muted scale-95"
                      )}>
                        <span className={cn(
                          "font-black text-[9px] tracking-widest uppercase transition-colors duration-700",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                          {ACTORS[actor as Actor].label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* LIVE AGENT ID STATE BOX */}
              <div className="absolute bottom-6 left-6 z-30 w-[320px] bg-background/95 backdrop-blur-xl border-2 border-primary/20 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 pointer-events-auto">
                <div className="bg-primary/10 px-3 py-2 border-b border-primary/20 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black tracking-widest uppercase text-primary">Agent ID State</h3>
                </div>
                <div className="p-2.5 bg-muted/5 flex flex-col gap-1">
                  {idComponents.map((comp, idx) => (
                    <div key={idx} className={cn(
                      "flex items-center justify-between px-2 py-1 rounded-md border transition-all duration-500",
                      comp.active ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-muted/10 border-transparent opacity-40 grayscale"
                    )}>
                      <div className="flex items-center gap-2">
                        {comp.active ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", comp.active ? "text-foreground" : "text-muted-foreground")}>
                          {comp.label}
                        </span>
                      </div>
                      <span className={cn("text-[9px] font-mono truncate max-w-[120px]", comp.active ? "text-primary" : "text-muted-foreground")}>
                        {comp.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DASHBOARD */}
            <div className="flex flex-col mt-auto bg-muted/5 border-t">
              {/* Narrative Bar */}
              <div className="grid grid-cols-12 divide-x border-b h-[140px]">
                <div className="col-span-8 p-6 flex flex-col justify-center space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground font-black text-[9px] px-3 py-1 rounded-md shadow-lg tracking-tighter">
                      PHASE_0{currentStep.id}
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-foreground uppercase italic leading-none">{currentStep.title}</h2>
                  </div>
                  <p className="text-xl font-medium text-foreground/80 leading-tight tracking-tight max-w-4xl italic">
                    {currentStep.description}
                  </p>
                </div>
                <div className="col-span-4 p-6 bg-primary/5 flex flex-col justify-center space-y-1.5">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldAlert className="w-4 h-4" />
                    <h3 className="text-[8px] font-black uppercase tracking-[0.3em]">Security_Outcome</h3>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full" />
                    <p className="text-md font-bold leading-tight text-foreground tracking-tight">
                      {currentStep.accomplishment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Control Center Row */}
              <div className="p-8 bg-background flex flex-col gap-8">
                <div className="flex items-center gap-8 max-w-[1400px] mx-auto w-full px-4">
                  <div className="flex-1 flex justify-between relative px-0 items-center h-12">
                    <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-muted -z-0 rounded-full" style={{ left: '36px', right: '36px' }} />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-1000 -z-0 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                      style={{ left: '36px', width: steps.length > 1 ? `calc(${(currentStepIdx / (steps.length - 1)) * 100}% - ${(currentStepIdx / (steps.length - 1)) * 72}px)` : '0%' }}
                    />

                    {steps.map((step, idx) => (
                      <button
                        key={step.id}
                        onClick={() => goToStep(idx)}
                        className="relative z-10 flex flex-col items-center group flex-1"
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-[0.85rem] flex items-center justify-center text-[9px] font-black transition-all duration-500 border-[3px] bg-background relative z-10",
                          idx <= currentStepIdx
                            ? "bg-primary border-primary text-primary-foreground shadow-lg scale-110"
                            : "bg-background border-muted text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                        )}>
                          {step.id}
                        </div>
                        <div className={cn(
                          "absolute top-11 text-[7px] font-black uppercase tracking-[0.1em] transition-all leading-none text-center max-w-[60px] whitespace-nowrap",
                          idx === currentStepIdx ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-40"
                        )}>
                          {step.title.split(' ')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
