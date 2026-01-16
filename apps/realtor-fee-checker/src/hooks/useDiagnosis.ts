import { useState, useCallback } from 'react';
import type { PropertyInfo, DiagnosisStep, DiagnosisResult } from '../types';
import { runDiagnosis } from '../lib/diagnosis';

const initialPropertyInfo: PropertyInfo = {
  rent: null,
  brokerageFee: null,
  propertyType: null,
  area: null,
  buildingAge: null,
  vacancyPeriod: null,
  moveInMonth: null,
  isNewConstruction: null,
  hasFreebies: null,
};

export function useDiagnosis() {
  const [step, setStep] = useState<DiagnosisStep>(1);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>(initialPropertyInfo);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updatePropertyInfo = useCallback((updates: Partial<PropertyInfo>) => {
    setPropertyInfo(prev => ({ ...prev, ...updates }));
  }, []);

  const goToNextStep = useCallback(() => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as DiagnosisStep);
      window.scrollTo(0, 0);
    }
  }, [step]);

  const goToPreviousStep = useCallback(() => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as DiagnosisStep);
      window.scrollTo(0, 0);
    }
  }, [step]);

  const executeDiagnosis = useCallback(() => {
    try {
      setError(null);
      const diagnosisResult = runDiagnosis(propertyInfo);
      setResult(diagnosisResult);
      return diagnosisResult;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '診断中にエラーが発生しました';
      setError(errorMessage);
      return null;
    }
  }, [propertyInfo]);

  const reset = useCallback(() => {
    setStep(1);
    setPropertyInfo(initialPropertyInfo);
    setResult(null);
    setError(null);
  }, []);

  const canProceedStep1 = propertyInfo.rent !== null && propertyInfo.rent > 0;
  const canProceedStep2 = propertyInfo.brokerageFee !== null && propertyInfo.brokerageFee >= 0;

  return {
    step,
    propertyInfo,
    result,
    error,
    updatePropertyInfo,
    goToNextStep,
    goToPreviousStep,
    executeDiagnosis,
    reset,
    canProceedStep1,
    canProceedStep2,
  };
}
