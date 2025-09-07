import React, { useState, useEffect } from 'react';
import Button from './Button';
import LoadingOverlay from './LoadingOverlay';
import FileUpload from './FileUpload';
import { analyzeImage, generateReplacedImage } from '../services/geminiService';

// --- Icon Components ---
const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.691V5.006h-4.992a8.25 8.25 0 00-11.665 0l-3.182 3.182" />
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);


const ImageReplacer: React.FC = () => {
  const [targetImageFile, setTargetImageFile] = useState<File | null>(null);
  const [personImageFile, setPersonImageFile] = useState<File | null>(null);
  const [targetImageUrl, setTargetImageUrl] = useState<string | null>(null);
  const [personImageUrl, setPersonImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => { // Cleanup function to revoke URLs
      if (targetImageUrl) URL.revokeObjectURL(targetImageUrl);
      if (personImageUrl) URL.revokeObjectURL(personImageUrl);
    };
  }, []);

  useEffect(() => {
    if (targetImageFile) {
      setTargetImageUrl(URL.createObjectURL(targetImageFile));
      setGeneratedImageUrl(null);
    } else {
      setTargetImageUrl(null);
    }
  }, [targetImageFile]);

  useEffect(() => {
    if (personImageFile) {
      setPersonImageUrl(URL.createObjectURL(personImageFile));
      setGeneratedImageUrl(null);
    } else {
      setPersonImageUrl(null);
    }
  }, [personImageFile]);
  
  const handleGenerate = async () => {
    if (!targetImageFile || !personImageFile) {
      setError('Please upload both a target scene and a person image.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      setLoadingMessage('Analyzing scene...');
      const sceneDescription = await analyzeImage(targetImageFile);
      
      setLoadingMessage('Placing person into scene...');
      const imageUrl = await generateReplacedImage(sceneDescription, personImageFile);
      
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during the process.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTargetImageFile(null);
    setPersonImageFile(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `ai-generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (platform: 'facebook' | 'linkedin') => {
    const appUrl = window.location.href;
    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {isLoading && <LoadingOverlay message={loadingMessage} />}
      <div className="max-w-4xl mx-auto">
        
        {generatedImageUrl ? (
            <div className="text-center animate-fade-in">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-cyan-600 mb-4">
                    Your Masterpiece is Ready!
                </h2>
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-2 md:p-4 inline-block">
                    <img src={generatedImageUrl} alt="Generated final" className="max-w-full mx-auto rounded-lg object-contain" style={{maxHeight: '70vh'}}/>
                </div>
                <div className="mt-8 space-y-4">
                  <div className='flex items-center justify-center gap-4'>
                    <Button onClick={handleDownload} icon={<DownloadIcon className="h-5 w-5 mr-2" />} className="bg-green-600 hover:bg-green-700">
                        Download
                    </Button>
                    <Button onClick={handleReset} icon={<ArrowPathIcon className="h-5 w-5 mr-2" />} className="bg-slate-700 hover:bg-slate-800">
                        Create Another
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-4">
                     <p className="text-sm text-slate-500">Share:</p>
                     <button onClick={() => handleShare('linkedin')} className="text-slate-500 hover:text-[#0077B5] transition-colors"><LinkedInIcon className="w-6 h-6"/></button>
                     <button onClick={() => handleShare('facebook')} className="text-slate-500 hover:text-[#1877F2] transition-colors"><FacebookIcon className="w-6 h-6"/></button>
                  </div>
                   <p className="text-xs text-slate-400">Hint: Download your image to add it to your post!</p>
                </div>
            </div>
        ) : (
             <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl shadow-sm p-6 md:p-10 animate-fade-in">
                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h3 className="text-xl font-bold text-center mb-4"><span className="text-indigo-500 font-black mr-2">1</span> Choose a Scene</h3>
                        <FileUpload id="target-image" onFileChange={setTargetImageFile} previewUrl={targetImageUrl} />
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-center mb-4"><span className="text-indigo-500 font-black mr-2">2</span> Add a Person</h3>
                        <FileUpload id="person-image" onFileChange={setPersonImageFile} previewUrl={personImageUrl} />
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <Button 
                        onClick={handleGenerate} 
                        disabled={!targetImageFile || !personImageFile || isLoading}
                        isLoading={isLoading}
                        className="px-10 py-3 text-base font-bold transform hover:scale-105"
                    >
                        Generate Image
                    </Button>
                </div>
            </div>
        )}
      </div>
    </>
  );
};

export default ImageReplacer;