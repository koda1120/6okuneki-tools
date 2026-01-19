// 診断結果型定義
import type { Category } from './category';
import type { CategorizedTransaction } from './transaction';

export interface CategorySummary {
  category: Category;
  label: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface SubscriptionDetection {
  serviceName: string;
  category: string;
  monthlyAmount: number;
  yearlyAmount: number;
  frequency: 'monthly' | 'yearly';
  cancelUrl?: string;
  transactions: CategorizedTransaction[];
}

export interface ReviewTip {
  id: string;
  title: string;
  description: string;
  category?: Category;
  amount?: number;
  severity: 'info' | 'warning' | 'suggestion';
}

export interface DiagnosisSummary {
  totalAmount: number;
  transactionCount: number;
  periodStart: string;
  periodEnd: string;
  classifiedCount: number;
  unclassifiedCount: number;
}

export interface UnclassifiedItem {
  transaction: CategorizedTransaction;
  reason: string;
}

export interface DiagnosisResult {
  summary: DiagnosisSummary;
  byCategory: CategorySummary[];
  subscriptions: SubscriptionDetection[];
  subscriptionMonthlyTotal: number;
  subscriptionYearlyTotal: number;
  reviewTips: ReviewTip[];
  unclassified: UnclassifiedItem[];
  transactions: CategorizedTransaction[];
  analyzedAt: string;
}
