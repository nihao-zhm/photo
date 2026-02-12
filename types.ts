export interface IDSpec {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  widthPx: number; // Assuming 300 DPI
  heightPx: number;
  ratio: number;
}

export interface PhotoItem {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl: string | null;
  thumbnailUrl: string;
  name: string;
  isProcessing: boolean;
  error?: string;
}

export enum BackgroundColor {
  White = 'white',
  Blue = '#438edb',
  Red = '#db4343',
  Transparent = 'transparent'
}

export interface GenerationConfig {
  prompt: string;
  bgColor: BackgroundColor | string;
  specId: string;
}
