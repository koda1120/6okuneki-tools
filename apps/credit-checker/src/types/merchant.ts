// 店名データベース型定義
import type { Category } from './category';

export interface MerchantEntry {
  name: string;
  category: Category;
  subcategory?: string;
  aliases: string[];
  country: 'jp' | 'global';
  isSubscription?: boolean;
  cancelUrl?: string;
}

export interface KeywordEntry {
  keyword: string;
  category: Category;
  subcategory?: string;
  priority: number;
  language: 'ja' | 'en' | 'both';
}

export interface CsvFormat {
  id: string;
  name: string;
  columns: {
    date: string;
    description: string;
    amount: string;
  };
  encoding: string;
}
