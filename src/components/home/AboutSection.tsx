import React from 'react';

export default function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-gray-800 sm:text-4xl mb-8">
            Welcome to the Linguistics Association of Ghana
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We are dedicated to advancing the study and research of linguistics in Ghana,
            fostering collaboration among scholars, and promoting the preservation and
            documentation of Ghana's rich linguistic heritage.
          </p>
        </div>
      </div>
    </section>
  );
}
