import React, { useEffect, useState } from 'react';
import { PhotoItem, IDSpec } from '../types';
import { cropAndResize } from '../services/imageUtils';
import { ImageOff, Loader2, Maximize } from 'lucide-react';

interface PhotoEditorProps {
  photo: PhotoItem | null;
  spec: IDSpec;
  processedUrl: string | null;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({ photo, spec, processedUrl }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'processed' | 'original'>('processed');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  useEffect(() => {
    let active = true;
    const generatePreview = async () => {
      if (!photo) {
        setPreviewUrl(null);
        return;
      }

      setIsGeneratingPreview(true);
      try {
        const sourceUrl = (processedUrl && viewMode === 'processed') ? processedUrl : photo.originalUrl;
        const cropped = await cropAndResize(sourceUrl, spec);
        
        if (active) {
          setPreviewUrl(cropped);
        }
      } catch (e) {
        console.error("Preview generation failed", e);
      } finally {
        if (active) setIsGeneratingPreview(false);
      }
    };

    generatePreview();
    return () => { active = false; };
  }, [photo, spec, processedUrl, viewMode]);

  if (!photo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center min-h-[300px]">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ImageOff className="w-8 h-8 md:w-10 md:h-10 opacity-50" />
        </div>
        <p className="font-medium text-lg">No photo selected</p>
        <p className="text-sm mt-1 max-w-[200px] md:max-w-none">Select a photo from the queue or upload new ones.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-100/50 relative overflow-hidden min-h-[300px]">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-md border border-slate-200 p-1 flex items-center z-10 whitespace-nowrap">
        <button
          onClick={() => setViewMode('original')}
          className={`px-3 py-1.5 md:px-4 rounded-full text-xs font-medium transition-colors ${viewMode === 'original' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Original
        </button>
        <button
          onClick={() => setViewMode('processed')}
          disabled={!processedUrl}
          className={`px-3 py-1.5 md:px-4 rounded-full text-xs font-medium transition-colors ${viewMode === 'processed' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'} ${!processedUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Processed
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
        <div 
          className="relative shadow-xl md:shadow-2xl bg-white transition-all duration-300 ring-4 md:ring-8 ring-white"
          style={{
            width: spec.widthPx,
            height: spec.heightPx,
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: `${spec.widthPx}/${spec.heightPx}`
          }}
        >
          {isGeneratingPreview || photo.isProcessing ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
               <span className="text-xs font-medium text-slate-500">
                  {photo.isProcessing ? 'AI Processing...' : 'Rendering Preview...'}
               </span>
             </div>
          ) : previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-slate-50" 
            />
          ) : null}

          {/* Professional Guidelines Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
             {/* Center Vertical Line */}
             <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-500/50 border-r border-dashed border-cyan-500"></div>
             
             {/* Eyes Line (1/3 from top) */}
             <div className="absolute top-[33.33%] left-0 w-full h-px bg-cyan-500/50 border-b border-dashed border-cyan-500">
                <span className="absolute right-1 -top-4 text-[9px] text-cyan-600 font-medium bg-white/70 px-1 rounded shadow-sm hidden md:inline">Eyes Line</span>
             </div>

             {/* Head Top Approx (around 10-12%) */}
             <div className="absolute top-[10%] left-1/4 w-1/2 h-px bg-red-400/20"></div>

             {/* Head Area Guide (Oval) */}
             <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[58%] h-[68%] border-2 border-cyan-500/30 rounded-[50%]"></div>
             
             {/* Shoulder Line/Area (Bottom 1/3 starts around 66%) */}
             <div className="absolute top-[75%] left-0 w-full h-px bg-red-400/20"></div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="h-auto py-2 md:py-0 md:h-12 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between px-4 md:px-6 text-xs text-slate-500 gap-y-2 flex-shrink-0">
         <div className="flex gap-4">
           <span>Dim: <strong className="text-slate-700">{spec.widthPx} x {spec.heightPx}</strong></span>
           <span className="hidden sm:inline">Print: <strong className="text-slate-700">{spec.widthMm} x {spec.heightMm} mm</strong></span>
         </div>
         <div className="flex items-center gap-1.5">
            <Maximize className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit: Auto-Crop Center</span>
            <span className="sm:hidden">Auto-Crop</span>
         </div>
      </div>
    </div>
  );
};