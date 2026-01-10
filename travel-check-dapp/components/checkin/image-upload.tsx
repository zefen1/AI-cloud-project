'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  preview?: string;
}

export default function ImageUpload({ onImageSelect, onImageRemove, preview }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过 10MB');
      return;
    }

    onImageSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {preview ? (
        // 图片预览
        <div className="relative group">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
            <img
              src={preview}
              alt="预览"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={onImageRemove}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-all"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                <span>删除图片</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 上传区域
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUpload}
          className={`
            relative w-full aspect-video rounded-xl border-2 border-dashed cursor-pointer
            transition-all duration-300
            ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10'
            }
          `}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className={`
              size-16 rounded-full flex items-center justify-center transition-all
              ${isDragging ? 'bg-primary/20 scale-110' : 'bg-white/10'}
            `}>
              <span className={`
                material-symbols-outlined text-4xl transition-colors
                ${isDragging ? 'text-primary' : 'text-gray-400'}
              `}>
                {isDragging ? 'file_download' : 'add_photo_alternate'}
              </span>
            </div>
            <div className="text-center">
              <p className={`
                font-medium mb-1 transition-colors
                ${isDragging ? 'text-primary' : 'text-white'}
              `}>
                {isDragging ? '松开上传图片' : '点击或拖拽上传图片'}
              </p>
              <p className="text-sm text-gray-400">
                支持 JPG, PNG, GIF (最大 10MB)
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
