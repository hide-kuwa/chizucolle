'use client';

import React, { useState } from 'react';
import { prefectures } from '@/data/prefectures';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (prefectureId: string, files: File[]) => Promise<void>;
  /** Optional prefecture id. When provided the selector is hidden. */
  prefectureId?: string;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, onUpload, prefectureId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files || []);
    setFiles(chosen);
    setPreviews(chosen.map(f => URL.createObjectURL(f)));
  };

  const handleUpload = async () => {
    if (!prefectureId || files.length === 0) return;
    setLoading(true);
    try {
      await onUpload(prefectureId, files);
      setFiles([]);
      setPreviews([]);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fade-in-scale">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-background p-4">
          <h2 className="text-lg font-bold text-primary">思い出の写真を追加</h2>
          <button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-slate-200">✕</button>
        </div>

        <div className="space-y-4 p-6">
          <p className="font-semibold text-text-primary">
            {prefectureId ? prefectures.find(p => p.id === prefectureId)?.name : '都道府県を選択'}
          </p>

          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-text-secondary mb-2">
              写真を選択 (複数選択可)
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-slate-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">クリック</span> またはドラッグ&ドロップ
                  </p>
                </div>
                <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((url, idx) => (
                <img key={idx} src={url} alt="preview" className="h-24 w-full rounded-md object-cover" />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 border-t border-background p-4">
          <button
            onClick={onClose}
            className="rounded-button bg-background px-4 py-2 font-semibold text-text-secondary transition hover:bg-slate-200"
            disabled={loading}
          >
            キャンセル
          </button>
          <button
            onClick={handleUpload}
            className="rounded-button bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            disabled={loading || !prefectureId || files.length === 0}
          >
            {loading ? 'アップロード中...' : 'アップロード'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemoryModal;

