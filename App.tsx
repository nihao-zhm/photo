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
  const [showPayModal, setShowPayModal] = useState(false); // 控制盈利弹窗

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

    setPhotos(prev => prev.map(p => 
      p.id === selectedPhoto.id ? { ...p, isProcessing: true, error: undefined } : p
    ));

    try {
      const sourceImage = selectedPhoto.processedUrl || selectedPhoto.originalUrl;
      // 这里确保 API Key 已连接
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
      alert("AI 引擎连接失败，请检查 Vercel 环境变量 VITE_GEMINI_API_KEY");
    }
  };

  // 盈利逻辑：点击下载时先弹出收款码
  const handleDownload = async () => {
    if (!selectedPhoto) return;
    setShowPayModal(true);
  };

  // 真正的下载执行函数
  const executeDownload = async () => {
    const source = selectedPhoto?.processedUrl || selectedPhoto?.originalUrl;
    if (!source) return;
    try {
      const finalImage = await cropAndResize(source, currentSpec);
      downloadImage(finalImage, `CFA_ID_${selectedPhoto?.name.replace(/\.[^/.]+$/, "")}.png`);
      setShowPayModal(false);
    } catch (e) {
      alert("生成失败，请重试");
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      <Sidebar 
        photos={photos}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRemove={handleRemovePhoto}
        onAddFiles={handleAddFiles}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0 z-20">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">ID</div>
             <div>
               <h1 className="font-bold text-base text-slate-800 leading-tight">CFA 考友 AI 证件照</h1>
               <p className="text-[10px] text-slate-400">已自动适配 600x600 像素标准</p>
             </div>
           </div>
           
           <div className="text-[10px] text-slate-500 font-medium bg-green-50 px-2 py-1 rounded border border-green-200">
              API 状态: {import.meta.env.VITE_GEMINI_API_KEY ? '已连接' : '未连接'}
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

      {/* 💰 盈利弹窗模块 */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl scale-100 animate-in fade-in zoom-in duration-300">
            <h3 className="text-lg font-bold text-slate-800">✨ 导出高清报名照</h3>
            <p className="text-sm text-slate-500 mt-2">支持 AI 算力支出，请我喝杯咖啡吧</p>
            
            {/* 请确保根目录有 pay-code.jpg */}
            <img src="/pay-code.jpg" className="w-48 h-48 mx-auto my-4 border-4 border-blue-50 rounded-xl shadow-inner" alt="收款码" />
            
            <div className="flex gap-3">
              <button onClick={() => setShowPayModal(false)} className="flex-1 py-2.5 text-slate-400 text-sm font-medium">以后再说</button>
              <button onClick={executeDownload} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all">
                已支付，立即下载
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 italic">CFA 考生互助，感谢你的支持！</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
