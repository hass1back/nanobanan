import React, { useRef } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
  id: string;
  label?: string;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M17.25 8.25L12 12.75 6.75 8.25" transform="translate(0, -2)"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12.75v6c0 1.657 3.358 3 7.5 3s7.5-1.343 7.5-3v-6" />
    </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, previewUrl, label, id }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileChange(event.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(inputRef.current) {
        inputRef.current.value = "";
    }
    onFileChange(null);
  }

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      <div 
        onClick={handleClick} 
        className="mt-1 relative flex justify-center items-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-white hover:border-indigo-500 transition-colors duration-200 min-h-[250px]"
      >
        {previewUrl ? (
          <div className="relative">
            <img src={previewUrl} alt="Preview" className="max-h-52 rounded-md object-contain" />
            <button onClick={handleRemove} className="absolute -top-2 -right-2 bg-slate-100 rounded-full p-0.5 text-slate-500 hover:text-slate-800 hover:scale-110 transition-transform">
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="space-y-1 text-center">
             <UploadIcon />
            <div className="flex text-sm text-slate-600">
              <p className="pl-1">Click to upload an image</p>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
      <input
        id={id}
        name={id}
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="sr-only"
      />
    </div>
  );
};

export default FileUpload;