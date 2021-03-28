import { Place } from "./Place";
import { StatsMetadata } from "./StatsMetadata";
import { TrailClassification } from "./TrailClassification";
import { TrailCoordinates } from "./TrailCoordinates";

export interface Trail {
  name: string;
  code: string;
  description: string;
  classification: TrailClassification;
  startPos: Place;
  finalPos: Place;
  country: string;
  statsMetadata: StatsMetadata;
  lastUpdate: Date;
  maintainingSection: string;
  coordinates: TrailCoordinates[];
  locations: Place[];
}

export interface TrailList {}
