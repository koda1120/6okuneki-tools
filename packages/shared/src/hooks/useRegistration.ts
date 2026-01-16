import { useState, useCallback } from 'react';
import type { AgeRange, Gender, RegistrationData } from '../types/registration';
import { validateEmail, sanitize } from '../lib/validation';
import { sendRegistration } from '../lib/api';
import { useLocalStorage } from './useLocalStorage';

interface UseRegistrationOptions {
  siteName: string;
  localStorageKey: string;
  onComplete: (data: RegistrationData) => void;
}

interface UseRegistrationReturn {
  // フォーム状態
  age: AgeRange | '';
  gender: Gender | '';
  email: string;
  agreed: boolean;
  emailError: string;
  isSubmitting: boolean;
  isRegistered: boolean;

  // アクション
  setAge: (age: AgeRange) => void;
  setGender: (gender: Gender) => void;
  setEmail: (email: string) => void;
  setAgreed: (agreed: boolean) => void;
  handleSubmit: () => Promise<void>;

  // バリデーション
  isFormValid: boolean;
}

export function useRegistration({
  siteName,
  localStorageKey,
  onComplete,
}: UseRegistrationOptions): UseRegistrationReturn {
  const [isRegistered, setIsRegistered] = useLocalStorage(localStorageKey, false);
  const [age, setAge] = useState<AgeRange | ''>('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('有効なメールアドレスを入力してください');
    } else {
      setEmailError('');
    }
  }, []);

  const isFormValid =
    age !== '' &&
    gender !== '' &&
    email !== '' &&
    validateEmail(email) &&
    agreed;

  const handleSubmit = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    const data: RegistrationData = {
      age: age as AgeRange,
      gender: gender as Gender,
      email: sanitize(email),
      siteName,
    };

    // GAS送信（エラーでも続行）
    await sendRegistration(data);

    // 登録済みフラグを保存
    setIsRegistered(true);

    setIsSubmitting(false);

    // 完了コールバック
    onComplete(data);
  }, [isFormValid, isSubmitting, age, gender, email, siteName, setIsRegistered, onComplete]);

  return {
    age,
    gender,
    email,
    agreed,
    emailError,
    isSubmitting,
    isRegistered,
    setAge,
    setGender,
    setEmail: handleEmailChange,
    setAgreed,
    handleSubmit,
    isFormValid,
  };
}
