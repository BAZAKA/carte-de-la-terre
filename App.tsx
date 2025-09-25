
import React, { useState, useEffect, useCallback } from 'react';
import { feature } from 'topojson-client';
import type { Objects, Topology } from 'topojson-specification';
import GlobeDisplay from './components/GlobeDisplay';
import type { CountryFeature } from './types';

const App: React.FC = () => {
  const [countries, setCountries] = useState<CountryFeature[] | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryFeature | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch('https://unpkg.com/world-atlas/countries-110m.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const worldAtlas = await response.json() as Topology<Objects<any>>;
        const countriesGeoJSON = feature(worldAtlas, worldAtlas.objects.countries);
        setCountries(countriesGeoJSON.features as CountryFeature[]);
      } catch (error) {
        console.error("Failed to fetch country data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryData();
  }, []);

  const handleCountryClick = useCallback((country: CountryFeature) => {
    setSelectedCountry(country);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-2xl animate-pulse">Loading Globe...</div>
        </div>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-full h-full">
            {countries && <GlobeDisplay countries={countries} onCountryClick={handleCountryClick} />}
          </div>
          <header className="absolute top-0 left-0 p-6 z-10 w-full flex justify-between items-start pointer-events-none">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-wider" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Interactive 3D Globe</h1>
                <p className="text-gray-300 mt-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Click on a country to see its name.</p>
            </div>
          </header>

          {selectedCountry && (
            <div 
              key={selectedCountry.properties.NAME}
              className="absolute bottom-8 left-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 shadow-lg z-10 animate-fade-in-up"
            >
              <h2 className="text-xl font-semibold">{selectedCountry.properties.NAME}</h2>
            </div>
          )}
        </>
      )}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
