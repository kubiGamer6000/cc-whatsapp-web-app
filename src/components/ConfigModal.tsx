import React from 'react';
import { X } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onSave }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200">Firebase Configuration</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300 mb-4">
            Firebase configuration has been loaded from environment variables with the following credentials:
          </p>
          
          <div className="bg-gray-900 p-4 rounded-md text-sm text-green-400 font-mono mb-6 overflow-x-auto">
            <p>apiKey: "AIzaSyBcy7WS26j4bx-VjWT51xqZ1rg6gpcej9I"</p>
            <p>authDomain: "ace-whatsapp.firebaseapp.com"</p>
            <p>projectId: "ace-whatsapp"</p>
            <p>storageBucket: "ace-whatsapp.firebasestorage.app"</p>
            <p>messagingSenderId: "925030838934"</p>
            <p>appId: "1:925030838934:web:14355d72d9216dbaed48b7"</p>
            <p>measurementId: "G-7DEKSTPTBL"</p>
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Connect to Firebase
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;