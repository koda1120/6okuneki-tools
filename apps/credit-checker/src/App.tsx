import { useState, useEffect } from 'react';
import { RegistrationForm, useLocalStorage } from '@6okuneki/shared';
import { CsvUploadPage } from './components/upload/CsvUploadPage';
import { ResultPage } from './components/result/ResultPage';
import type { DiagnosisResult } from './types';

type AppStep = 'registration' | 'upload' | 'result';

const LOCAL_STORAGE_KEY = '6okuniki_credit_registered';

function App() {
  const [isRegistered] = useLocalStorage(LOCAL_STORAGE_KEY, false);
  const [step, setStep] = useState<AppStep>('registration');
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // 登録済みの場合はアップロード画面へ
  useEffect(() => {
    if (isRegistered) {
      setStep('upload');
    }
  }, [isRegistered]);

  const handleRegistrationComplete = () => {
    setStep('upload');
  };

  const handleUploadComplete = (diagnosisResult: DiagnosisResult) => {
    setResult(diagnosisResult);
    setStep('result');
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setResult(null);
    setStep('upload');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-bg-base">
      {step === 'registration' && (
        <RegistrationForm
          siteName="生活コスト見直し診断 クレカ明細チェッカー"
          title="クレカ明細をチェック"
          description="支出をカテゴリ分けして、見直しポイントを診断します"
          accentColor="#C67B4E"
          submitButtonText="診断を始める"
          localStorageKey={LOCAL_STORAGE_KEY}
          onComplete={handleRegistrationComplete}
        />
      )}

      {step === 'upload' && (
        <CsvUploadPage onComplete={handleUploadComplete} />
      )}

      {step === 'result' && result && (
        <ResultPage result={result} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
