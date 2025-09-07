import React from 'react';

const PromoBanner: React.FC = () => {
  const src = "https://i.ibb.co/hJ9r2jbN/replace.jpg";
  return (
    <section className="container mx-auto px-4 md:px-8">
      <div className="mx-auto max-w-3xl md:max-w-4xl rounded-3xl overflow-hidden shadow-lg border border-neutral-800 bg-neutral-900">
        <img
          src={src}
          alt="AI Image Studio example: inspiration, person, and replaced result"
          className="w-full h-auto object-contain md:object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default PromoBanner;
