import React from 'react';
import Header from './components/Header';
import ImageReplacer from './components/ImageReplacer';
import PromoBanner from './components/PromoBanner';

function App() {
  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-100 font-sans">
      <Header />
      <div className="my-4 md:my-8">
        <PromoBanner />
      </div>
      <main className="container mx-auto p-4 md:p-8">
        <ImageReplacer />
      </main>
       <footer className="text-center p-4 text-neutral-400 text-sm mt-8">
        <p>Powered by Google Gemini. Built with React + Vite.</p>
      </footer>
    </div>
  );
}

export default App;
