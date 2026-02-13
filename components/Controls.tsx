import React, { useState } from 'react';
import { IDSpec } from '../types';
import { ID_SPECS, PRESET_BACKGROUNDS, SUGGESTED_PROMPTS } from '../constants';
import { Wand2, Download, AlertCircle, Check, Loader2 } from 'lucide-react';

interface ControlsProps {
  currentSpec: IDSpec;
  onSpecChange: (spec: IDSpec) => void;
  isProcessing: boolean;
  onProcessAI: (prompt: string) => void;
  onDownload: () => void;
  hasProcessedImage: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  currentSpec,
  onSpecChange,
  isProcessing,
  onProcessAI,
  onDownload,
  hasProcessedImage
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedBg, setSelectedBg] = useState<string | null>(null);

  const handleBgClick = (bgValue: string, bgName: string, promptTemplate?: string) => {
    setSelectedBg(bgValue);
    if (promptTemplate) {
      setCustomPrompt(promptTemplate);
    } else {
      setCustomPrompt(`Change background to solid ${bgName} color. Keep the person exactly the same.`);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  const handleRunAI = () => {
    if (!customPrompt.trim()) return;
    onProcessAI(customPrompt);
  };

  return (
    <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col h-[50%] md:h-full flex-shrink-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 md:space-y-8">
        
        {/* Spec Selection */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ID Specification</h3>
          <div className="grid grid-cols-2 gap-2">
            {ID_SPECS.map((spec) => (
              <button
                key={spec.id}
                onClick={() => onSpecChange(spec)}
                className={`
                  text-left p-2.5 md:p-3 rounded-lg border text-sm transition-all active:scale-95 duration-150
                  ${currentSpec.id === spec.id 
                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}
                `}
              >
                <div className="font-semibold truncate">{spec.name}</div>
                <div className="text-xs opacity-75 mt-0.5">{spec.widthMm}x{spec.heightMm}mm</div>
              </button>
            ))}
          </div>
        </section>

        {/* AI Processing */}
        <section>
          <div className="flex items-center gap-2 mb-3">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Edit (Gemini 2.5)</h3>
             <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">New</span>
          </div>
          
          {/* Quick BG Tools */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2 font-medium">Quick Backgrounds</p>
            <div className="flex gap-3 flex-wrap">
              {PRESET_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.name}
                  onClick={() => handleBgClick(bg.value, bg.name, (bg as any).prompt)}
                  className={`
                    w-11 h-11 md:w-10 md:h-10 rounded-full border-2 transition-transform active:scale-90 shadow-sm
                    ${bg.class}
                    ${selectedBg === bg.value ? 'border-slate-900 scale-110' : 'border-transparent'}
                  `}
                  title={`Set background to ${bg.name}`}
                >
                  {selectedBg === bg.value && <Check className={`w-5 h-5 mx-auto ${bg.name === 'White' || bg.name === 'Cadre' ? 'text-slate-900' : 'text-white'}`} />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe your edit..."
                className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-20 md:h-24 bg-slate-50"
              />
              <button
                onClick={handleRunAI}
                disabled={isProcessing || !customPrompt.trim()}
                className="absolute bottom-2 right-2 p-2 md:p-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-sm active:bg-blue-800"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors text-left truncate max-w-full active:bg-slate-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Output */}
        <section className="pt-4 border-t border-slate-100 pb-2 md:pb-0">
           <button
            onClick={onDownload}
            disabled={!hasProcessedImage}
            className={`
              w-full py-3.5 md:py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-sm active:scale-[0.98]
              ${hasProcessedImage 
                ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
          >
            <Download className="w-4 h-4" />
            <span>Download Photo</span>
          </button>
          {!hasProcessedImage && (
             <div className="mt-3 flex gap-2 items-start text-amber-600 bg-amber-50 p-3 rounded-md text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Upload a photo or generate an edit to enable download.</p>
             </div>
          )}
        </section>
        
        {/* Bottom padding for mobile safe area scroll */}
        <div className="h-[env(safe-area-inset-bottom)] w-full md:hidden"></div>
      </div>
    </div>
  );
};