import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PhotoEditor } from './components/PhotoEditor';
import { Controls } from './components/Controls';
import { PhotoItem, IDSpec } from './types';
import { ID_SPECS } from './constants';
import { fileToBase64, cropAndResize, downloadImage } from './services/imageUtils';
import { editImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentSpec, setCurrentSpec] = useState<IDSpec>(ID_SPECS[0]);

  const selectedPhoto = photos.find(p => p.id === selectedId) || null;

  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos: PhotoItem[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const base64 = await fileToBase64(file);
        newPhotos.push({
          id: crypto.randomUUID(),
          file,
          originalUrl: base64,
          processedUrl: null,
          thumbnailUrl: base64,
          name: file.name,
          isProcessing: false
        });
      }
      setPhotos(prev => [...prev, ...newPhotos]);
      if (!selectedId && newPhotos.length > 0) {
        setSelectedId(newPhotos[0].id);
      }
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleProcessAI = async (prompt: string) => {
    if (!selectedPhoto) return;

    // Set Processing State
    setPhotos(prev => prev.map(p => 
      p.id === selectedPhoto.id ? { ...p, isProcessing: true, error: undefined } : p
    ));

    try {
      // We use the *processedUrl* as source if it exists, allowing iterative edits?
      // Actually, for simplicity and stability, let's always edit the original or last processed.
      // To allow "Undo" we might need history, but let's stick to "Original -> Processed".
      // If user edits again, we use the already processed image as base to keep previous changes?
      // Yes, otherwise adding a filter then changing background would reset.
      
      const sourceImage = selectedPhoto.processedUrl || selectedPhoto.originalUrl;
      const resultBase64 = await editImageWithGemini(sourceImage, prompt);

      setPhotos(prev => prev.map(p => 
        p.id === selectedPhoto.id ? { 
          ...p, 
          processedUrl: resultBase64, 
          isProcessing: false 
        } : p
      ));
    } catch (error) {
      console.error(error);
      setPhotos(prev => prev.map(p => 
        p.id === selectedPhoto.id ? { ...p, isProcessing: false, error: "AI Processing Failed" } : p
      ));
      alert("AI Processing Failed. Please check API Key or try again.");
    }
  };

  const handleDownload = async () => {
    if (!selectedPhoto) return;
    
    // The final download needs to be the crop of the processed (or original) image
    const source = selectedPhoto.processedUrl || selectedPhoto.originalUrl;
    
    try {
      const finalImage = await cropAndResize(source, currentSpec);
      downloadImage(finalImage, `ID_${currentSpec.id}_${selectedPhoto.name.replace(/\.[^/.]+$/, "")}.png`);
    } catch (e) {
      alert("Error generating download image");
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar 
        photos={photos}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRemove={handleRemovePhoto}
        onAddFiles={handleAddFiles}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0 z-20">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
               ID
             </div>
             <h1 className="font-bold text-lg text-slate-800 tracking-tight">Pro Studio <span className="text-blue-600">AI</span></h1>
           </div>
           
           <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              API Key: {process.env.API_KEY ? 'Connected' : 'Missing'}
           </div>
        </header>

        <div className="flex-1 flex min-h-0">
          <PhotoEditor 
             photo={selectedPhoto}
             spec={currentSpec}
             processedUrl={selectedPhoto?.processedUrl || null}
          />
          <Controls 
             currentSpec={currentSpec}
             onSpecChange={setCurrentSpec}
             isProcessing={selectedPhoto?.isProcessing || false}
             onProcessAI={handleProcessAI}
             onDownload={handleDownload}
             hasProcessedImage={!!selectedPhoto}
          />
        </div>
      </div>
    </div>
  );
};

export default App;