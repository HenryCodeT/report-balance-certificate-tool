// components/PreviewModal.tsx
import React from 'react';
import { PreviewModalState } from '@/models/interface';

interface PreviewModalProps {
  modal: PreviewModalState;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ modal, onClose }) => {
  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {modal.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-4">
          <img
            src={modal.imageUrl}
            alt={modal.title}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;