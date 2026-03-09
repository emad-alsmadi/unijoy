'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadComponentProps {
  value?: File | string;
  onChange: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
  maxSize?: number;
  accept?: string[];
}

export function ImageUploadComponent({
  value,
  onChange,
  className,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = ['image/png', 'image/jpg', 'image/jpeg'],
}: ImageUploadComponentProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Show preview for existing image URL or uploaded file
  React.useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        setPreview(value); // URL from database
      } else if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setError(null);
      
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
          setError('File size must be less than 10MB');
        } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
          setError('Only PNG, JPG, and JPEG files are allowed');
        } else {
          setError('Invalid file');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onChange(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => {
      acc[type] = ['.' + type.split('/')[1]];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: 1,
    maxSize,
    disabled,
  });

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {preview ? (
        // Preview mode
        <div className='relative group'>
          <div className='relative overflow-hidden rounded-lg border border-slate-200'>
            <img
              src={preview}
              alt='Preview'
              className='w-full h-48 object-cover'
            />
            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
              <button
                type='button'
                onClick={handleRemove}
                className='bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
          <p className='text-xs text-slate-500 mt-1'>
            Click the X to remove image
          </p>
        </div>
      ) : (
        // Upload mode
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center space-y-2'>
            {isDragActive ? (
              <>
                <Upload className='h-8 w-8 text-blue-500' />
                <p className='text-sm text-blue-600'>
                  Drop the image here...
                </p>
              </>
            ) : (
              <>
                <ImageIcon className='h-8 w-8 text-slate-400' />
                <p className='text-sm text-slate-600'>
                  Drag & drop an image, or click to select
                </p>
                <p className='text-xs text-slate-500'>
                  PNG, JPG, JPEG up to {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className='mt-2 text-sm text-red-600'>
          {error}
        </div>
      )}
    </div>
  );
}

// Add React import
import React from 'react';
