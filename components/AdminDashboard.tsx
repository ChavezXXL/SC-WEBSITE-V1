
import React, { useState, useRef } from 'react';
import { useData } from './DataContext';
import { Trash2, Plus, Save, RotateCcw, Image, Bot, Lock, Layout, Upload, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const { 
    galleryItems, addGalleryItem, removeGalleryItem, 
    aiInstruction, updateAiInstruction, 
    comparisonLeft, comparisonRight, updateComparisonImages,
    resetToDefaults 
  } = useData();
  
  const [activeTab, setActiveTab] = useState<'gallery' | 'ai' | 'home'>('gallery');

  // Form States
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [tempAiInstruction, setTempAiInstruction] = useState(aiInstruction);
  
  // Home Editor States
  // Initialize with current context values (which are now the updated defaults if not overridden)
  const [tempLeftImage, setTempLeftImage] = useState(comparisonLeft);
  const [tempRightImage, setTempRightImage] = useState(comparisonRight);

  // Hidden File Inputs
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const leftFileRef = useRef<HTMLInputElement>(null);
  const rightFileRef = useRef<HTMLInputElement>(null);

  // --- IMAGE PROCESSING LOGIC (Resize & Compress) ---
  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000; // Limit width to prevent localStorage overflow
          const scaleSize = MAX_WIDTH / img.width;
          
          // Only resize if image is massive, otherwise keep scale 1
          const scale = scaleSize < 1 ? scaleSize : 1;
          
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Compress to JPEG 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // --- GALLERY HANDLERS ---
  const onGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      try {
        const base64 = await handleFileUpload(e.target.files[0]);
        setNewImageUrl(base64);
      } catch (err) {
        alert("Error processing image. Try a smaller file.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl && newImageTitle) {
      addGalleryItem({ url: newImageUrl, title: newImageTitle });
      setNewImageUrl('');
      setNewImageTitle('');
    }
  };

  // --- HOME EDITOR HANDLERS ---
  const onHomeFileChange = async (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      try {
        const base64 = await handleFileUpload(e.target.files[0]);
        if (side === 'left') setTempLeftImage(base64);
        else setTempRightImage(base64);
      } catch (err) {
        alert("Error processing image. Try a smaller file.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSaveHome = () => {
    updateComparisonImages(tempLeftImage, tempRightImage);
    alert('Home Page Images Updated Successfully!');
  };

  const handleSaveAi = () => {
    updateAiInstruction(tempAiInstruction);
    alert('AI System Instruction Updated Successfully!');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight">Admin Command Center</h1>
                <p className="text-xs text-zinc-500">Authorized Personnel Only</p>
            </div>
        </div>
        <button 
          onClick={onExit}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
        >
          Exit Admin Mode
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 hidden md:block">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'gallery' 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Image className="w-5 h-5" />
              <span className="font-medium">Gallery Manager</span>
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'home' 
                  ? 'bg-teal-600/10 text-teal-400 border border-teal-600/20' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Layout className="w-5 h-5" />
              <span className="font-medium">Home Editor</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'ai' 
                  ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Bot className="w-5 h-5" />
              <span className="font-medium">AI Configuration</span>
            </button>
          </nav>

          <div className="absolute bottom-6 left-6">
             <button 
                onClick={() => {
                    if(confirm("Are you sure you want to reset all data to default? This cannot be undone.")) {
                        resetToDefaults();
                        window.location.reload(); // Force reload to clear inputs
                    }
                }}
                className="flex items-center gap-2 text-xs text-zinc-600 hover:text-red-400 transition-colors"
             >
                <RotateCcw className="w-3 h-3" /> Reset Data to Default
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          
          {/* Processing Overlay */}
          {isProcessing && (
              <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                  <span className="text-white font-medium">Compressing Image...</span>
              </div>
          )}

          {/* Mobile Tabs */}
          <div className="md:hidden flex mb-6 bg-zinc-900 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${activeTab === 'gallery' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
                Gallery
            </button>
            <button 
                onClick={() => setActiveTab('home')}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${activeTab === 'home' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
                Home
            </button>
            <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${activeTab === 'ai' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
                AI
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                {/* Add New Image */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-400" /> Add New Image
                  </h2>
                  <form onSubmit={handleAddImage} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs uppercase text-zinc-500 font-semibold">Image Source</label>
                      <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="Paste URL or Upload ->"
                            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                        />
                        <input 
                            type="file" 
                            ref={galleryFileRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={onGalleryFileChange}
                        />
                        <button 
                            type="button"
                            onClick={() => galleryFileRef.current?.click()}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 rounded-lg border border-zinc-700 transition-colors"
                            title="Upload from Device"
                        >
                            <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase text-zinc-500 font-semibold">Title</label>
                      <input 
                        type="text" 
                        required
                        value={newImageTitle}
                        onChange={(e) => setNewImageTitle(e.target.value)}
                        placeholder="Ex: Precision Part A"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                    
                    {newImageUrl && (
                        <div className="md:col-span-3">
                             <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-700 relative">
                                <img src={newImageUrl} className="w-full h-full object-cover" alt="Preview" />
                                <button 
                                    type="button" 
                                    onClick={() => setNewImageUrl('')} 
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                             </div>
                        </div>
                    )}

                    <div className="md:col-span-3 flex justify-end">
                       <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Add to Gallery
                       </button>
                    </div>
                  </form>
                </div>

                {/* Existing Images */}
                <div>
                   <h2 className="text-lg font-bold mb-4">Current Gallery Items ({galleryItems.length})</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryItems.map((item) => (
                        <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex gap-4 items-center group hover:border-zinc-600 transition-colors">
                           <img src={item.url} alt={item.title} className="w-20 h-20 object-cover rounded-md bg-zinc-800" />
                           <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{item.title}</h3>
                              <p className="text-xs text-zinc-500 truncate">Image ID: {item.id}</p>
                           </div>
                           <button 
                              onClick={() => removeGalleryItem(item.id)}
                              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                              title="Remove Image"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'home' && (
              <div className="space-y-8">
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Layout className="w-5 h-5 text-teal-400" /> Comparison Slider Images
                            </h2>
                            <p className="text-sm text-zinc-400 mt-1">
                                Upload specific images for the slider. <span className="text-teal-400">Left</span> is Finish, <span className="text-zinc-400">Right</span> is Raw.
                            </p>
                        </div>
                        <button 
                            onClick={handleSaveHome}
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Image Input */}
                        <div className="space-y-4">
                            <label className="block text-xs uppercase text-[#00FFBD] font-bold tracking-widest">Left Image (Finished)</label>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={tempLeftImage.startsWith('data:') ? '(Uploaded Image)' : tempLeftImage}
                                    onChange={(e) => !tempLeftImage.startsWith('data:') && setTempLeftImage(e.target.value)}
                                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-zinc-400"
                                    placeholder="Paste URL or Upload ->"
                                    readOnly={tempLeftImage.startsWith('data:')}
                                />
                                <input 
                                    type="file" 
                                    ref={leftFileRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => onHomeFileChange(e, 'left')}
                                />
                                <button 
                                    onClick={() => leftFileRef.current?.click()}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 rounded-lg border border-zinc-700 transition-colors"
                                    title="Upload File"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden border border-zinc-800 relative group">
                                <img src={tempLeftImage} alt="Preview Left" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="bg-black/50 px-2 py-1 rounded text-xs backdrop-blur-md">Preview: Finished</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Input */}
                        <div className="space-y-4">
                            <label className="block text-xs uppercase text-zinc-500 font-bold tracking-widest">Right Image (Raw)</label>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={tempRightImage.startsWith('data:') ? '(Uploaded Image)' : tempRightImage}
                                    onChange={(e) => !tempRightImage.startsWith('data:') && setTempRightImage(e.target.value)}
                                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-500 text-zinc-400"
                                    placeholder="Paste URL or Upload ->"
                                    readOnly={tempRightImage.startsWith('data:')}
                                />
                                <input 
                                    type="file" 
                                    ref={rightFileRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => onHomeFileChange(e, 'right')}
                                />
                                <button 
                                    onClick={() => rightFileRef.current?.click()}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 rounded-lg border border-zinc-700 transition-colors"
                                    title="Upload File"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden border border-zinc-800 relative">
                                <img src={tempRightImage} alt="Preview Right" className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="bg-black/50 px-2 py-1 rounded text-xs backdrop-blur-md">Preview: Raw</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Bot className="w-5 h-5 text-purple-400" /> System Instruction
                            </h2>
                            <p className="text-sm text-zinc-400 mt-1">
                                This defines the personality, knowledge, and behavior of the AI Consultant.
                            </p>
                        </div>
                        <button 
                            onClick={handleSaveAi}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                    
                    <textarea 
                        value={tempAiInstruction}
                        onChange={(e) => setTempAiInstruction(e.target.value)}
                        className="w-full h-[500px] bg-zinc-950 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-zinc-300 focus:outline-none focus:border-purple-500 leading-relaxed"
                    />
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
