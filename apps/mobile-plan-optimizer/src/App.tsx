import { useState, useEffect } from 'react';
import { RegistrationForm, useLocalStorage } from '@6okuneki/shared';
import { DiagnosisWizard } from './components/diagnosis/DiagnosisWizard';
import { ResultPage } from './components/result/ResultPage';
import type { DiagnosisInput } from './types/diagnosis';
import type { DiagnosisResult } from './types/result';
import { colors } from './constants/colors';

const SITE_NAME = '携帯料金プラン最適化診断';
const LOCAL_STORAGE_KEY = '6okuniki_mobile_registered';

type AppStep = 'registration' | 'diagnosis' | 'result';

function App() {
  const [isRegistered] = useLocalStorage(LOCAL_STORAGE_KEY, false);
  const [step, setStep] = useState<AppStep>('registration');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  // 登録済みの場合は診断画面へ
  useEffect(() => {
    if (isRegistered) {
      setStep('diagnosis');
    }
  }, [isRegistered]);

  const handleRegistrationComplete = () => {
    setStep('diagnosis');
    window.scrollTo(0, 0);
  };

  const handleDiagnosisComplete = (_input: DiagnosisInput, result: DiagnosisResult) => {
    setDiagnosisResult(result);
    setStep('result');
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setDiagnosisResult(null);
    setStep('diagnosis');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-bg-base">
      {step === 'registration' && (
        <RegistrationForm
          siteName={SITE_NAME}
          title="あなたに最適なプランを診断"
          description="100社以上のプランからあなたにぴったりのものを見つけます"
          accentColor={colors.accent}
          submitButtonText="診断を始める"
          localStorageKey={LOCAL_STORAGE_KEY}
          onComplete={handleRegistrationComplete}
        />
      )}
      {step === 'diagnosis' && (
        <DiagnosisWizard onComplete={handleDiagnosisComplete} />
      )}
      {step === 'result' && diagnosisResult && (
        <ResultPage result={diagnosisResult} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
