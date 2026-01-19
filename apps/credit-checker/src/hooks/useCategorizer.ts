// カテゴリ分類のカスタムフック
import { useState, useCallback } from 'react';
import type { RawTransaction, DiagnosisResult } from '../types';
import { categorizeTransactions } from '../lib/categorizer';
import { buildDiagnosisResult } from '../lib/resultBuilder';

interface UseCategoryzerState {
  isLoading: boolean;
  result: DiagnosisResult | null;
  error: string | null;
}

export function useCategorizer() {
  const [state, setState] = useState<UseCategoryzerState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const categorize = useCallback(async (
    transactions: RawTransaction[],
    useAi: boolean = false
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // カテゴリ分類を実行
      const categorizedTxs = await categorizeTransactions(transactions, useAi);

      // 診断結果を構築
      const result = buildDiagnosisResult(categorizedTxs);

      setState({
        isLoading: false,
        result,
        error: null,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '分類に失敗しました';
      setState({
        isLoading: false,
        result: null,
        error: errorMessage,
      });

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    categorize,
    reset,
  };
}
