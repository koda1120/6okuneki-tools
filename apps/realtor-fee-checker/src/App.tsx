import { useState, useEffect } from 'react';
import { RegistrationForm } from '@6okuneki/shared';
import { DiagnosisPage } from './components/diagnosis/DiagnosisPage';
import { ResultPage } from './components/result/ResultPage';
import type { AppStep, DiagnosisResult } from './types';
import { config } from './constants/config';

function App() {
  const [step, setStep] = useState<AppStep>('registration');
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // 登録済みチェック
  useEffect(() => {
    const isRegistered = localStorage.getItem(config.localStorageKey);
    if (isRegistered === 'true') {
      setStep('diagnosis');
    }
  }, []);

  const handleRegistrationComplete = () => {
    setStep('diagnosis');
    window.scrollTo(0, 0);
  };

  const handleDiagnosisComplete = (diagnosisResult: DiagnosisResult) => {
    setResult(diagnosisResult);
    setStep('result');
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setResult(null);
    setStep('diagnosis');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {step === 'registration' && (
        <RegistrationForm
          siteName={config.siteName}
          title="仲介手数料をチェック"
          description="その手数料、払いすぎていませんか？"
          accentColor="#2C4A7C"
          submitButtonText="診断スタート"
          localStorageKey={config.localStorageKey}
          onComplete={handleRegistrationComplete}
        />
      )}

      {step === 'diagnosis' && (
        <DiagnosisPage onComplete={handleDiagnosisComplete} />
      )}

      {step === 'result' && result && (
        <ResultPage result={result} onRestart={handleRestart} />
      )}
    </>
  );
}

export default App;
