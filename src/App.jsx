import React from 'react';
import logo from './assets/logo.png';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Centered block fills the screen height */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          {/* Bigger, responsive logo */}
          <img
            src={logo}
            alt="Hexoris"
            className="mx-auto mt-6 md:mt-10 h-[clamp(260px,50vh,640px)] w-auto"
          />


          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-primary">
            Renewable Battery Materials
          </h1>

          <p className="text-base md:text-xl text-gray-700 max-w-2xl mx-auto">
            We’re transforming waste biomass into next-generation battery anode
            materials, delivering high performance with a lower carbon footprint.
          </p>

          <p className="text-base md:text-4xl text-gray-700 max-w-2xl mx-auto">
            <b> Contact Us </b> 
          </p>

          <p className="text-lg md:text-2xl">
            <a href="mailto:info@hexoris.com" className="text-primary hover:underline">
              info@hexoris.com
            </a>
          </p>
        </div>
      </section>

      <footer className="p-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Hexoris Inc. All rights reserved.
      </footer>
    </div>
  );
}

export default App;