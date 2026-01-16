import { GAS_URL } from '../constants/config';
import type { RegistrationData } from '../types/registration';

export async function sendRegistration(data: RegistrationData): Promise<boolean> {
  try {
    await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return true;
  } catch {
    // エラー時もツール利用は継続可能
    return false;
  }
}
