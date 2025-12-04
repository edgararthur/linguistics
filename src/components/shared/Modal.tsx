import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from '../../utils/gsapConfig';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(".modal-content", 
        { opacity: 0, y: -50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.to(".modal-overlay", { opacity: 0.5, duration: 0.3 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div 
        className="modal-overlay fixed inset-0 bg-black opacity-0" 
        onClick={onClose}
      ></div>
      <div className="modal-content relative w-full max-w-lg mx-auto my-6 bg-white rounded-lg shadow-lg outline-none focus:outline-none z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-solid border-gray-200 rounded-t">
          {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
          <button
            className="p-1 ml-auto border-0 text-gray-500 hover:text-gray-700 float-right outline-none focus:outline-none transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Body */}
        <div className="relative p-6 flex-auto max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
