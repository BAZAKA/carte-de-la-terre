import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';
import type { CountryFeature } from '../types';

interface GlobeDisplayProps {
  countries: CountryFeature[];
  onCountryClick: (country: CountryFeature) => void;
}

const GlobeDisplay: React.FC<GlobeDisplayProps> = ({ countries, onCountryClick }) => {
    // FIX: Initialize useRef with null. The `useRef` hook requires an initial value.
    const globeEl = useRef<GlobeMethods | null>(null);

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.25;
            globeEl.current.controls().enableZoom = false; // Optional: disable zoom
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
        }
    }, []);
    
    const countryColors = useMemo(() => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        const map = new Map<string, string>();
        countries.forEach((country, i) => {
            map.set(country.properties.NAME, colors[i % colors.length]);
        });
        return map;
    }, [countries]);

    const getCapColor = useCallback((feat: object) => {
        const feature = feat as CountryFeature;
        return countryColors.get(feature.properties.NAME) || 'rgba(255, 255, 255, 0.3)';
    }, [countryColors]);

    const handlePolygonClick = useCallback((polygon: object, event: MouseEvent, { lat, lng }: { lat: number; lng: number; altitude: number; }) => {
        const country = polygon as CountryFeature;
        onCountryClick(country);
        if (globeEl.current) {
            globeEl.current.pointOfView({ lat: lat, lng: lng, altitude: 1.5 }, 1200);
        }
    }, [onCountryClick]);

    return (
        <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            polygonsData={countries}
            polygonCapColor={getCapColor}
            polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
            polygonStrokeColor={() => '#6b7280'}
            polygonLabel={({ properties }: { properties: CountryFeature['properties'] }) => `
                <div class="bg-gray-800 text-white text-sm p-2 rounded-md shadow-lg">
                    <b>${properties.NAME}</b>
                </div>
            `}
            onPolygonClick={handlePolygonClick}
            polygonsTransitionDuration={300}
        />
    );
};

export default GlobeDisplay;