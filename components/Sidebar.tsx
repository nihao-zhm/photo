import React from 'react';
import { PhotoItem } from '../types';
import { Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface SidebarProps {
  photos: PhotoItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAddFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  photos,
  selectedId,
  onSelect,
  onRemove,
  onAddFiles
}) => {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Photo Queue</h2>
        <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{photos.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {photos.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No photos added</p>
          </div>
        )}
        
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onSelect(photo.id)}
            className={`
              relative group cursor-pointer p-2 rounded-lg border transition-all duration-200
              ${photo.id === selectedId 
                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm' 
                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 border border-slate-200 relative">
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.name} 
                  className="w-full h-full object-cover"
                />
                {photo.isProcessing && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{photo.name}</p>
                <p className="text-xs text-slate-500 truncate">
                  {photo.processedUrl ? 'Processed' : 'Original'}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(photo.id);
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-500 transition-opacity shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200">
        <label className="flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-sm font-medium shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add Photos</span>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={onAddFiles} 
            className="hidden" 
          />
        </label>
      </div>
    </div>
  );
};
