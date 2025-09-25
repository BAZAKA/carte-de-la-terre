
import type { Feature, Geometry } from 'geojson';

export interface CountryProperties {
  NAME: string;
  [key: string]: any; 
}

export type CountryFeature = Feature<Geometry, CountryProperties>;
