import React from 'react';
import type { EncryptedFile } from '../types';
import { FileIcon } from './icons/FileIcon';

interface FileViewerProps {
  file: EncryptedFile | null;
  onClose: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ file, onClose }) => {
  if (!file) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="file-viewer-title"
    >
      <div 
        className="relative w-full max-w-2xl h-[80vh] max-h-[700px] bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex flex-col shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center gap-3">
                <FileIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div>
                    <h3 id="file-viewer-title" className="text-lg font-bold text-gray-100">{file.name}</h3>
                    <p className="text-xs text-gray-400">{file.type} - {file.uploadDate}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                {file.content}
            </pre>
        </div>
      </div>
    </div>
  );
};