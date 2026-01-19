import { useCallback, useState } from 'react';
import { Upload, FileText, FileSpreadsheet, X } from 'lucide-react';

interface CsvDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isLoading: boolean;
}

function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

function isCsvFile(file: File): boolean {
  return file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
}

function isValidFile(file: File): boolean {
  return isPdfFile(file) || isCsvFile(file);
}

export function CsvDropzone({ onFileSelect, selectedFile, onClear, isLoading }: CsvDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  if (selectedFile) {
    const isPdf = isPdfFile(selectedFile);

    return (
      <div className="bg-bg-card rounded-soft shadow-warm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isPdf ? 'bg-red-100' : 'bg-accent-light'
            }`}>
              {isPdf ? (
                <FileText className="w-6 h-6 text-red-500" />
              ) : (
                <FileSpreadsheet className="w-6 h-6 text-accent" />
              )}
            </div>
            <div>
              <p className="font-medium text-text-main">{selectedFile.name}</p>
              <p className="text-sm text-text-sub">
                {(selectedFile.size / 1024).toFixed(1)} KB
                <span className="ml-2 px-2 py-0.5 bg-bg-base rounded text-xs">
                  {isPdf ? 'PDF' : 'CSV'}
                </span>
              </p>
            </div>
          </div>
          {!isLoading && (
            <button
              onClick={onClear}
              className="p-2 hover:bg-bg-base rounded-full transition-colors"
              aria-label="ファイルを削除"
            >
              <X className="w-5 h-5 text-text-sub" />
            </button>
          )}
        </div>

        {/* PDF注意書き */}
        {isPdf && (
          <div className="mt-3 p-3 bg-warning/10 rounded-lg">
            <p className="text-xs text-warning leading-relaxed">
              PDFからの読み取りは精度にばらつきが出る場合があります。可能であればCSVのご利用をおすすめします。
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-softer p-8
        flex flex-col items-center justify-center gap-4
        transition-all cursor-pointer
        ${isDragging
          ? 'border-accent bg-accent-light shadow-warm'
          : 'border-border hover:border-accent/50 hover:bg-bg-card hover:shadow-warm'
        }
      `}
    >
      <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center">
        <Upload className="w-8 h-8 text-accent" />
      </div>

      <div className="text-center">
        <p className="text-text-main font-medium mb-1">
          ファイルをドラッグ＆ドロップ
        </p>
        <p className="text-sm text-text-sub">
          または
        </p>
      </div>

      <label className="cursor-pointer">
        <input
          type="file"
          accept=".csv,.pdf,text/csv,application/pdf"
          onChange={handleFileInput}
          className="sr-only"
        />
        <span className="inline-block px-6 py-3 bg-accent text-white rounded-soft font-medium hover:bg-accent/90 transition-colors shadow-warm">
          ファイルを選択
        </span>
      </label>

      <div className="text-center">
        <p className="text-xs text-text-sub mb-1">
          対応形式: CSV（推奨）/ PDF
        </p>
        <p className="text-xs text-text-sub">
          楽天カード、三井住友カード、JCB、アメックス など
        </p>
      </div>
    </div>
  );
}
