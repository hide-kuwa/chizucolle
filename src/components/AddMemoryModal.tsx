'use client';

import React, { useState } from 'react';
import { prefectures } from '@/data/prefectures';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (prefectureId: string, files: File[]) => Promise<void>;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
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
    if (!selectedPrefecture || files.length === 0) return;
    setLoading(true);
    try {
      await onUpload(selectedPrefecture, files);
      setSelectedPrefecture('');
      setFiles([]);
      setPreviews([]);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">思い出を追加</h2>
        <select
          className="mb-4 w-full border p-2"
          value={selectedPrefecture}
          onChange={(e) => setSelectedPrefecture(e.target.value)}
        >
          <option value="">都道府県を選択</option>
          {prefectures.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input type="file" multiple onChange={handleFileChange} className="mb-4" />
        <div className="mb-4 grid grid-cols-3 gap-2">
          {previews.map((url, idx) => (
            <img key={idx} src={url} alt="preview" className="h-24 w-full rounded object-cover" />
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2"
            disabled={loading}
          >
            キャンセル
          </button>
          <button
            onClick={handleUpload}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            disabled={loading || !selectedPrefecture || files.length === 0}
          >
            {loading ? 'アップロード中...' : 'アップロード'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemoryModal;

