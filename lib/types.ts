/** Amap POI search result (simplified for client) */
export interface AmapPOI {
  id: string;
  name: string;
  address: string;
  district: string; // adname e.g. 福田区
  businessArea: string; // business_area e.g. 福田中心区
  location: string; // "lng,lat"
  lng: number;
  lat: number;
  typecode: string;
}

/** Diagnosis scorecard — 5 dimensions, 0-10 scale */
export interface Scorecard {
  location: number;
  quality: number;
  leasing: number;
  investment: number;
  outlook: number;
}

/** SWOT point */
export interface SWOTPoint {
  point: string;
}

/** Full diagnosis */
export interface Diagnosis {
  summary: string;
  strengths: SWOTPoint[];
  weaknesses: SWOTPoint[];
  opportunities: SWOTPoint[];
  threats: SWOTPoint[];
  scorecard: Scorecard;
}

/** Peer comparison entry */
export interface PeerComparison {
  project: string;
  rent: number;
  vacancy: number;
}

/** Complete diagnosis result from API */
export interface DiagnosisResult {
  diagnosis: Diagnosis;
  peerComparison: PeerComparison[];
}
