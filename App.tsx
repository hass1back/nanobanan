import React from 'react';
import Header from './components/Header';
import ImageReplacer from './components/ImageReplacer';

function App() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <ImageReplacer />
      </main>
       <footer className="text-center p-4 text-slate-500 text-sm mt-8">
        <p>Powered by Google Gemini. Created by a world-class senior frontend React engineer.</p>
      </footer>
    </div>
  );
}

export default App;