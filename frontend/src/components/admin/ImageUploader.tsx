'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Plus, Star } from 'lucide-react';
import { getImageUrl, uploadCarImagesBatched } from '@/lib/api';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  token: string;
  carId?: string;
  pendingFiles?: File[];
  onPendingFilesChange?: (files: File[]) => void;
}

type PreviewItem = {
  id: string;
  src: string;
  isPending?: boolean;
  index: number;
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

const EMPTY_PENDING: File[] = [];

function filesKey(files: File[]): string {
  return files.map((f) => `${f.name}-${f.size}-${f.lastModified}`).join('|');
}

export default function ImageUploader({
  images,
  onChange,
  token,
  carId,
  pendingFiles,
  onPendingFilesChange,
}: ImageUploaderProps) {
  const queuedFiles = pendingFiles ?? EMPTY_PENDING;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const pendingKey = filesKey(queuedFiles);

  useEffect(() => {
    const urls = queuedFiles.map((f) => URL.createObjectURL(f));
    setBlobUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [pendingKey]);

  const previews: PreviewItem[] = [
    ...images.map((src, i) => ({ id: `url-${i}-${src}`, src, index: i })),
    ...blobUrls.map((src, i) => ({
      id: `pending-${i}`,
      src,
      isPending: true,
      index: images.length + i,
    })),
  ];

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !token) return;

    const fileList = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!fileList.length) {
      setError('Выберите изображения (JPG, PNG, WebP, GIF)');
      return;
    }

    setError('');

    if (carId) {
      setUploading(true);
      try {
        setProgress(`Загрузка ${fileList.length} фото...`);
        const updated = await uploadCarImagesBatched(token, carId, fileList);
        onChange(asStringArray(updated));
        setProgress('');
      } catch {
        setError('Не удалось загрузить фото. Попробуйте ещё раз.');
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
      return;
    }

    onPendingFilesChange?.([...queuedFiles, ...fileList]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeAt = (item: PreviewItem) => {
    if (item.isPending) {
      const pendingIndex = item.index - images.length;
      onPendingFilesChange?.(queuedFiles.filter((_, i) => i !== pendingIndex));
      return;
    }
    onChange(images.filter((_, i) => i !== item.index));
  };

  const totalCount = previews.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <label className="block text-xs uppercase tracking-wider text-white/40">
          Фотографии товара
        </label>
        <span className="text-xs text-white/40">
          {totalCount > 0 ? `${totalCount} фото` : 'Без ограничений'}
        </span>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {previews.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square bg-white/5 border border-white/10 group overflow-hidden"
            >
              <Image
                src={item.isPending ? item.src : getImageUrl(item.src)}
                alt=""
                fill
                unoptimized={item.isPending}
                className="object-cover"
                sizes="160px"
              />
              {item.index === 0 && (
                <span className="absolute top-1 left-1 flex items-center gap-1 bg-gold/90 text-dark text-[10px] font-semibold px-1.5 py-0.5 uppercase">
                  <Star className="w-3 h-3" /> Главное
                </span>
              )}
              {item.isPending && (
                <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5">
                  Новое
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(item)}
                disabled={uploading}
                className="absolute top-1 right-1 p-1 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-30"
                aria-label="Удалить фото"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => !uploading && inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border border-dashed border-white/20 bg-white/[0.02] flex flex-col items-center justify-center gap-2 text-white/40 hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-50"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">Ещё фото</span>
          </button>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && previews.length === 0 && inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 border border-dashed border-white/20 bg-white/[0.02] px-6 py-10 transition-colors ${
          previews.length === 0 ? 'cursor-pointer hover:border-gold/40 hover:bg-white/[0.04]' : ''
        } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        {uploading ? (
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-white/30" />
        )}
        <p className="text-sm text-white/60 text-center">
          {uploading
            ? progress || 'Загрузка...'
            : previews.length > 0
              ? 'Перетащите ещё фото или нажмите «Ещё фото»'
              : 'Загрузите фото — сколько угодно, как на Wildberries'}
        </p>
        <p className="text-xs text-white/30">JPG, PNG, WebP, GIF — до 10 МБ каждое</p>
        {previews.length === 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-gold/15 text-gold text-sm border border-gold/30 hover:bg-gold/25"
          >
            <Plus className="w-4 h-4" /> Выбрать фото
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!carId && queuedFiles.length > 0 && (
        <p className="text-white/40 text-xs">
          {queuedFiles.length} фото загрузятся автоматически после сохранения товара
        </p>
      )}
    </div>
  );
}
