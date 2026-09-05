import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  FolderOpen,
  AlertCircle,
  File
} from 'lucide-react';

export default function FileUploadZone({
  label = "Upload File",
  subLabel = "Drag and drop your file here, or click to browse",
  accept = ".pdf,application/pdf",
  value = "",
  fileName = "",
  fileSize = null,
  onChange,
  type = "pdf", // 'pdf' | 'image' | 'file'
  maxSizeMB = 25,
  required = false
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    // Validate max file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMessage(`File is too large (${formatFileSize(file.size)}). Maximum allowed size is ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (onChange) {
        onChange({
          file,
          dataUrl,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrorMessage('');
    if (onChange) {
      onChange({
        file: null,
        dataUrl: '',
        fileName: '',
        fileSize: 0,
        fileType: ''
      });
    }
  };

  const hasValue = Boolean(value && value.trim());
  const isImage = type === 'image' || (value && (value.startsWith('data:image') || value.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i)));
  const isPdf = type === 'pdf' || (value && (value.startsWith('data:application/pdf') || value.match(/\.pdf$/i)));

  return (
    <div className="space-y-1.5 w-full text-xs">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-slate-700 font-bold">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {maxSizeMB && (
            <span className="text-[10px] text-slate-400">Max size: {maxSizeMB}MB</span>
          )}
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Dropzone Container */}
      {!hasValue ? (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer select-none group ${
            isDragging
              ? 'border-[#C9A84C] bg-amber-50/70 scale-[1.01] shadow-md'
              : 'border-slate-300 hover:border-[#1C5496] bg-slate-50/80 hover:bg-blue-50/30'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className={`p-3 rounded-full transition-transform duration-200 group-hover:scale-110 ${
              isDragging ? 'bg-[#C9A84C] text-[#0B1F4E]' : 'bg-blue-100 text-[#1C5496]'
            }`}>
              <UploadCloud className="w-6 h-6" />
            </div>
            
            <div>
              <p className="font-bold text-slate-800 text-xs">
                {isDragging ? 'Drop file here to upload' : 'Click to browse or drag and drop'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {subLabel}
              </p>
            </div>

            <button
              type="button"
              className="mt-1 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-[11px] font-bold text-slate-700 shadow-2xs inline-flex items-center space-x-1.5 pointer-events-none"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#1C5496]" />
              <span>Choose Local File</span>
            </button>
          </div>
        </div>
      ) : (
        /* File Uploaded Preview Card */
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3 min-w-0">
            {isImage ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white shadow-2xs">
                <img
                  src={value}
                  alt={fileName || "Uploaded image"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : isPdf ? (
              <div className="p-2.5 rounded-lg bg-rose-100 text-rose-600 shrink-0 shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-blue-100 text-[#1C5496] shrink-0 shadow-2xs">
                <File className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-800 text-xs truncate max-w-[220px] sm:max-w-[320px]">
                  {fileName || (value.startsWith('data:') ? 'Uploaded Document' : value.split('/').pop())}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>

              <div className="flex items-center space-x-2 text-[10.5px] text-slate-500 font-mono mt-0.5">
                {fileSize ? (
                  <span>{formatFileSize(fileSize)}</span>
                ) : (
                  <span>Ready for publication</span>
                )}
                <span>·</span>
                <span className="text-emerald-700 font-bold uppercase">{isImage ? 'IMAGE' : isPdf ? 'PDF DOC' : 'FILE'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                title="Preview File"
              >
                <Eye className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors shadow-2xs"
            >
              Replace
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
              title="Remove File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center space-x-1 text-rose-600 text-[11px] font-semibold pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
