import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ProtocolStep } from './types';
import { MockProtocolSource } from './mock-source';

interface ProtocolContextType {
  steps: ProtocolStep[];
  currentStepIdx: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (idx: number) => void;
  currentStep: ProtocolStep | null;
  isEstablished: boolean;
}

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined);

export const ProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const isEstablished = currentStep ? currentStepIdx > 0 : false;

  return (
    <ProtocolContext.Provider value={{
      steps,
      currentStepIdx,
      nextStep,
      prevStep,
      goToStep,
      currentStep,
      isEstablished
    }}>
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocol = () => {
  const context = useContext(ProtocolContext);
  if (!context) {
    throw new Error('useProtocol must be used within a ProtocolProvider');
  }
  return context;
};
