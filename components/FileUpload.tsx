
import React, { useCallback, useState } from 'react';
import { UploadedFile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FileUploadProps {
  onFileSelected: (file: UploadedFile) => void;
  isPro?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isPro = false }) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    const validTypes = ['text/plain', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError(t('upload.error_type'));
      return;
    }

    const limit = isPro ? 10 * 1024 * 1024 : 2 * 1024 * 1024;
    const limitLabel = isPro ? '10MB' : '2MB';

    if (file.size > limit) { 
      setError(`${t('upload.error_size')} (Max ${limitLabel})`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      
      onFileSelected({
        name: file.name,
        mimeType: file.type,
        data: base64Data
      });
    };
    reader.onerror = () => {
      setError('Error reading file.');
    };
    reader.readAsDataURL(file);
  };

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [isPro]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-16 md:p-24 text-center transition-all duration-300 ease-in-out cursor-pointer group
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]' 
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
          }
        `}
      >
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className="flex flex-col items-center pointer-events-none">
          <div className={`p-5 rounded-full mb-6 transition-colors ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">
            {isDragging ? t('upload.drop') : t('upload.drag')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('upload.limit')} (Max {isPro ? '10MB' : '2MB'})
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-lg flex items-center justify-center animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* What happens next section */}
      <div className="mt-12 text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">What happens next?</p>
          <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">1</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Reads Document</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">2</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Extracts Concepts</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">3</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Builds Flashcards</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default FileUpload;
