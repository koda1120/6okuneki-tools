// トランザクション型定義
import type { Category } from './category';

export interface RawTransaction {
  date: string;
  description: string;
  amount: number;
  memo?: string;
}

export type MatchMethod =
  | 'merchant_exact'
  | 'merchant_partial'
  | 'keyword'
  | 'ai'
  | 'unclassified';

export interface SubscriptionInfo {
  serviceName: string;
  frequency: 'monthly' | 'yearly' | 'unknown';
  cancelUrl?: string;
}

export interface CategorizedTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  memo?: string;
  category: Category | null;
  subcategory?: string;
  matchMethod: MatchMethod;
  confidence: number;
  isSubscription: boolean;
  subscriptionInfo?: SubscriptionInfo;
}
