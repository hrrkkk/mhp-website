import React, { useEffect } from 'react';
import { X, Calendar, Tag } from 'lucide-react';

const LightboxModal = ({ isOpen, onClose, image }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700 transition-all z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
          <img
            src={image.imageUrl || image.image}
            alt={image.title}
            className="w-full h-full object-cover max-h-[70vh]"
          />
        </div>
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {image.category || 'MHP Campus'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
              {image.title || 'MHP Campus Moment'}
            </h3>
            {image.description && (
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {image.description}
              </p>
            )}
          </div>
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Added on {image.date || 'VFSTR MHP'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
