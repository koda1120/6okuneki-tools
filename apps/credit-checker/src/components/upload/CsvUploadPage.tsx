import { useState, useCallback } from 'react';
import { CreditCard, AlertCircle, Shield, Loader2, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '@6okuneki/shared';
import { CsvDropzone } from './CsvDropzone';
import { FormatSelector } from './FormatSelector';
import { PreviewTable } from './PreviewTable';
import { CsvDownloadGuide } from './CsvDownloadGuide';
import { useCsvParser } from '../../hooks/useCsvParser';
import { useCategorizer } from '../../hooks/useCategorizer';
import type { DiagnosisResult } from '../../types';

interface CsvUploadPageProps {
  onComplete: (result: DiagnosisResult) => void;
}

export function CsvUploadPage({ onComplete }: CsvUploadPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formatId, setFormatId] = useState('auto');
  const [showGuide, setShowGuide] = useState(false);

  const {
    isLoading: isParsing,
    transactions,
    format,
    error: parseError,
    warning: parseWarning,
    isPdf,
    parseFile,
    reset: resetParser,
  } = useCsvParser();

  const {
    isLoading: isCategorizing,
    error: categorizeError,
    categorize,
  } = useCategorizer();

  const isLoading = isParsing || isCategorizing;
  const error = parseError || categorizeError;

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    await parseFile(file, formatId);
  }, [formatId, parseFile]);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    resetParser();
  }, [resetParser]);

  const handleFormatChange = useCallback(async (newFormatId: string) => {
    setFormatId(newFormatId);
    if (selectedFile && !isPdf) {
      await parseFile(selectedFile, newFormatId);
    }
  }, [selectedFile, isPdf, parseFile]);

  const handleAnalyze = useCallback(async () => {
    if (transactions.length === 0) return;

    // ベストエフォート方式：AI分類は自動的に実行
    const result = await categorize(transactions, true);
    if (result) {
      onComplete(result);
    }
  }, [transactions, categorize, onComplete]);

  return (
    <div className="min-h-screen bg-bg-base py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-light rounded-full mb-4 shadow-warm">
            <CreditCard className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">
            クレカ明細をアップロード
          </h1>
          <p className="text-text-sub">
            CSV または PDF を選択して、支出を分析します
          </p>
        </div>

        {/* セキュリティ注記 */}
        <div className="bg-success/10 border border-success/20 rounded-soft p-4 mb-6 shadow-warm">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-success text-sm mb-1">
                データはサーバーに送信されません
              </p>
              <p className="text-xs text-success/80">
                すべてブラウザ内で処理され、ページを閉じると破棄されます
              </p>
            </div>
          </div>
        </div>

        {/* ファイルアップロード */}
        <div className="space-y-4 mb-6">
          <CsvDropzone
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClear={handleClearFile}
            isLoading={isLoading}
          />

          {/* CSVの場合のみフォーマット選択を表示 */}
          {!isPdf && (
            <FormatSelector
              value={formatId}
              onChange={handleFormatChange}
              disabled={isLoading}
            />
          )}

          {/* CSVダウンロード方法リンク */}
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center justify-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors w-full py-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>CSVのダウンロード方法がわからない？</span>
          </button>
        </div>

        {/* PDF警告表示 */}
        {parseWarning && (
          <div className="bg-warning/10 border border-warning/20 rounded-soft p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-sm text-warning">{parseWarning}</p>
            </div>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-soft p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* プレビュー */}
        {transactions.length > 0 && (
          <div className="mb-6">
            <PreviewTable transactions={transactions} format={format} />
          </div>
        )}

        {/* 分析ボタン */}
        {transactions.length > 0 && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full rounded-soft"
          >
            {isCategorizing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                分析中...
              </span>
            ) : (
              `${transactions.length}件を分析する`
            )}
          </Button>
        )}

        {/* ローディング表示 */}
        {isParsing && (
          <div className="flex items-center justify-center gap-2 py-4 text-text-sub">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{isPdf ? 'PDFを解析中...' : 'CSVを解析中...'}</span>
          </div>
        )}
      </div>

      {/* CSVダウンロードガイドモーダル */}
      <CsvDownloadGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}
