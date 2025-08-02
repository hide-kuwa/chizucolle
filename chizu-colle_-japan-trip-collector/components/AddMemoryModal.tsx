
import React, { useState, useMemo, useEffect } from 'react';
import { useGlobalContext } from '../context/AppContext';
import { prefectures } from '../data/prefectures';
import { CloseIcon } from './icons/CloseIcon';
import Spinner from './Spinner';

interface AddMemoryModalProps {
  onClose: () => void;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ onClose }) => {
  const { addMemory, loading, memories } = useGlobalContext();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const unvisitedPrefectures = useMemo(() => {
    // Return all prefectures to allow adding more photos to any prefecture
    return prefectures;
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Revoke old previews to prevent memory leaks
      previews.forEach(url => URL.revokeObjectURL(url));

      const files = Array.from(event.target.files);
      if (files.length > 5) {
        setError("You can upload a maximum of 5 photos at a time.");
        setSelectedFiles([]);
        setPreviews([]);
        return;
      }
      setError('');
      setSelectedFiles(files);
      // Explicitly type `file` as `File` to fix the TS error. A File is a Blob.
      const newPreviews = files.map((file: File) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  // Clean up object URLs when the component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPrefecture || selectedFiles.length === 0) {
      setError("Please select a prefecture and at least one photo.");
      return;
    }
    setError('');
    try {
      await addMemory(selectedPrefecture, selectedFiles);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-box shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-base-200">
          <h2 className="text-xl font-bold text-primary">Add a New Memory</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-base-200 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          <div>
            <label htmlFor="prefecture-select" className="block text-sm font-medium text-text-secondary mb-1">Prefecture</label>
            <select
              id="prefecture-select"
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="w-full p-2 border border-base-300 rounded-button bg-white focus:ring-2 focus:ring-accent focus:border-accent"
              required
            >
              <option value="" disabled>Select a prefecture...</option>
              {unvisitedPrefectures.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="photo-upload" className="block text-sm font-medium text-text-secondary mb-1">Photos</label>
            <input
              id="photo-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-800"
            />
          </div>
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <img key={index} src={preview} alt="Preview" className="w-full h-24 object-cover rounded-md" />
              ))}
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
        <div className="p-4 border-t border-base-200 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="py-2 px-4 bg-base-200 hover:bg-base-300 text-text-secondary font-semibold rounded-button transition-colors">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={loading} className="py-2 px-4 bg-accent hover:bg-orange-600 text-white font-semibold rounded-button transition-colors flex items-center justify-center disabled:bg-gray-400 min-w-[100px]">
            {loading ? <Spinner /> : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemoryModal;
