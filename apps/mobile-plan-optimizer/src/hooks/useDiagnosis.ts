import { useState, useCallback } from 'react';
import type {
  DiagnosisInput,
  PersonDiagnosis,
  CommonSettings,
} from '../types/diagnosis';
import {
  createEmptyPersonDiagnosis,
} from '../types/diagnosis';

export type DiagnosisStep =
  | 'person_count'
  | 'person_info'
  | 'common_settings'
  | 'confirm';

interface UseDiagnosisOptions {
  onComplete: (input: DiagnosisInput) => void;
}

export function useDiagnosis({ onComplete }: UseDiagnosisOptions) {
  const [step, setStep] = useState<DiagnosisStep>('person_count');
  const [personCount, setPersonCount] = useState<number>(1);
  const [currentPersonIndex, setCurrentPersonIndex] = useState<number>(0);
  const [persons, setPersons] = useState<PersonDiagnosis[]>([]);
  const [common, setCommon] = useState<CommonSettings | null>(null);

  // 人数選択完了
  const handlePersonCountComplete = useCallback((count: number) => {
    setPersonCount(count);
    // 人数分の空の診断データを作成
    const emptyPersons = Array.from({ length: count }, () =>
      createEmptyPersonDiagnosis()
    );
    setPersons(emptyPersons);
    setCurrentPersonIndex(0);
    setStep('person_info');
  }, []);

  // 1人分の情報入力完了
  const handlePersonComplete = useCallback((index: number, data: PersonDiagnosis) => {
    setPersons((prev) => {
      const updated = [...prev];
      updated[index] = data;
      return updated;
    });

    if (index < personCount - 1) {
      // 次の人へ
      setCurrentPersonIndex(index + 1);
    } else {
      // 全員完了、共通設定へ
      setStep('common_settings');
    }
  }, [personCount]);

  // 共通設定完了
  const handleCommonComplete = useCallback((data: CommonSettings) => {
    setCommon(data);
    setStep('confirm');
  }, []);

  // 確認画面から戻る
  const handleBackToPersonInfo = useCallback(() => {
    setCurrentPersonIndex(personCount - 1);
    setStep('person_info');
  }, [personCount]);

  const handleBackToCommon = useCallback(() => {
    setStep('common_settings');
  }, []);

  // 診断実行
  const handleConfirm = useCallback(() => {
    if (common) {
      onComplete({
        personCount,
        persons,
        common,
      });
    }
  }, [onComplete, personCount, persons, common]);

  // 前のステップに戻る
  const handleBack = useCallback(() => {
    if (step === 'person_info') {
      if (currentPersonIndex > 0) {
        setCurrentPersonIndex(currentPersonIndex - 1);
      } else {
        setStep('person_count');
      }
    } else if (step === 'common_settings') {
      setCurrentPersonIndex(personCount - 1);
      setStep('person_info');
    } else if (step === 'confirm') {
      setStep('common_settings');
    }
  }, [step, currentPersonIndex, personCount]);

  // プログレス計算
  const calculateProgress = useCallback(() => {
    const totalSteps = personCount + 2; // 人数選択 + 人数分 + 共通設定
    let currentStep = 0;

    if (step === 'person_count') {
      currentStep = 0;
    } else if (step === 'person_info') {
      currentStep = 1 + currentPersonIndex;
    } else if (step === 'common_settings') {
      currentStep = personCount + 1;
    } else if (step === 'confirm') {
      currentStep = totalSteps;
    }

    return Math.round((currentStep / totalSteps) * 100);
  }, [step, currentPersonIndex, personCount]);

  return {
    step,
    personCount,
    currentPersonIndex,
    persons,
    common,
    progress: calculateProgress(),
    handlePersonCountComplete,
    handlePersonComplete,
    handleCommonComplete,
    handleBackToPersonInfo,
    handleBackToCommon,
    handleConfirm,
    handleBack,
  };
}

// Re-export for convenience
export { createEmptyPersonDiagnosis, createEmptyCommonSettings } from '../types/diagnosis';
