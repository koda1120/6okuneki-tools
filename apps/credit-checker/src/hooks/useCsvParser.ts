// CSV/PDFパースのカスタムフック
import { useState, useCallback } from 'react';
import type { RawTransaction } from '../types';
import { parseCsv, type ParseResult } from '../lib/csvParser';
import { parsePdf, isPdfFile } from '../lib/pdfParser';

interface UseFileParserState {
  isLoading: boolean;
  transactions: RawTransaction[];
  format: string;
  error: string | null;
  warning: string | null;
  isPdf: boolean;
}

export function useCsvParser() {
  const [state, setState] = useState<UseFileParserState>({
    isLoading: false,
    transactions: [],
    format: '',
    error: null,
    warning: null,
    isPdf: false,
  });

  const parseFile = useCallback(async (file: File, formatId: string = 'auto') => {
    setState(prev => ({ ...prev, isLoading: true, error: null, warning: null }));

    try {
      // PDFかCSVかを判定
      if (isPdfFile(file)) {
        // PDF解析
        const result = await parsePdf(file);

        if (result.success) {
          setState({
            isLoading: false,
            transactions: result.transactions,
            format: 'PDF',
            error: null,
            warning: result.warning || null,
            isPdf: true,
          });
        } else {
          setState({
            isLoading: false,
            transactions: [],
            format: 'PDF',
            error: result.error || 'PDFの解析に失敗しました',
            warning: null,
            isPdf: true,
          });
        }

        return {
          success: result.success,
          transactions: result.transactions,
          format: 'PDF',
          error: result.error,
        } as ParseResult;
      } else {
        // CSV解析
        const result = await parseCsv(file, formatId);

        if (result.success) {
          setState({
            isLoading: false,
            transactions: result.transactions,
            format: result.format,
            error: null,
            warning: null,
            isPdf: false,
          });
        } else {
          setState({
            isLoading: false,
            transactions: [],
            format: result.format,
            error: result.error || '解析に失敗しました',
            warning: null,
            isPdf: false,
          });
        }

        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー';
      setState({
        isLoading: false,
        transactions: [],
        format: '',
        error: errorMessage,
        warning: null,
        isPdf: false,
      });

      return {
        success: false,
        transactions: [],
        format: '',
        error: errorMessage,
      } as ParseResult;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      transactions: [],
      format: '',
      error: null,
      warning: null,
      isPdf: false,
    });
  }, []);

  return {
    ...state,
    parseFile,
    reset,
  };
}
