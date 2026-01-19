import { useState, useCallback } from 'react';
import type {
  DiagnosisInput,
  UserUsage,
  CommonSettings,
} from '../types/diagnosis';
import {
  createEmptyUserUsage,
  createEmptyCommonSettings,
} from '../types/diagnosis';

export type DiagnosisStep = 'user_info' | 'settings' | 'confirm';

interface UseDiagnosisOptions {
  onComplete: (input: DiagnosisInput) => void;
}

export function useDiagnosis({ onComplete }: UseDiagnosisOptions) {
  const [step, setStep] = useState<DiagnosisStep>('user_info');
  const [user, setUser] = useState<UserUsage>(createEmptyUserUsage());
  const [common, setCommon] = useState<CommonSettings>(createEmptyCommonSettings());

  // ユーザー情報入力完了
  const handleUserComplete = useCallback((data: UserUsage) => {
    setUser(data);
    setStep('settings');
  }, []);

  // 設定入力完了
  const handleSettingsComplete = useCallback((data: CommonSettings) => {
    setCommon(data);
    setStep('confirm');
  }, []);

  // 診断実行
  const handleConfirm = useCallback(() => {
    onComplete({
      user,
      common,
    });
  }, [onComplete, user, common]);

  // 前のステップに戻る
  const handleBack = useCallback(() => {
    if (step === 'settings') {
      setStep('user_info');
    } else if (step === 'confirm') {
      setStep('settings');
    }
  }, [step]);

  // プログレス計算
  const calculateProgress = useCallback(() => {
    if (step === 'user_info') return 33;
    if (step === 'settings') return 66;
    return 100;
  }, [step]);

  return {
    step,
    user,
    common,
    progress: calculateProgress(),
    handleUserComplete,
    handleSettingsComplete,
    handleConfirm,
    handleBack,
  };
}
