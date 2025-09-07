import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
        <path d="M10 3.5a1.5 1.5 0 013 0V0a1.5 1.5 0 01-3 0v3.5zM10 20a1.5 1.5 0 01-3 0v-3.5a1.5 1.5 0 013 0V20zM16.5 10a1.5 1.5 0 010-3H20a1.5 1.5 0 010 3h-3.5zM0 10a1.5 1.5 0 010-3h3.5a1.5 1.5 0 010 3H0zM5.43 5.43a1.5 1.5 0 012.12-2.12l1.06 1.06a1.5 1.5 0 01-2.12 2.12l-1.06-1.06zM12.37 12.37a1.5 1.5 0 012.12-2.12l1.06 1.06a1.5 1.5 0 01-2.12 2.12l-1.06-1.06zM5.43 14.57a1.5 1.5 0 01-2.12 2.12l-1.06-1.06a1.5 1.5 0 012.12-2.12l1.06 1.06zM12.37 7.63a1.5 1.5 0 01-2.12 2.12l-1.06-1.06a1.5 1.5 0 012.12-2.12l1.06 1.06z" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 flex items-center justify-center gap-3">
            <SparklesIcon className="w-8 h-8 text-violet-400" />
            AI Image Studio
        </h1>
        <p className="mt-2 text-lg text-neutral-300">
          Upload a scene and a person, and let AI blend them into a new masterpiece.
        </p>
      </div>
    </header>
  );
};

export default Header;
